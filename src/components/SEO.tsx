type Props = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
};

export default function SEO({
  title,
  description,
  image = "https://www.ratujplon.pl/og-image.jpg",
  url = "https://www.ratujplon.pl/",
  type = "website",
}: Props) {
  const fullTitle = title
    ? `${title} | RatujPlon`
    : "RatujPlon - oddaj lub sprzedaj swoje plony";
  const fullDescription =
    description ||
    "RatujPlon pomaga rolnikom w sprzedaży i przekazywaniu nadwyżek plonów lokalnie.";

  return (
    <>
      {/* Podstawowe */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AgroMarket" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* SEO – roboty */}
      <meta name="robots" content="index, follow" />
    </>
  );
}
