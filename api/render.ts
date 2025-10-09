// api/render.ts
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Statyczne dane dla ścieżki /listing/
  if (pathname.startsWith("/listing/")) {
    const listingId = pathname.split("/").pop(); // pobierz ID z URL

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oferta Spa - Masaż Relaksacyjny</title>
        <meta name="description" content="Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi. Rezerwuj online!">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://ratujplon.pl${pathname}">
        <meta property="og:title" content="Masaż Relaksacyjny - Luksusowe Spa">
        <meta property="og:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny. Rezerwuj online!">
        <meta property="og:image" content="https://ratujplon.pl/og-image.jpg">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://ratujplon.pl${pathname}">
        <meta property="twitter:title" content="Masaż Relaksacyjny - Luksusowe Spa">
        <meta property="twitter:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny. Rezerwuj online!">
        <meta property="twitter:image" content="https://ratujplon.pl/og-image.jpg">
      </head>
      <body>
        <div id="root"></div>
        <script src="/assets/main.js"></script>
        <script>
          // Przekaż ID do React app
          window.__LISTING_ID__ = '${listingId}';
        </script>
      </body>
    </html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600", // cache 1 godzina
      },
    });
  }

  // Dla WSZYSTKICH innych ścieżek - serwuj normalne SPA
  try {
    // Pobierz oryginalny index.html
    const response = await fetch(new URL("./index.html", url));
    const html = await response.text();

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
}
