import { pool } from './db.ts';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { uploadToCloudinary, isCloudinaryConfigured } from './cloudinary.ts';

const AUTH_SECRET = process.env.ADMIN_SECRET || 'royal300_admin_secret_key_2026';

// Helper: check admin auth
export function verifyAdminToken(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/royal300_admin_token=([^;]+)/);
  const token = match ? match[1] : request.headers.get('x-admin-token');
  if (!token) return false;

  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return false;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('hex');
    if (signature !== expectedSig) return false;

    const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    // Valid for 30 days
    if (Date.now() - payload.timestamp > 30 * 24 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

function createAdminToken(): string {
  const payload = { role: 'admin', timestamp: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('hex');
  return `${data}.${signature}`;
}

function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeJsonStringify(val: any, fallback: any = []): string {
  if (val === undefined || val === null) {
    return JSON.stringify(fallback);
  }
  if (typeof val === 'string') {
    if (val === '[object Object]') return JSON.stringify(fallback);
    try {
      JSON.parse(val);
      return val;
    } catch {
      return JSON.stringify(val);
    }
  }
  try {
    return JSON.stringify(val);
  } catch {
    return JSON.stringify(fallback);
  }
}


// Find base upload directory
function getUploadDir(): string {
  // In production VPS, check if /var/www/royal300_portfolio/public/uploads exists or use public/uploads
  const possiblePaths = [
    path.resolve(process.cwd(), 'public/uploads'),
    path.resolve(process.cwd(), '.output/public/uploads'),
    path.resolve('/var/www/royal300_portfolio/public/uploads'),
    path.resolve('/var/www/royal300_portfolio/uploads'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }

  const defaultPath = path.resolve(process.cwd(), 'public/uploads');
  fs.mkdirSync(defaultPath, { recursive: true });
  return defaultPath;
}

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // Only handle /api/ and /uploads/
  if (pathname.startsWith('/uploads/')) {
    return serveUploadedFile(pathname, request);
  }

  if (!pathname.startsWith('/api/')) {
    return null;
  }

  try {
    // -------------------------------------------------------------
    // PUBLIC APIS
    // -------------------------------------------------------------

    // 1. GET /api/clients - get all active clients with their media
    if (pathname === '/api/clients' && method === 'GET') {
      const [clientRows] = (await pool.query(
        'SELECT * FROM clients WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
      )) as any[];

      const [mediaRows] = (await pool.query(
        'SELECT * FROM client_media ORDER BY display_order ASC, id ASC'
      )) as any[];

      const clients = clientRows.map((c: any) => {
        const clientMedia = mediaRows.filter((m: any) => m.client_id === c.id);
        const creatives = clientMedia
          .filter((m: any) => m.type === 'creative')
          .map((m: any) => ({
            id: String(m.id),
            title: m.title || '',
            category: m.category || '',
            image: m.file_url,
            description: m.description || '',
          }));

        const reels = clientMedia
          .filter((m: any) => m.type === 'reel')
          .map((m: any) => ({
            id: String(m.id),
            title: m.title || '',
            category: m.category || '',
            poster: m.poster_url || m.file_url,
            videoUrl: m.file_url,
            views: m.views || '',
            duration: m.duration || '',
          }));

        return {
          id: c.id,
          slug: c.slug,
          no: c.no || '01',
          name: c.name,
          client: c.client_title || c.name,
          category: c.category || '',
          copy: c.copy || '',
          fullDescription: c.full_description || '',
          heroImage: c.hero_image || '',
          metrics: typeof c.metrics === 'string' ? JSON.parse(c.metrics) : c.metrics || [],
          links: typeof c.links === 'string' ? JSON.parse(c.links) : c.links || {},
          servicesProvided:
            typeof c.services_provided === 'string'
              ? JSON.parse(c.services_provided)
              : c.services_provided || [],
          categories:
            typeof c.categories === 'string' ? JSON.parse(c.categories) : c.categories || ['All'],
          creatives,
          reels,
        };
      });

      return jsonResponse({ success: true, clients });
    }

    // 2. GET /api/clients/:slug - single client with full media
    const slugMatch = pathname.match(/^\/api\/clients\/([a-zA-Z0-9_-]+)$/);
    if (slugMatch && method === 'GET') {
      const slug = slugMatch[1];
      const [clientRows] = (await pool.query('SELECT * FROM clients WHERE slug = ? LIMIT 1', [
        slug,
      ])) as any[];

      if (clientRows.length === 0) {
        return jsonResponse({ success: false, error: 'Client not found' }, 404);
      }

      const c = clientRows[0];
      const [mediaRows] = (await pool.query(
        'SELECT * FROM client_media WHERE client_id = ? ORDER BY display_order ASC, id ASC',
        [c.id]
      )) as any[];

      const creatives = mediaRows
        .filter((m: any) => m.type === 'creative')
        .map((m: any) => ({
          id: String(m.id),
          title: m.title || '',
          category: m.category || '',
          image: m.file_url,
          description: m.description || '',
        }));

      const reels = mediaRows
        .filter((m: any) => m.type === 'reel')
        .map((m: any) => ({
          id: String(m.id),
          title: m.title || '',
          category: m.category || '',
          poster: m.poster_url || m.file_url,
          videoUrl: m.file_url,
          views: m.views || '',
          duration: m.duration || '',
        }));

      const client = {
        id: c.id,
        slug: c.slug,
        no: c.no || '01',
        name: c.name,
        client: c.client_title || c.name,
        category: c.category || '',
        copy: c.copy || '',
        fullDescription: c.full_description || '',
        heroImage: c.hero_image || '',
        metrics: typeof c.metrics === 'string' ? JSON.parse(c.metrics) : c.metrics || [],
        links: typeof c.links === 'string' ? JSON.parse(c.links) : c.links || {},
        servicesProvided:
          typeof c.services_provided === 'string'
            ? JSON.parse(c.services_provided)
            : c.services_provided || [],
        categories:
          typeof c.categories === 'string' ? JSON.parse(c.categories) : c.categories || ['All'],
        creatives,
        reels,
      };

      return jsonResponse({ success: true, client });
    }

    // 3. GET /api/settings - public site settings (currently: logo)
    if (pathname === '/api/settings' && method === 'GET') {
      const [rows] = (await pool.query(
        'SELECT value_text FROM admin_settings WHERE key_name = "site_logo" LIMIT 1'
      )) as any[];
      const logoUrl = rows.length > 0 && rows[0].value_text ? rows[0].value_text : '/logo1.png';
      return jsonResponse({ success: true, logoUrl });
    }

    // -------------------------------------------------------------
    // AUTH APIS
    // -------------------------------------------------------------

    // POST /api/admin/login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { password } = body;

      const [rows] = (await pool.query(
        'SELECT value_text FROM admin_settings WHERE key_name = "admin_password" LIMIT 1'
      )) as any[];

      const correctPassword = rows.length > 0 ? rows[0].value_text : 'Royal300@2026';

      if (password !== correctPassword) {
        return jsonResponse({ success: false, error: 'Invalid admin credentials' }, 401);
      }

      const token = createAdminToken();
      return jsonResponse(
        { success: true, message: 'Authenticated' },
        200,
        {
          'Set-Cookie': `royal300_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
        }
      );
    }

    // GET /api/admin/check - check if logged in
    if (pathname === '/api/admin/check' && method === 'GET') {
      const isAuthenticated = verifyAdminToken(request);
      return jsonResponse({ success: true, authenticated: isAuthenticated });
    }

    // POST /api/admin/logout
    if (pathname === '/api/admin/logout' && method === 'POST') {
      return jsonResponse(
        { success: true, message: 'Logged out' },
        200,
        {
          'Set-Cookie': `royal300_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
        }
      );
    }

    // -------------------------------------------------------------
    // PROTECTED ADMIN APIS
    // -------------------------------------------------------------
    if (pathname.startsWith('/api/admin/')) {
      if (!verifyAdminToken(request)) {
        return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
      }

      // GET /api/admin/clients - list all clients including inactive
      if (pathname === '/api/admin/clients' && method === 'GET') {
        const [clientRows] = (await pool.query(
          'SELECT * FROM clients ORDER BY display_order ASC, id ASC'
        )) as any[];

        const [mediaRows] = (await pool.query(
          'SELECT * FROM client_media ORDER BY display_order ASC, id ASC'
        )) as any[];

        const clients = clientRows.map((c: any) => {
          const clientMedia = mediaRows.filter((m: any) => m.client_id === c.id);
          return {
            id: c.id,
            slug: c.slug,
            no: c.no || '01',
            name: c.name,
            client_title: c.client_title || '',
            category: c.category || '',
            copy: c.copy || '',
            full_description: c.full_description || '',
            hero_image: c.hero_image || '',
            metrics: typeof c.metrics === 'string' ? JSON.parse(c.metrics) : c.metrics || [],
            links: typeof c.links === 'string' ? JSON.parse(c.links) : c.links || {},
            services_provided:
              typeof c.services_provided === 'string'
                ? JSON.parse(c.services_provided)
                : c.services_provided || [],
            categories:
              typeof c.categories === 'string' ? JSON.parse(c.categories) : c.categories || ['All'],
            display_order: c.display_order || 0,
            is_active: Boolean(c.is_active),
            media_count: clientMedia.length,
            creatives: clientMedia.filter((m: any) => m.type === 'creative'),
            reels: clientMedia.filter((m: any) => m.type === 'reel'),
          };
        });

        return jsonResponse({ success: true, clients });
      }

      // POST /api/admin/clients - create client
      if (pathname === '/api/admin/clients' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const name = (body.name || '').trim();
        if (!name) {
          return jsonResponse({ success: false, error: 'Client name is required' }, 400);
        }

        let baseSlug = body.slug ? slugify(body.slug) : slugify(name);
        if (!baseSlug) baseSlug = 'client';

        // Ensure unique slug
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (true) {
          const [exists] = (await pool.query(
            'SELECT id FROM clients WHERE slug = ? LIMIT 1',
            [uniqueSlug]
          )) as any[];
          if (exists.length === 0) break;
          counter++;
          uniqueSlug = `${baseSlug}-${counter}`;
        }

        // Get max display order and count to format project 'no'
        const [maxRow] = (await pool.query(
          'SELECT MAX(display_order) as max_order, COUNT(*) as total FROM clients'
        )) as any[];
        const nextOrder = (maxRow[0]?.max_order || 0) + 1;
        const nextNo = String((maxRow[0]?.total || 0) + 1).padStart(2, '0');

        const clientTitle = body.client_title || name;
        const category = body.category || 'Digital Marketing • Social Media';
        const copy = body.copy || '';
        const fullDesc = body.full_description || '';
        const heroImage = body.hero_image || '';
        const metrics = Array.isArray(body.metrics) ? body.metrics : [];
        const links = typeof body.links === 'object' ? body.links : {};
        const servicesProvided = Array.isArray(body.services_provided)
          ? body.services_provided
          : ['Social Media Management', 'Brand Strategy'];
        const categories = Array.isArray(body.categories) && body.categories.length > 0
          ? body.categories
          : ['All', 'Social Campaign', 'Ad Creatives', 'Reels'];

        const [result] = (await pool.query(
          `INSERT INTO clients 
          (\`slug\`, \`no\`, \`name\`, \`client_title\`, \`category\`, \`copy\`, \`full_description\`, \`hero_image\`, \`metrics\`, \`links\`, \`services_provided\`, \`categories\`, \`display_order\`, \`is_active\`)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            uniqueSlug,
            body.no || nextNo,
            name,
            clientTitle,
            category,
            copy,
            fullDesc,
            heroImage,
            safeJsonStringify(metrics, []),
            safeJsonStringify(links, {}),
            safeJsonStringify(servicesProvided, []),
            safeJsonStringify(categories, ['All']),
            nextOrder,
          ]
        )) as any[];

        const newId = result.insertId;
        return jsonResponse({
          success: true,
          client: { id: newId, slug: uniqueSlug, name, no: nextNo },
        });
      }

      // PUT /api/admin/clients/:id - update client
      const updateMatch = pathname.match(/^\/api\/admin\/clients\/(\d+)$/);
      if (updateMatch && method === 'PUT') {
        const id = parseInt(updateMatch[1], 10);
        const body = await request.json().catch(() => ({}));

        const [exists] = (await pool.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [id])) as any[];
        if (exists.length === 0) {
          return jsonResponse({ success: false, error: 'Client not found' }, 404);
        }

        const current = exists[0];
        let slug = body.slug !== undefined ? slugify(body.slug) : current.slug;
        if (!slug && body.name) slug = slugify(body.name);

        // Check if slug taken by another client
        if (slug !== current.slug) {
          const [slugExists] = (await pool.query(
            'SELECT id FROM clients WHERE slug = ? AND id != ? LIMIT 1',
            [slug, id]
          )) as any[];
          if (slugExists.length > 0) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
          }
        }

        const name = body.name !== undefined ? body.name : current.name;
        const clientTitle = body.client_title !== undefined ? body.client_title : current.client_title;
        const category = body.category !== undefined ? body.category : current.category;
        const copy = body.copy !== undefined ? body.copy : current.copy;
        const fullDesc =
          body.full_description !== undefined ? body.full_description : current.full_description;
        const heroImage = body.hero_image !== undefined ? body.hero_image : current.hero_image;
        const metrics = safeJsonStringify(
          body.metrics !== undefined ? body.metrics : current.metrics,
          []
        );
        const links = safeJsonStringify(
          body.links !== undefined ? body.links : current.links,
          {}
        );
        const servicesProvided = safeJsonStringify(
          body.services_provided !== undefined ? body.services_provided : current.services_provided,
          []
        );
        const categories = safeJsonStringify(
          body.categories !== undefined ? body.categories : current.categories,
          ['All']
        );
        const no = body.no !== undefined ? body.no : current.no;
        const displayOrder =
          body.display_order !== undefined ? body.display_order : current.display_order;
        const isActive = body.is_active !== undefined ? (body.is_active ? 1 : 0) : current.is_active;

        await pool.query(
          `UPDATE clients SET 
          \`slug\` = ?, \`no\` = ?, \`name\` = ?, \`client_title\` = ?, \`category\` = ?, \`copy\` = ?, \`full_description\` = ?,
          \`hero_image\` = ?, \`metrics\` = ?, \`links\` = ?, \`services_provided\` = ?, \`categories\` = ?, \`display_order\` = ?, \`is_active\` = ?
          WHERE \`id\` = ?`,
          [
            slug,
            no,
            name,
            clientTitle,
            category,
            copy,
            fullDesc,
            heroImage,
            metrics,
            links,
            servicesProvided,
            categories,
            displayOrder,
            isActive,
            id,
          ]
        );

        return jsonResponse({ success: true, message: 'Client updated', slug });
      }

      // DELETE /api/admin/clients/:id - delete client
      const deleteMatch = pathname.match(/^\/api\/admin\/clients\/(\d+)$/);
      if (deleteMatch && method === 'DELETE') {
        const id = parseInt(deleteMatch[1], 10);
        await pool.query('DELETE FROM clients WHERE id = ?', [id]);
        return jsonResponse({ success: true, message: 'Client deleted' });
      }

      // POST /api/admin/upload - file upload (supports image & video)
      // Stored + optimized on Cloudinary: images get auto format/quality/responsive
      // sizing at delivery time (see src/lib/cloudinary.ts), video gets an
      // auto-generated poster frame and auto format/quality on delivery too.
      if (pathname === '/api/admin/upload' && method === 'POST') {
        const ALLOWED_FOLDERS = new Set(['thumbnails', 'creatives', 'reels', 'general']);
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const requestedFolder = (formData.get('type') as string) || 'general';
        const folderType = ALLOWED_FOLDERS.has(requestedFolder) ? requestedFolder : 'general';

        if (!file || typeof file.arrayBuffer !== 'function') {
          return jsonResponse({ success: false, error: 'No valid file provided' }, 400);
        }

        if (!isCloudinaryConfigured) {
          return jsonResponse(
            {
              success: false,
              error:
                'Media storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET on the server.',
            },
            500,
          );
        }

        // Prefer the browser-supplied MIME type, but fall back to the file
        // extension — a video misclassified as an image gets uploaded with
        // resource_type 'image' and silently hits Cloudinary's much smaller
        // image/raw size cap instead of the video cap.
        const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm', '.mkv', '.avi', '.m4v']);
        const ext = path.extname(file.name || '').toLowerCase();
        const isVideo = file.type.startsWith('video/') || VIDEO_EXTENSIONS.has(ext);
        const arrayBuffer = await file.arrayBuffer();

        try {
          const result = await uploadToCloudinary(Buffer.from(arrayBuffer), {
            folder: folderType,
            resourceType: isVideo ? 'video' : 'image',
            filenameHint: path.basename(file.name || 'file', path.extname(file.name || '')).replace(
              /[^a-zA-Z0-9_-]/g,
              '_',
            ),
          });

          return jsonResponse({
            success: true,
            url: result.url,
            posterUrl: result.posterUrl,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
            duration: result.duration,
            size: result.bytes,
            type: file.type,
          });
        } catch (err: any) {
          console.error('Cloudinary upload failed:', err);
          return jsonResponse({ success: false, error: err.message || 'Upload failed' }, 502);
        }
      }

      // POST /api/admin/clients/:id/media - add creative / reel
      const addMediaMatch = pathname.match(/^\/api\/admin\/clients\/(\d+)\/media$/);
      if (addMediaMatch && method === 'POST') {
        const clientId = parseInt(addMediaMatch[1], 10);
        const body = await request.json().catch(() => ({}));

        const type = body.type; // 'creative' or 'reel'
        if (!type || !['creative', 'reel', 'logo'].includes(type)) {
          return jsonResponse({ success: false, error: 'Invalid media type' }, 400);
        }

        const fileUrl = (body.file_url || '').trim();
        if (!fileUrl) {
          return jsonResponse({ success: false, error: 'File URL is required' }, 400);
        }

        const title = body.title || '';
        const category = body.category || '';
        const posterUrl = body.poster_url || null;
        const views = body.views || null;
        const duration = body.duration || null;
        const description = body.description || null;

        const [maxRow] = (await pool.query(
          'SELECT MAX(display_order) as max_order FROM client_media WHERE client_id = ?',
          [clientId]
        )) as any[];
        const nextOrder = (maxRow[0]?.max_order || 0) + 1;

        const [res] = (await pool.query(
          `INSERT INTO client_media 
          (client_id, type, title, category, file_url, poster_url, views, duration, description, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [clientId, type, title, category, fileUrl, posterUrl, views, duration, description, nextOrder]
        )) as any[];

        return jsonResponse({
          success: true,
          media: {
            id: res.insertId,
            client_id: clientId,
            type,
            title,
            category,
            file_url: fileUrl,
            poster_url: posterUrl,
            views,
            duration,
            description,
          },
        });
      }

      // PUT /api/admin/media/:id - update media item
      const updateMediaMatch = pathname.match(/^\/api\/admin\/media\/(\d+)$/);
      if (updateMediaMatch && method === 'PUT') {
        const mediaId = parseInt(updateMediaMatch[1], 10);
        const body = await request.json().catch(() => ({}));

        const [exists] = (await pool.query(
          'SELECT * FROM client_media WHERE id = ? LIMIT 1',
          [mediaId]
        )) as any[];
        if (exists.length === 0) {
          return jsonResponse({ success: false, error: 'Media not found' }, 404);
        }

        const cur = exists[0];
        const title = body.title !== undefined ? body.title : cur.title;
        const category = body.category !== undefined ? body.category : cur.category;
        const fileUrl = body.file_url !== undefined ? body.file_url : cur.file_url;
        const posterUrl = body.poster_url !== undefined ? body.poster_url : cur.poster_url;
        const views = body.views !== undefined ? body.views : cur.views;
        const duration = body.duration !== undefined ? body.duration : cur.duration;
        const description = body.description !== undefined ? body.description : cur.description;
        const displayOrder = body.display_order !== undefined ? body.display_order : cur.display_order;

        await pool.query(
          `UPDATE client_media SET 
          title = ?, category = ?, file_url = ?, poster_url = ?, views = ?, duration = ?, description = ?, display_order = ?
          WHERE id = ?`,
          [title, category, fileUrl, posterUrl, views, duration, description, displayOrder, mediaId]
        );

        return jsonResponse({ success: true, message: 'Media updated' });
      }

      // DELETE /api/admin/media/:id - delete media
      const deleteMediaMatch = pathname.match(/^\/api\/admin\/media\/(\d+)$/);
      if (deleteMediaMatch && method === 'DELETE') {
        const mediaId = parseInt(deleteMediaMatch[1], 10);
        await pool.query('DELETE FROM client_media WHERE id = ?', [mediaId]);
        return jsonResponse({ success: true, message: 'Media deleted' });
      }

      // PUT /api/admin/settings - update global site settings (currently: logo)
      if (pathname === '/api/admin/settings' && method === 'PUT') {
        const body = await request.json().catch(() => ({}));
        if (typeof body.logo_url === 'string' && body.logo_url.trim()) {
          await pool.query(
            'INSERT INTO admin_settings (key_name, value_text) VALUES ("site_logo", ?) ON DUPLICATE KEY UPDATE value_text = ?',
            [body.logo_url, body.logo_url]
          );
        }
        return jsonResponse({ success: true, message: 'Settings updated' });
      }

      // POST /api/admin/clients/reorder - reorder client display
      if (pathname === '/api/admin/clients/reorder' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const { order } = body; // array of { id, display_order }
        if (Array.isArray(order)) {
          for (const item of order) {
            await pool.query('UPDATE clients SET display_order = ? WHERE id = ?', [
              item.display_order,
              item.id,
            ]);
          }
        }
        return jsonResponse({ success: true, message: 'Reorder saved' });
      }
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);
  } catch (error: any) {
    console.error('API Error:', error);
    return jsonResponse({ success: false, error: error.message || 'Internal Server Error' }, 500);
  }
}

// Stream or serve uploaded files from disk with byte-range support for video seeking
function serveUploadedFile(pathname: string, request: Request): Response {
  const uploadBaseDir = getUploadDir();
  // Strip leading /uploads/
  const relativePath = pathname.replace(/^\/uploads\//, '');
  const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(uploadBaseDir, safePath);

  // If file doesn't exist in uploadBaseDir, check public/uploads
  let targetPath = filePath;
  if (!fs.existsSync(targetPath)) {
    const fallbackPath = path.join(process.cwd(), 'public/uploads', safePath);
    if (fs.existsSync(fallbackPath)) {
      targetPath = fallbackPath;
    } else {
      return new Response('File Not Found', { status: 404 });
    }
  }

  const stat = fs.statSync(targetPath);
  const fileSize = stat.size;
  const ext = path.extname(targetPath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const range = request.headers.get('range');

  if (range && contentType.startsWith('video/')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    const stream = fs.createReadStream(targetPath, { start, end });
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': String(chunksize),
      'Content-Type': contentType,
    };

    // Convert node readstream to web ReadableStream
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    return new Response(readable, { status: 206, headers });
  }

  const fileBuffer = fs.readFileSync(targetPath);
  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(fileSize),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
