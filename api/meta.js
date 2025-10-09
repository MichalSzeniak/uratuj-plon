// api/meta.js
import { supabase } from '../lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/';

  // Pobierz dane z Supabase
//   const { data: page } = await supabase
//     .from('pages')
//     .select('*')
//     .eq('path', path)
//     .single();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${path || 'Default Title'}</title>
  <meta name="description" content="${path || 'Default description'}">
  <meta property="og:title" content="${path || 'Default Title'}">
  <meta property="og:description" content="${path || 'Default description'}">
  <meta property="og:image" content="https://https://ratujplon.pl//api/og?title=${encodeURIComponent(path || 'Default Title')}&description=${encodeURIComponent(path || 'Default description')}">
  <meta property="og:url" content="https://https://ratujplon.pl/${path}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${path || 'Default Title'}">
  <meta name="twitter:description" content="${path || 'Default description'}">
  <meta name="twitter:image" content="https://https://ratujplon.pl//api/og?title=${encodeURIComponent(path || 'Default Title')}&description=${encodeURIComponent(path || 'Default description')}">
  <meta http-equiv="refresh" content="0;url=https://https://ratujplon.pl/${path}">
</head>
<body>
  <p>Redirecting to <a href="https://https://ratujplon.pl/${path}">${path || 'Default Title'}</a></p>
</body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}