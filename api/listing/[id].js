import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;

  // Pobierz post bezpośrednio z Supabase
  //   const { data: post } = await supabase
  //     .from('posts')
  //     .select('*')
  //     .eq('slug', slug)
  //     .single()

  const { data } = await supabase
    .from("listings")
    .select("title, description")
    .eq("id", slug)
    .single();

  //   const { title, description } = data;

  if (!data) {
    return res.status(404).send("Nie znaleziono ogłoszenia");
  }

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.title}</title>
      <meta name="description" content="${data.description}" />
      
      <!-- Open Graph -->
      <meta property="og:title" content="${data.title}" />
      <meta property="og:description" content="${data.description}" />
      <meta property="og:image" content="https://ratujplon.pl/og-image2.jpg" />
      <meta property="og:url" content="https://ratujplon.pl/listing/${slug}" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Ratuj plon" />
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${data.title}" />
      <meta name="twitter:description" content="${data.description}" />
      <meta name="twitter:image" content="https://ratujplon.pl/og-image2.jpg" />
      
      <!-- Redirect do prawdziwej strony -->
      <script>
        setTimeout(() => {
          window.location.href = '/blog/${post.slug}'
        }, 100)
      </script>
    </head>
    <body>
      <h1>${post.title}</h1>
      <p>${post.description}</p>
      <p>Przekierowuję do posta...</p>
    </body>
    </html>
  `);
}

// export default function handler(req, res) {
//   const { id } = req.query;

//   const ua = req.headers['user-agent'] || '';
//   const isBot = /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot/i.test(ua);

//   if (isBot) {
//     res.setHeader("Content-Type", "text/html");
//     res.status(200).send(`
//       <html>
//         <head>
//           <meta property="og:title" content="Testowy tytuł ${id}" />
//           <meta property="og:description" content="Opis testowy ${id}" />
//         </head>
//         <body></body>
//       </html>
//     `);
//   } else {
//     res.redirect(302, `/listing/${id}?client=true`);
//   }
// }

// // export default async function handler(req, res) {
// //   const { id } = req.query;

// //   const { data, error } = await supabase
// //     .from('listings')
// //     .select('title, description')
// //     .eq('id', id)
// //     .single();

// //   if (error || !data) {
// //     return res.status(404).send('Nie znaleziono ogłoszenia');
// //   }

// //   const { title, description, image_url } = data;

// //   const html = `
// //     <!DOCTYPE html>
// //     <html lang="pl">
// //       <head>
// //         <meta charset="utf-8" />
// //         <title>${title}</title>
// //         <meta name="description" content="${description}" />
// //         <meta property="og:title" content="${title}" />
// //         <meta property="og:description" content="${description}" />
// //         <meta property="og:image" content="https://ratujplon.pl/og-image.jpg" />
// //         <meta property="og:url" content="https://ratujplon.pl/listing/${id}" />
// //         <meta property="og:type" content="article" />
// //         <meta name="twitter:card" content="summary_large_image" />
// //         <meta name="twitter:title" content="${title}" />
// //         <meta name="twitter:description" content="${description}" />
// //         <meta name="twitter:image" content="${image_url}" />
// //       </head>
// //       <body>
// //         <script>
// //           window.location.href = "https://ratujplon.pl/listing/${id}";
// //         </script>
// //       </body>
// //     </html>
// //   `;

// //   res.setHeader('Content-Type', 'text/html');
// //   res.status(200).send(html);
// // }
