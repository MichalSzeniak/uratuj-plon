// api/render.ts
export default async function handler(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log("Processing path:", pathname);

    // Dla ścieżki /listing/ - zwróć HTML z meta tagami
    if (pathname.startsWith("/listing/")) {
      const listingId = pathname.split("/").filter(Boolean).pop() || "unknown";

      const html = `
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masaż Relaksacyjny - Luksusowe Spa</title>
    <meta name="description" content="Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi. Rezerwuj online!">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://https://ratujplon.pl/${pathname}">
    <meta property="og:title" content="Masaż Relaksacyjny - Luksusowe Spa">
    <meta property="og:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny. Rezerwuj online!">
    <meta property="og:image" content="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://https://ratujplon.pl/${pathname}">
    <meta property="twitter:title" content="Masaż Relaksacyjny - Luksusowe Spa">
    <meta property="twitter:description" content="Odkryj nasz ekskluzywny masaż relaksacyjny. Rezerwuj online!">
    <meta property="twitter:image" content="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop">
  </head>
  <body>
    <div id="root">
      <!-- Fallback content for bots -->
      <div style="display: none;">
        <h1>Masaż Relaksacyjny</h1>
        <p>Odkryj nasz ekskluzywny masaż relaksacyjny z olejkami eterycznymi. Rezerwuj online!</p>
      </div>
    </div>
    <script>
      // Przekaż ID do React app
      window.__LISTING_ID__ = '${listingId}';
    </script>
    <!-- React will hydrate this -->
  </body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // Dla wszystkich innych ścieżek - zwróć prostą odpowiedź
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Spa App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in edge function:", error);

    // Fallback response
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Spa App</title></head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.jsx"></script>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  }
}

export const config = {
  runtime: "edge",
};
