// api/listing/[...id].js
export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const listingId = pathname.split('/').pop() || 'default';
    
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
    
    <!-- WAŻNE: Dodaj link do skompilowanego CSS -->
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <script type="module">
        // Przekaż dane do React
        window.__LISTING_ID__ = '${listingId}';
        console.log('Edge Function: Listing ID set to', '${listingId}');
        
        // Przekieruj do React Router po załadowaniu
        setTimeout(() => {
          if (window.location.pathname === '${pathname}') {
            // Użyj hash router aby uniknąć konfliktów
            window.history.replaceState(null, '', '/#/listing/${listingId}');
          }
        }, 100);
    </script>
    
    <!-- WAŻNE: Załaduj skompilowany JS z Vite -->
    <script type="module" src="/assets/index.js"></script>
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
    
    // Fallback do zwykłego SPA
    return new Response(`<!DOCTYPE html>
<html>
<head>
    <title>Spa</title>
    <script type="module" src="/assets/index.js"></script>
</head>
<body>
    <div id="root"></div>
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