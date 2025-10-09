// api/listing/[...id].js
export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const listingId = pathname.split('/').pop() || 'default';
    
    console.log('Rendering listing page for:', listingId);

    const html = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masaż Relaksacyjny - Luksusowe Spa</title>
    <meta name="description" content="Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Masaż Relaksacyjny - Luksusowe Spa">
    <meta property="og:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi">
    <meta property="og:image" content="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop">
    <meta property="og:url" content="https://ratujplon.pl${pathname}">
    <meta property="og:type" content="website">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Masaż Relaksacyjny - Luksusowe Spa">
    <meta name="twitter:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop">
</head>
<body>
    <div id="root">
        <noscript>
            <h1>Masaż Relaksacyjny</h1>
            <p>Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi. Rezerwuj online!</p>
        </noscript>
    </div>
    <script>
        window.__LISTING_ID__ = '${listingId}';
        console.log('Listing ID:', '${listingId}');
    </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(`<!DOCTYPE html>
<html>
<head><title>Spa</title></head>
<body>
    <div id="root"></div>
    <script>window.__LISTING_ID__ = 'error';</script>
</body>
</html>`, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

export const config = {
  runtime: 'edge',
};