const fs = require('fs');

const datos = JSON.parse(fs.readFileSync('./datos.json', 'utf8'));
const hoy = new Date().toISOString().split('T')[0];

const urls = [
  `  <url>
    <loc>https://elinterno.com/</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
  `  <url>
    <loc>https://elinterno.com/legal.html</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`,
  ...datos.map(emp => `  <url>
    <loc>https://elinterno.com/empresa.html?id=${emp.id}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync('./sitemap.xml', sitemap);
console.log(`✓ sitemap.xml generado con ${datos.length} empresas (${hoy})`);
