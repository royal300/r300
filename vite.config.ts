// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "api-dev-middleware",
        apply: "serve",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && (req.url.startsWith("/api") || req.url.startsWith("/uploads"))) {
              try {
                const { handleApiRequest } = await import("./src/server/api.ts");
                const protocol = (req.socket as any).encrypted ? "https" : "http";
                const host = req.headers.host || "localhost:3000";
                const fullUrl = `${protocol}://${host}${req.url}`;

                const headers = new Headers();
                for (const [k, v] of Object.entries(req.headers)) {
                  if (Array.isArray(v)) {
                    v.forEach((val) => headers.append(k, val));
                  } else if (v) {
                    headers.set(k, v);
                  }
                }

                let body: any = null;
                if (req.method !== "GET" && req.method !== "HEAD") {
                  const chunks: Buffer[] = [];
                  for await (const chunk of req) {
                    chunks.push(chunk);
                  }
                  body = Buffer.concat(chunks);
                }

                const webReq = new Request(fullUrl, {
                  method: req.method,
                  headers,
                  body,
                  // @ts-ignore
                  duplex: "half",
                });

                const webRes = await handleApiRequest(webReq);
                if (webRes) {
                  res.statusCode = webRes.status;
                  webRes.headers.forEach((v, k) => res.setHeader(k, v));
                  const arrayBuf = await webRes.arrayBuffer();
                  res.end(Buffer.from(arrayBuf));
                  return;
                }
              } catch (err) {
                console.error("Dev API Middleware Error:", err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Internal Server Error" }));
                return;
              }
            }
            next();
          });
        },
      },
    ],
  },
});

