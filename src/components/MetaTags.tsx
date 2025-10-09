// components/MetaTags.jsx
import { useEffect } from "react";

const MetaTags = ({
  title = "Default Title",
  description = "Default description",
  image = "/default-image.jpg",
  url = "",
  type = "website",
  keywords = "",
}) => {
  useEffect(() => {
    // Aktualizacja title
    document.title = title;

    // Aktualizacja lub tworzenie meta tagów
    const updateMetaTag = (name, content, attribute = "name") => {
      let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute(attribute, name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");
    updateMetaTag("og:url", url || window.location.href, "property");
    updateMetaTag("og:type", type, "property");

    // Twitter
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url || window.location.href);

    // Cleanup function
    return () => {
      // Możesz dodać cleanup jeśli potrzebujesz
    };
  }, [title, description, image, url, type, keywords]);

  return null; // Ten komponent nie renderuje nic w DOM
};

export default MetaTags;
