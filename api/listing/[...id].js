// api/listing/[...id].js
export const config = { runtime: "edge" };

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname; // np. /listing/123
    const listingId = pathname.split("/").filter(Boolean).pop() || "unknown";
    const ua = (request.headers.get("user-agent") || "").toLowerCase();

    // detekcja botów (rozszerz listę jeśli trzeba)
    const isBot =
      /facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|pinterest/i.test(
        ua
      );

    if (isBot) {
      // Zwróć HTML z meta-tagami (dla botów)
      const html = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Oferta #${listingId} - RatujPlon</title>
  <meta name="description" content="Szczegóły oferty ${listingId} na RatujPlon." />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Oferta #${listingId} - RatujPlon" />
  <meta property="og:description" content="Szczegóły oferty ${listingId} na RatujPlon." />
  <meta property="og:url" content="${url.origin}${pathname}" />
  <meta property="og:image" content="${url.origin}/default-og.jpg" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Oferta #${listingId} - RatujPlon" />
  <meta name="twitter:description" content="Szczegóły oferty ${listingId}." />
  <meta name="twitter:image" content="${url.origin}/default-og.jpg" />
</head>
<body>
  <!-- Możesz tu umieścić ukrytą treść, ale boty chcą meta-tagów -->
  <div style="display:none">
    <h1>Oferta ${listingId}</h1>
    <p>Szczegóły oferty ${listingId}.</p>
  </div>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // NIE-BOT: zwracamy zwykłe index.html (żeby React mógł wystartować)
    // Pobieramy index.html z tego samego hosta (origin)
    const origin = url.origin; // np. https://ratujplon.pl
    const indexResp = await fetch(origin + "/index.html");
    const indexHtml = await indexResp.text();

    return new Response(indexHtml, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
