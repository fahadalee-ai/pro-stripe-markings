import fs from "node:fs";
import path from "node:path";
import type { Connect, Plugin } from "vite";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";

function servePreviewHtml(): Plugin {
  const file = path.resolve("preview.html");
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = (req.url ?? "").split("?")[0];
    if (!url.endsWith("/preview.html") || !fs.existsSync(file)) {
      next();
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    fs.createReadStream(file).pipe(res);
  };

  return {
    name: "serve-preview-html",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
    generateBundle() {
      if (this.environment?.name && this.environment.name !== "client") return;
      this.emitFile({
        type: "asset",
        fileName: "preview.html",
        source: fs.readFileSync(file),
      });
    },
  };
}

export default defineLovableConfig({
  nitro: { preset: "vercel" },
  vite: {
    plugins: [servePreviewHtml()],
    server: {
        allowedHosts: [
            "demo.sourapps.com",
            "localhost",
            "127.0.0.1",
        ],
    },
    preview: {
        allowedHosts: [
            "demo.sourapps.com",
            "localhost",
            "127.0.0.1",
        ],
    },
  },
});