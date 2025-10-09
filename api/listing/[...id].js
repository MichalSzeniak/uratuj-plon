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

    let listingData = null;

    try {
      const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL");
      const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
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

        if (resp.ok) {
          const data = await resp.json();
          listingData = data?.[0] || null;
        } else {
          console.warn("Supabase response not OK:", resp.status);
        }
      } else {
        console.warn("Brak SUPABASE_URL lub SUPABASE_ANON_KEY");
      }
    } catch (err) {
      console.error("Błąd pobierania z Supabase:", err);
    }

    const title = listingData?.title || `Oferta #${listingId} - RatujPlon`;
    const description =
      listingData?.description ||
      "Zobacz szczegóły tej oferty na RatujPlon.pl - sprawdź więcej!";

    if (isBot) {
      const html = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url.origin}${pathname}" />
  <meta property="og:image" content="${url.origin}/og-image2.jpg" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}." />
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
