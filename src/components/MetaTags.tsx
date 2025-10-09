import { Helmet } from "react-helmet-async";

const MetaTags = ({
  title = "Default Title",
  description = "Default description",
  image = "https://www.ratujplon.pl/og-image.jpg",
  url = window.location.href,
  type = "website",
  keywords = "",
}) => {
  return (
    <Helmet>
      {/* Podstawowe meta tagi */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph (Facebook) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Your Site Name" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@yourtwitterhandle" />

      {/* Dodatkowe tagi */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default MetaTags;
