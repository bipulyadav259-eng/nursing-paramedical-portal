import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';
import express from 'express';
import apiRouter from './server/api.ts';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          // Explicit root-level SEO endpoints
          server.middlewares.use((req, res, next) => {
            const url = req.url ? req.url.split('?')[0] : '';
            if (url === '/robots.txt') {
              const robotsPath = path.resolve(__dirname, 'public', 'robots.txt');
              if (fs.existsSync(robotsPath)) {
                res.setHeader('Content-Type', 'text/plain');
                return res.end(fs.readFileSync(robotsPath));
              }
            }
            if (url === '/sitemap.xml') {
              const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
              if (fs.existsSync(sitemapPath)) {
                res.setHeader('Content-Type', 'application/xml');
                return res.end(fs.readFileSync(sitemapPath));
              }
            }
            next();
          });

          const app = express();
          app.use(express.json({ limit: '10mb' }));
          app.use(express.urlencoded({ extended: true, limit: '10mb' }));
          app.use('/', apiRouter);
          app.use('/api', apiRouter);
          server.middlewares.use(app);
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
