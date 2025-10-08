import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,           
  process.env.SUPABASE_SERVICE_ROLE_KEY    
);

export default async function handler(req, res) {
  const { id } = req.query;

  const { data, error } = await supabase
    .from('listings')
    .select('title, description')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).send('Nie znaleziono ogłoszenia');
  }

  const { title, description, image_url } = data;

  const html = `
    <!DOCTYPE html>
    <html lang="pl">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="https://ratujplon.pl/og-image.jpg" />
        <meta property="og:url" content="https://ratujplon.pl/listing/${id}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${image_url}" />
      </head>
      <body>
        <script>
          window.location.href = "https://ratujplon.pl/listing/${id}";
        </script>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
