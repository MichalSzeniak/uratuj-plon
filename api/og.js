// api/og.js
export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const userAgent = req.headers.get("user-agent") || "";
    const isBot =
      /facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp/i.test(
        userAgent
      );

    // Jeśli to bot (np. Facebook, Twitter, LinkedIn)
    if (isBot) {
      const listingId = pathname.split("/").pop();

      const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oferta #${listingId} - RatujPlon</title>
  <meta name="description" content="Sprawdź szczegóły oferty ${listingId} na RatujPlon.">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Oferta #${listingId} - RatujPlon">
  <meta property="og:description" content="Sprawdź szczegóły oferty ${listingId} na RatujPlon.">
  <meta property="og:url" content="https://ratujplon.pl${pathname}">
  <meta property="og:image" content="https://ratujplon.pl/default-og.jpg">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Oferta #${listingId} - RatujPlon">
  <meta name="twitter:description" content="Sprawdź szczegóły oferty ${listingId}.">
  <meta name="twitter:image" content="https://ratujplon.pl/default-og.jpg">
</head>
<body>
  <h1>Oferta ${listingId}</h1>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Jeśli to użytkownik – pobierz główny index.html (z Reacta)
    const indexHtml = await fetch("https://ratujplon.pl/index.html").then((r) =>
      r.text()
    );
    return new Response(indexHtml, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    console.error("SSR Error:", e);
    return new Response("Internal Error", { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};
