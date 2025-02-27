export async function GET() {
  const siteUrl = 'https://resugenie.com';

  const staticPages = ['', 'about', 'legal', 'privacy-policy', 'signin'];

  // Convert pages to XML format
  const urls = [
    ...staticPages.map(
      (page) =>
        `<url><loc>${siteUrl}/${page}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`
    ),
  ].join('');

  // XML sitemap structure
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
