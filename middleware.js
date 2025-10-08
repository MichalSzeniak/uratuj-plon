export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";

  const isSocialBot =
    /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot/i.test(
      userAgent
    );

  // Jeśli bot odwiedza listing
  if (isSocialBot && url.pathname.startsWith("/listing/")) {
    const slug = url.pathname.split("/listing/")[1];
    console.log("Bot detected, rewriting to API with slug:", slug);

    // Przekieruj do API
    return Response.rewrite(new URL(`/api/listing?slug=${slug}`, request.url));
  }

  // Dla wszystkich innych requestów - normalne SPA
  console.log("Normal user, serving SPA");
  return Response.rewrite(new URL("/index.html", request.url));
}
