import express from 'express';
import path from 'path';
import apiRouter from './server/api.ts';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.set('trust proxy', 1);

// Production Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static public media and official documents
app.use('/uploads', express.static(path.join(currentDir, 'public', 'uploads'), {
  maxAge: '1d',
  etag: true,
}));
app.use('/documents', express.static(path.join(currentDir, 'public', 'documents'), {
  maxAge: '1d',
  etag: true,
}));

// SEO routes
app.use('/', apiRouter);
app.use('/api', apiRouter);

// Production client static assets
const distPath = path.join(currentDir, 'dist');
app.use(express.static(distPath));

// Fallback all SPA routes to index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nursing & Paramedical Admission Portal running at http://0.0.0.0:${PORT}`);
});
