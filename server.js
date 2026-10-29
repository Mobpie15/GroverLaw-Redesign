/**
 * Groverlaw - Hardened Web & API Server
 * Built-in Node.js with Zero External Dependencies
 * Implements Defense-In-Depth Security Controls:
 * - Full Suite of HTTP Security Headers (CSP, HSTS, X-Frame-Options, Permissions-Policy, etc.)
 * - Path Traversal Protection
 * - Rate Limiting & DoS Mitigation (Request Size Caps)
 * - Cryptographic Anti-CSRF Token Generation & Verification
 * - Honeypot Spam Prevention
 * - Strict Input Validation & HTML Entity Sanitization
 * - Safe Error Handling (No Stack Traces / Internal Leaks)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);
const MAX_BODY_BYTES = 15 * 1024; // 15 KB strict limit for contact requests

// In-Memory Rate Limiter (Sliding Window per IP)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 submissions per 10 mins
const rateLimitMap = new Map();

// In-Memory CSRF Token Store (with automatic expiration)
const activeCsrfTokens = new Map(); // token -> timestamp
const CSRF_TTL_MS = 60 * 60 * 1000; // 1 hour token lifetime

// Clean up expired rate-limit records and CSRF tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
  for (const [token, timestamp] of activeCsrfTokens.entries()) {
    if (now - timestamp > CSRF_TTL_MS) {
      activeCsrfTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

// Security Headers Generator
function applySecurityHeaders(res, isHtml = false) {
  // 1. Content Security Policy (CSP)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "frame-src 'self' https://www.google.com https://maps.google.co.in https://maps.google.com",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);

  // 2. HTTP Strict Transport Security (HSTS) - 2 years + subdomains + preload
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // 3. Prevent MIME Sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 4. Clickjacking Defense
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // 5. Cross-Site Scripting Filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 6. Referrer Leakage Defense
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 7. Permissions Policy (Disables unused sensitive hardware & features)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), interest-cohort=()'
  );

  // 8. Cross-Origin Protections
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  // 9. Suppress Technology Fingerprinting
  res.removeHeader('X-Powered-By');
  res.setHeader('Server', 'Groverlaw-Secure/1.0');
}

// HTML Entity Sanitizer (Output Encoding)
function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Get Client IP Helper
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1'
  );
}

// Rate Limiting Check
function isRateLimited(ip) {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.firstRequestTime = now;
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

// Send JSON Helper
function sendJson(res, statusCode, data) {
  applySecurityHeaders(res);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });
  res.end(JSON.stringify(data));
}

// Main HTTP Server
const server = http.createServer((req, res) => {
  const ip = getClientIp(req);
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(parsedUrl.pathname);

  // =========================================================================
  // API ROUTE: GET /api/csrf-token
  // =========================================================================
  if (req.method === 'GET' && pathname === '/api/csrf-token') {
    const token = crypto.randomBytes(32).toString('hex');
    activeCsrfTokens.set(token, Date.now());
    return sendJson(res, 200, {
      csrfToken: token,
      expiresIn: CSRF_TTL_MS / 1000,
    });
  }

  // =========================================================================
  // API ROUTE: POST /api/contact (HARDENED ENDPOINT)
  // =========================================================================
  if (req.method === 'POST' && pathname === '/api/contact') {
    // 1. Rate Limiting Check
    if (isRateLimited(ip)) {
      return sendJson(res, 429, {
        success: false,
        error: 'Too many inquiries submitted from this connection. Please wait a few minutes before trying again or telephone our chambers directly.',
      });
    }

    // 2. Strict Payload Size Limiting
    let body = '';
    let bodyLength = 0;

    req.on('data', (chunk) => {
      bodyLength += chunk.length;
      if (bodyLength > MAX_BODY_BYTES) {
        req.destroy(new Error('Payload too large'));
      } else {
        body += chunk;
      }
    });

    req.on('end', () => {
      let data = {};
      try {
        data = JSON.parse(body);
      } catch (e) {
        return sendJson(res, 400, {
          success: false,
          error: 'Invalid request payload format.',
        });
      }

      // 3. Honeypot Anti-Bot Field Check
      // Hidden field 'website_fax_confirm' must remain completely empty for humans
      if (data.website_fax_confirm && data.website_fax_confirm.trim() !== '') {
        // Silently succeed without recording to discard spam bots
        return sendJson(res, 200, {
          success: true,
          message: 'Inquiry received and queued for review.',
        });
      }

      // 4. CSRF Token Verification
      const clientCsrfToken = data.csrfToken || req.headers['x-csrf-token'];
      if (!clientCsrfToken || !activeCsrfTokens.has(clientCsrfToken)) {
        return sendJson(res, 403, {
          success: false,
          error: 'Security token verification failed or expired. Please refresh the page and try again.',
        });
      }
      // Consume token (one-time use for state-changing requests)
      activeCsrfTokens.delete(clientCsrfToken);

      // 5. Input Validation & Sanitization
      const fullName = (data.fullName || '').trim();
      const email = (data.email || '').trim().toLowerCase();
      const phone = (data.phone || '').trim();
      const practiceArea = (data.practiceArea || '').trim();
      const message = (data.message || '').trim();

      // Name validation: 2-80 chars
      if (!fullName || fullName.length < 2 || fullName.length > 80) {
        return sendJson(res, 422, {
          success: false,
          error: 'Please enter a valid full name (between 2 and 80 characters).',
        });
      }

      // Email validation: RFC-5322 standard regex
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!email || !emailRegex.test(email) || email.length > 100) {
        return sendJson(res, 422, {
          success: false,
          error: 'Please enter a valid, deliverable email address.',
        });
      }

      // Phone validation: optional, max 20 chars
      if (phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(phone)) {
        return sendJson(res, 422, {
          success: false,
          error: 'Please provide a valid contact number.',
        });
      }

      // Practice Area Whitelist validation
      const ALLOWED_AREAS = [
        'Trademarks',
        'Trade Marks',
        'Patents',
        'Anti-Counterfeiting',
        'Industrial Designs',
        'Copyright',
        'Domain Disputes',
        'Corporate FDI',
        'Company Incorporation',
        'Commercial Contracts',
        'Other'
      ];
      if (!ALLOWED_AREAS.includes(practiceArea)) {
        return sendJson(res, 422, {
          success: false,
          error: 'Please select a recognized area of legal inquiry.',
        });
      }

      // Message validation: 10-2500 chars
      if (!message || message.length < 10 || message.length > 2500) {
        return sendJson(res, 422, {
          success: false,
          error: 'Please provide a concise description of your inquiry (between 10 and 2,500 characters).',
        });
      }

      // Sanitized Payload Output
      const sanitizedRecord = {
        id: crypto.randomUUID(),
        receivedAt: new Date().toISOString(),
        fullName: sanitizeHtml(fullName),
        email: sanitizeHtml(email),
        phone: sanitizeHtml(phone),
        practiceArea: sanitizeHtml(practiceArea),
        message: sanitizeHtml(message),
        clientIp: ip.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip,
      };

      // Security Logging (Without sensitive PII in console)
      console.log(`[AUDIT] Inquiry ${sanitizedRecord.id} received for ${sanitizedRecord.practiceArea} from IP: ${sanitizedRecord.clientIp}`);

      return sendJson(res, 200, {
        success: true,
        inquiryId: sanitizedRecord.id,
        message: 'Your inquiry has been received securely. Counsel will review and respond promptly in accordance with Bar Council of India norms.',
      });
    });

    req.on('error', (err) => {
      return sendJson(res, 413, {
        success: false,
        error: 'Inquiry payload exceeded permissible size limit.',
      });
    });

    return;
  }

  // =========================================================================
  // STATIC FILE SERVING WITH PATH TRAVERSAL DEFENSE
  // =========================================================================
  let safePath = pathname === '/' ? '/index.html' : pathname;

  // Canonicalize and resolve path safely
  const resolvedPath = path.resolve(ROOT, '.' + safePath);

  // Path Traversal Security Check: Path MUST strictly remain within ROOT
  if (!resolvedPath.startsWith(ROOT)) {
    applySecurityHeaders(res);
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      applySecurityHeaders(res);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>404 Page Not Found | Groverlaw</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 60px 20px; background: #081225; color: #f8fafc; }
            h1 { color: #c59b27; font-size: 2.5rem; margin-bottom: 1rem; }
            p { color: #94a3b8; font-size: 1.1rem; }
            a { color: #c59b27; text-decoration: none; font-weight: bold; border-bottom: 1px solid #c59b27; }
            a:hover { color: #fff; }
          </style>
        </head>
        <body>
          <h1>404 — Page Not Found</h1>
          <p>The requested legal resource could not be found or has been moved.</p>
          <p style="margin-top: 30px;"><a href="/">&larr; Return to Groverlaw Chambers</a></p>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isHtml = ext === '.html' || ext === '.htm';

    applySecurityHeaders(res, isHtml);

    // Static Asset Caching vs HTML freshness
    if (isHtml) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(resolvedPath);
    stream.on('error', () => {
      res.end();
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏛️  Groverlaw Hardened Legal Server Active`);
  console.log(`📍 Local URL: http://localhost:${PORT}`);
  console.log(`🛡️  Security Headers: CSP, HSTS, X-Frame, Nosniff, Permissions`);
  console.log(`🔒 Protection: CSRF Token API, Honeypot, Input Sanitization`);
  console.log(`📜 RFC 9116: http://localhost:${PORT}/.well-known/security.txt`);
  console.log(`=======================================================`);
});
