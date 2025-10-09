// api/render.js
module.exports = (req, res) => {
  const pathname = req.url;
  
  console.log('Processing path:', pathname);

  if (pathname.startsWith('/listing/')) {
    const listingId = pathname.split('/').filter(Boolean).pop() || 'unknown';
    
    const html = `
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masaż Relaksacyjny - Luksusowe Spa</title>
    <meta name="description" content="Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi. Rezerwuj online!">
    
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ratujplon.pl${pathname}">
    <meta property="og:title" content="Masaż Relaksacyjny - Luksusowe Spa">
    <meta property="og:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny. Rezerwuj online!">
    <meta property="og:image" content="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop">
    
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="Masaż Relaksacyjny - Luksusowe Spa">
    <meta property="twitter:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny. Rezerwuj online!">
    <meta property="twitter:image" content="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop">
  </head>
  <body>
    <div id="root">
      <div style="display: none;">
        <h1>Masaż Relaksacyjny</h1>
        <p>Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi. Rezerwuj online!</p>
      </div>
    </div>
    <script>
      window.__LISTING_ID__ = '${listingId}';
    </script>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  // Dla innych ścieżek - zwróć default HTML
  const defaultHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Spa App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(defaultHtml);
};