export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  const html = `
    <!DOCTYPE html>
    <html lang="pl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Podgląd listingu ${id}</title>
        <meta property="og:title" content="Podgląd listingu ${id}" />
        <meta property="og:description" content="To przykładowy opis dla ${id}" />
        <meta property="og:image" content="https://ratujplon.pl/og-image2.jpg" />
      </head>
      <body>
        <script>
          window.location.href = "https://${process.env.VERCEL_URL}/listing/${id}";
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
