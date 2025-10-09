// export const config = { runtime: "edge" };

// export default async function handler(request) {
//   try {
//     const url = new URL(request.url);
//     const pathname = url.pathname;
//     const listingId = pathname.split("/").filter(Boolean).pop() || "unknown";
//     const ua = (request.headers.get("user-agent") || "").toLowerCase();

//     const isBot =
//       /facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|pinterest/i.test(
//         ua
//       );

//     if (isBot) {
//       const html = `<!doctype html>
// <html lang="pl">
// <head>
//   <meta charset="utf-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <title>Oferta #${listingId} - RatujPlon</title>
//   <meta name="description" content="Szczegóły oferty ${listingId} na RatujPlon." />

//   <!-- Open Graph -->
//   <meta property="og:type" content="website" />
//   <meta property="og:title" content="Oferta #${listingId} - RatujPlon" />
//   <meta property="og:description" content="Szczegóły oferty ${listingId} na RatujPlon." />
//   <meta property="og:url" content="${url.origin}${pathname}" />
//   <meta property="og:image" content="${url.origin}/og-image2.jpg" />

//   <!-- Twitter -->
//   <meta name="twitter:card" content="summary_large_image" />
//   <meta name="twitter:title" content="Oferta #${listingId} - RatujPlon" />
//   <meta name="twitter:description" content="Szczegóły oferty ${listingId}." />
//   <meta name="twitter:image" content="${url.origin}/og-image2.jpg" />
// </head>
// </html>`;

//       return new Response(html, {
//         status: 200,
//         headers: { "Content-Type": "text/html; charset=utf-8" },
//       });
//     }

//     const origin = url.origin;
//     const indexResp = await fetch(origin + "/index.html");
//     const indexHtml = await indexResp.text();

//     return new Response(indexHtml, {
//       status: 200,
//       headers: { "Content-Type": "text/html; charset=utf-8" },
//     });
//   } catch (err) {
//     console.error("Edge function error:", err);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }

// api/listing/[...id].js
export const config = { runtime: "edge" };

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname; // np. /listing/123
    const listingId = pathname.split("/").filter(Boolean).pop();
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

    const isBot =
      /facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|pinterest/i.test(
        userAgent
      );

    // --- konfiguracja Supabase ---
    const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_ANON_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Brak konfiguracji Supabase w zmiennych środowiskowych");
    }

    // --- zapytanie do Supabase REST ---
    let listingData = null;

    try {
      const resp = await fetch(
        `${SUPABASE_URL}/rest/v1/listings?id=eq.${listingId}`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Accept: "application/json",
          },
        }
      );

      const data = await resp.json();
      listingData = data?.[0] || null;
    } catch (err) {
      console.error("Błąd zapytania Supabase:", err);
    }

    // Ustaw domyślne wartości, jeśli brak danych
    const title = listingData?.title || `Oferta #${listingId} - RatujPlon`;
    const description =
      listingData?.description ||
      "Zobacz szczegóły tej oferty na RatujPlon.pl – sprawdź więcej!";
    const image = listingData?.image_url || `${url.origin}/default-og.jpg`;

    // --- jeśli to BOT ---
    if (isBot) {
      const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url.origin}${pathname}">
  <meta property="og:image" content="${image}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <div style="display:none">
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // --- jeśli zwykły użytkownik ---
    const indexResp = await fetch(`${url.origin}/index.html`);
    const indexHtml = await indexResp.text();

    return new Response(indexHtml, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Edge error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
