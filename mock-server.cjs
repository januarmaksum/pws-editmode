// @ts-ignore
/**
 * Custom mock server using json-server v1 internals.
 * Serves static data from db.json with custom routes that mirror the real API.
 *
 * Routes:
 *   GET /api/auth/verify-domain  → auth.verify-domain
 *   GET /api/cms/pages/:slug     → cms.pages.<slug>
 *
 * Run: node mock-server.cjs
 */

const { createServer } = require('http');
const { readFileSync } = require('fs');
const { join } = require('path');

const PORT = 3001;

function readDb() {
  const raw = readFileSync(join(__dirname, 'db.json'), 'utf-8');
  return JSON.parse(raw);
}

// fix Parameter 'data' implicitly has an 'any' type.
function json(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(body);
}

const server = createServer((req, res) => {
  const url = req.url || '/';
  const method = req.method || 'GET';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  const db = readDb();

  // POST /api/auth/verify-domain
  if (
    (method === 'GET' || method === 'POST') &&
    url === '/api/auth/verify-domain'
  ) {
    return json(res, 200, db.auth['verify-domain']);
  }

  // GET /api/cms/pages/:slug
  const pagesMatch = url.match(/^\/api\/cms\/pages\/([^/?]+)/);
  if (method === 'GET' && pagesMatch) {
    const slug = pagesMatch[1];
    const page = db.cms.pages[slug];
    if (page) {
      return json(res, 200, page);
    }
    return json(res, 404, { error: `Page "${slug}" not found` });
  }

  // 404 fallback
  return json(res, 404, { error: 'Route not found', url });
});

server.listen(PORT, () => {
  console.log(`\n🟢 Mock API Server running at http://localhost:${PORT}\n`);
  console.log('  Routes:');
  console.log(
    `  POST http://localhost:${PORT}/api/auth/verify-domain  → auth.verify-domain`
  );
  console.log(
    `  GET  http://localhost:${PORT}/api/cms/pages/:slug      → cms.pages.<slug>`
  );
  console.log('\n  Data source: db.json\n');
});
