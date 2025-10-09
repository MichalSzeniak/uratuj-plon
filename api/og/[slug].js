export default function handler(req, res) {
  const { slug } = req.query;
  
  // Extract dynamic data from slug or query parameters
  const title = req.query.title || "Default Title";
  const description = req.query.description || "Default Description";
  const image = req.query.image || "https://ratujplon.pl/og-image.jpg";
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="https://ratujplon.pl/${slug.join('/')}" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  
  <!-- LinkedIn -->
  <meta property="og:site_name" content="Your Site Name" />
  
  <!-- Redirect to actual page for users -->
  <meta http-equiv="refresh" content="0;url=https://ratujplon.pl/${slug.join('/')}" />
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}