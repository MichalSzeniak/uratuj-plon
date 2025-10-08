export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // np. 'abc123'

  // 🔹 Tu możesz pobrać dane z Supabase lub z innego API
  // Przykład "na sucho":
  const data = {
    title: `listing #${id}`,
    description: `Opis listingu o ID ${id}`,
    image: `https://ratujplon.pl/og-images/${id}.jpg`, // możesz generować lub mieć domyślne
  };

  // 🔹 HTML z metatagami
  const html = `
    <!DOCTYPE html>
    <html lang="pl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${data.title}</title>
        <meta name="description" content="${data.description}" />

        <!-- Open Graph -->
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${data.title}" />
        <meta property="og:description" content="${data.description}" />
        <meta property="og:image" content="${data.image}" />
        <meta property="og:url" content="https://ratujplon.pl/listing/${id}" />

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${data.title}" />
        <meta name="twitter:description" content="${data.description}" />
        <meta name="twitter:image" content="${data.image}" />
      </head>
      <body>
        <script>
          // Po wczytaniu przekierowujemy użytkownika do SPA
          window.location.href = "https://ratujplon.pl/listing/${id}";
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
