import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;

  const staticUrls = [
    '',
    '/projects',
    '/contact',
    '/imprint',
  ];

  // Only include static URLs, since /projects/[slug] does not exist
  const urls = staticUrls;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (path) =>
        `  <url>\n    <loc>${baseUrl}${path}</loc>\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
