export const config = { runtime: "edge" };

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const listingId = pathname.split("/").filter(Boolean).pop() || "unknown";
    const ua = (request.headers.get("user-agent") || "").toLowerCase();

    const isBot =
      /facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|pinterest/i.test(
        ua
      );

    if (isBot) {
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
  <meta property="og:image" content="${url.origin}/og-image2.jpg" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Oferta #${listingId} - RatujPlon" />
  <meta name="twitter:description" content="Szczegóły oferty ${listingId}." />
  <meta name="twitter:image" content="${url.origin}/og-image2.jpg" />
</head>
</html>`;

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const origin = url.origin;
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
