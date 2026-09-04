import mysql from 'mysql2/promise';

const DB_CONFIG = {
  host: process.env.DB_HOST || '93.127.206.52',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mypass',
  database: process.env.DB_NAME || 'royal300_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function initDb() {
  console.log('Connecting to database:', DB_CONFIG.host, DB_CONFIG.database);
  const conn = await mysql.createConnection(DB_CONFIG);

  console.log('Creating tables if they do not exist...');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      no VARCHAR(10) DEFAULT '01',
      name VARCHAR(255) NOT NULL,
      client_title VARCHAR(255) DEFAULT '',
      category VARCHAR(255) DEFAULT '',
      copy TEXT,
      full_description LONGTEXT,
      hero_image VARCHAR(500) DEFAULT '',
      metrics JSON,
      links JSON,
      services_provided JSON,
      categories JSON,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS client_media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id INT NOT NULL,
      type ENUM('creative', 'reel', 'logo') NOT NULL,
      title VARCHAR(255) DEFAULT '',
      category VARCHAR(100) DEFAULT '',
      file_url VARCHAR(500) NOT NULL,
      poster_url VARCHAR(500) NULL,
      views VARCHAR(50) NULL,
      duration VARCHAR(50) NULL,
      description TEXT NULL,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_client_id (client_id),
      INDEX idx_type (type),
      CONSTRAINT fk_client_media_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key_name VARCHAR(100) PRIMARY KEY,
      value_text LONGTEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('Tables verified.');

  // Check if admin password exists, if not set default
  const [adminRows] = await conn.query('SELECT * FROM admin_settings WHERE key_name = "admin_password"');
  if (adminRows.length === 0) {
    await conn.query(
      'INSERT INTO admin_settings (key_name, value_text) VALUES ("admin_password", ?)',
      ['Royal300@2026']
    );
    console.log('Default admin password initialized.');
  }

  // Check if clients table is empty
  const [existingClients] = await conn.query('SELECT COUNT(*) as count FROM clients');
  if (existingClients[0].count === 0) {
    console.log('Seeding initial projects from projectsData.ts...');
    
    const seedProjects = [
      {
        slug: "happy-valley-park",
        no: "01",
        name: "HAPPY VALLEY PARK",
        client_title: "Happy Valley Water Park & Resort",
        category: "Digital Marketing • Social Media • Campaign Creative",
        copy: "Built a more engaging digital presence for a leisure destination through campaign-driven creative, promotional communication and audience-focused social content.",
        full_description: "Happy Valley Park is a premier leisure and water resort destination. ROYAL300 developed an end-to-end digital growth framework including seasonal promo campaigns, interactive social media reels, and high-conversion ad creatives that drove record seasonal bookings.",
        heroImage: "/happy_valley_park/thumbnail.png",
        metrics: ["+58% Reach", "+41% Engagement", "2.4× Campaign Interaction", "12K+ Ticket Inquiries"],
        links: {
          website: "https://gohappyvalley.com",
          instagram: "https://www.instagram.com/happyvalleypark",
          facebook: "https://www.facebook.com/happyvalleyparkbira",
        },
        servicesProvided: ["Social Media Management", "Web Development", "Website Maintenance"],
        categories: ["All", "Social Campaign", "Ad Creatives", "Promotions", "Event Highlights"],
        displayOrder: 1,
        creatives: [
          {
            title: "Happy Valley Campaign Creative 01",
            category: "Social Campaign",
            image: "/happy_valley_park/creative/1.jpeg",
            description: "High-impact visual promotional creative for Happy Valley Water Park.",
          },
          {
            title: "Happy Valley Campaign Creative 02",
            category: "Ad Creatives",
            image: "/happy_valley_park/creative/21.jpeg",
            description: "Targeted social media ad highlighting resort & water rides.",
          },
          {
            title: "Happy Valley Campaign Creative 03",
            category: "Promotions",
            image: "/happy_valley_park/creative/3.jpeg",
            description: "Special seasonal family pass promo banner.",
          },
          {
            title: "Happy Valley Campaign Creative 04",
            category: "Event Highlights",
            image: "/happy_valley_park/creative/4.jpeg",
            description: "Weekend attraction & staycation showcase creative.",
          },
          {
            title: "Happy Valley Campaign Creative 05",
            category: "Social Campaign",
            image: "/happy_valley_park/creative/5.jpeg",
            description: "Pool party & resort event highlights.",
          },
        ],
        reels: [
          {
            title: "Happy Valley Water Park Feature Reel",
            category: "Reels",
            poster: "/happy_valley_park/thumbnail.png",
            videoUrl: "/happy_valley_park/reels/Water Park.mp4",
            views: "142K",
            duration: "0:30",
          },
          {
            title: "Happy Valley Official Final Showcase",
            category: "Reels",
            poster: "/happy_valley_park/creative/1.jpeg",
            videoUrl: "/happy_valley_park/reels/Water Park- Final.mp4",
            views: "198K",
            duration: "0:30",
          },
          {
            title: "Happy Valley Water Park Highlight Reel",
            category: "Reels",
            poster: "/happy_valley_park/creative/3.jpeg",
            videoUrl: "/happy_valley_park/reels/Water Park (1).mp4",
            views: "215K",
            duration: "0:25",
          },
        ],
      },
      {
        slug: "royal-enfield",
        no: "02",
        name: "ROYAL ENFIELD",
        client_title: "Royal Enfield Dealership Network",
        category: "Campaign Creative • Social Media",
        copy: "Created high-impact visual communication designed to strengthen product visibility, generate attention and connect the brand with its local audience.",
        full_description: "Royal Enfield stands for freedom, heritage, and raw power. ROYAL300 crafted a dynamic social media & promotional campaign series highlighting iconic motorcycle models, test ride bookings, and rider club community events.",
        heroImage: "/uploads/thumbnails/project-enfield.jpg",
        metrics: ["+72% Content Reach", "+36% Engagement", "3.1× Creative Interaction", "4.5K+ Test Ride Leads"],
        links: {
          website: "https://royalenfield.com",
          instagram: "https://instagram.com/royalenfield",
          facebook: "https://facebook.com/royalenfield",
        },
        servicesProvided: ["Social Media Management", "Web Development", "Website Maintenance"],
        categories: ["All", "Product Launch", "Rider Stories", "Test Ride Ads", "Branding"],
        displayOrder: 2,
        creatives: [
          {
            title: "The Legend Reborn - Bullet 350",
            category: "Product Launch",
            image: "/uploads/thumbnails/project-enfield.jpg",
            description: "Studio lighting creative highlighting metallic detail and classic silhouette.",
          },
          {
            title: "Mountain Conquest Tour",
            category: "Rider Stories",
            image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
            description: "Cinematic adventure banner capturing Himalayan rides.",
          },
          {
            title: "Weekend Test Ride Campaign",
            category: "Test Ride Ads",
            image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
            description: "Direct response social banner for local dealership test ride registrations.",
          },
          {
            title: "Hunter 350 Urban Explorer",
            category: "Branding",
            image: "https://images.unsplash.com/photo-1515777315837-281b920135d5?auto=format&fit=crop&w=1000&q=80",
            description: "Urban lifestyle creative aimed at young city commuters.",
          },
        ],
        reels: [
          {
            title: "Himalayan 450 Exhaust Sound & Pure Power",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-motorcycle-speeding-on-the-road-42777-large.mp4",
            views: "310K",
            duration: "0:18",
          },
          {
            title: "Custom Chrome Finish Showcase",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-riding-a-motorcycle-on-a-road-42776-large.mp4",
            views: "185K",
            duration: "0:28",
          },
        ],
      },
      {
        slug: "spectrum-cafe",
        no: "03",
        name: "SPECTRUM CAFE",
        client_title: "Spectrum Artisanal Roastery & Cafe",
        category: "Branding • Social Media • Promotional Marketing",
        copy: "Developed a visually consistent digital identity and promotional communication system designed to increase local visibility and drive customers toward the cafe.",
        full_description: "Spectrum Cafe needed a brand refresh and localized social strategy to establish itself as the premier specialty coffee hub. We designed elegant minimalist social graphics, daily menu promos, and viral barista reels.",
        heroImage: "/uploads/thumbnails/project-cafe.jpg",
        metrics: ["+64% Reach", "+47% Engagement", "+29% Promotional Response", "3.8K+ New Visitors"],
        links: {
          website: "https://spectrumcafe.com",
          instagram: "https://instagram.com/spectrumcafe",
          facebook: "https://facebook.com/spectrumcafe",
        },
        servicesProvided: ["Social Media Management", "Web Development", "Website Maintenance"],
        categories: ["All", "Menu Creatives", "Brand Aesthetic", "Promotional Ads"],
        displayOrder: 3,
        creatives: [
          {
            title: "Artisanal Pour-Over Series",
            category: "Brand Aesthetic",
            image: "/uploads/thumbnails/project-cafe.jpg",
            description: "Minimalist coffee photography paired with warm, modern typography.",
          },
          {
            title: "Weekend Brunch Menu Reveal",
            category: "Menu Creatives",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
            description: "Visual menu showcase showcasing specialty lattes and freshly baked pastries.",
          },
          {
            title: "Buy 1 Get 1 Coffee Hours",
            category: "Promotional Ads",
            image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
            description: "Targeted Geo-fenced offer post designed to drive afternoon walk-ins.",
          },
        ],
        reels: [
          {
            title: "Perfect Latte Art Symphony",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barista-making-a-coffee-with-latte-art-41589-large.mp4",
            views: "275K",
            duration: "0:15",
          },
          {
            title: "Behind the Beans: Cold Brew Process",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-into-a-glass-with-ice-41591-large.mp4",
            views: "120K",
            duration: "0:22",
          },
        ],
      },
      {
        slug: "a-banik-jewellers",
        no: "04",
        name: "A BANIK JEWELLERS",
        client_title: "A Banik Heritage Jewellery",
        category: "Brand Identity • Digital Experience • Marketing",
        copy: "Created a premium digital presence designed to communicate craftsmanship, trust and product quality while strengthening the jewellery brand's online positioning.",
        full_description: "A Banik Jewellers is a heritage fine jewellery brand. ROYAL300 reimagined their digital showcase with ultra-luxurious visual creative, festive campaign launches, and royal wedding collection highlights.",
        heroImage: "/uploads/thumbnails/project-jewellers.jpg",
        metrics: ["+81% Visual Engagement", "+43% Audience Growth", "2.7× Campaign Interaction", "850+ Consultation Leads"],
        links: {
          website: "https://abanikjewellers.com",
          instagram: "https://instagram.com/abanikjewellers",
          facebook: "https://facebook.com/abanikjewellers",
        },
        servicesProvided: ["Social Media Management", "Web Development", "Website Maintenance"],
        categories: ["All", "Bridal Heritage", "Festive Collection", "Craftsmanship"],
        displayOrder: 4,
        creatives: [
          {
            title: "Royal Bridal Heritage Collection",
            category: "Bridal Heritage",
            image: "/uploads/thumbnails/project-jewellers.jpg",
            description: "Opulent gold and kundan necklace displayed on white silk backdrop.",
          },
          {
            title: "Dhanteras Diamond Suite",
            category: "Festive Collection",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
            description: "Sparkling solitaire diamond ring collection in luxury box setup.",
          },
          {
            title: "Art of Gold Carving",
            category: "Craftsmanship",
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
            description: "Behind the scenes master goldsmith carving traditional temple jewellery.",
          },
        ],
        reels: [
          {
            title: "Shine Like Royalty - Unboxing 22k Gold Set",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-jewelry-and-gemstones-41584-large.mp4",
            views: "430K",
            duration: "0:25",
          },
          {
            title: "Diamond Ring Clarity Showcase",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-diamond-ring-41583-large.mp4",
            views: "290K",
            duration: "0:20",
          },
        ],
      },
      {
        slug: "fashion-retail-brand",
        no: "05",
        name: "FASHION / RETAIL BRAND",
        client_title: "Luxe Apparel & Accessories",
        category: "Creative Marketing • Social Media",
        copy: "Designed campaign communication that transformed products into visually compelling stories and helped create a stronger digital connection with the target audience.",
        full_description: "A modern couture and streetwear fashion label that required high-octane visual storytelling. ROYAL300 produced lookbook campaigns, modern pop-up event teasers, and shoppable reel highlights.",
        heroImage: "/uploads/thumbnails/project-fashion.jpg",
        metrics: ["+54% Reach", "+38% Engagement", "2.2× Content Interaction", "6.2K+ Shop Visits"],
        links: {
          website: "https://fashionretail.com",
          instagram: "https://instagram.com/fashionbrand",
          facebook: "https://facebook.com/fashionbrand",
        },
        servicesProvided: ["Social Media Management", "Web Development", "Website Maintenance"],
        categories: ["All", "Lookbook", "Editorial", "Streetwear", "Seasonal Drop"],
        displayOrder: 5,
        creatives: [
          {
            title: "Autumn Editorial Drop",
            category: "Editorial",
            image: "/uploads/thumbnails/project-fashion.jpg",
            description: "High fashion editorial campaign photograph featuring autumn palette.",
          },
          {
            title: "Urban Streetwear Lookbook",
            category: "Streetwear",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
            description: "Vibrant urban street fashion shoot styled for Gen-Z audience.",
          },
          {
            title: "Monochrome Minimalist Line",
            category: "Lookbook",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
            description: "Sleek black & white apparel campaign for luxury retail catalog.",
          },
        ],
        reels: [
          {
            title: "Runway Highlights & Model Walk",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-down-a-runway-41581-large.mp4",
            views: "520K",
            duration: "0:30",
          },
          {
            title: "Style 1 Outfit in 3 Different Ways",
            category: "Reels",
            poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-fashion-photoshoot-41582-large.mp4",
            views: "340K",
            duration: "0:25",
          },
        ],
      },
    ];

    for (const p of seedProjects) {
      const [res] = await conn.query(
        `INSERT INTO clients 
        (slug, no, name, client_title, category, copy, full_description, hero_image, metrics, links, services_provided, categories, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          p.slug,
          p.no,
          p.name,
          p.client_title,
          p.category,
          p.copy,
          p.full_description,
          p.heroImage,
          JSON.stringify(p.metrics),
          JSON.stringify(p.links),
          JSON.stringify(p.servicesProvided),
          JSON.stringify(p.categories),
          p.displayOrder,
        ]
      );

      const clientId = res.insertId;

      // Insert creatives
      for (let i = 0; i < p.creatives.length; i++) {
        const c = p.creatives[i];
        await conn.query(
          `INSERT INTO client_media (client_id, type, title, category, file_url, description, display_order)
          VALUES (?, 'creative', ?, ?, ?, ?, ?)`,
          [clientId, c.title, c.category, c.image, c.description, i + 1]
        );
      }

      // Insert reels
      for (let i = 0; i < p.reels.length; i++) {
        const r = p.reels[i];
        await conn.query(
          `INSERT INTO client_media (client_id, type, title, category, file_url, poster_url, views, duration, display_order)
          VALUES (?, 'reel', ?, ?, ?, ?, ?, ?, ?)`,
          [clientId, r.title, r.category, r.videoUrl, r.poster, r.views, r.duration, i + 1]
        );
      }

      console.log(`Seeded client: ${p.name} (ID: ${clientId})`);
    }
  } else {
    console.log(`Clients already exist (${existingClients[0].count} records found), skipping seed.`);
  }

  await conn.end();
  console.log('Database initialization completed successfully!');
}

initDb().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
