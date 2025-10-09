import { useEffect } from "react";

const ListingSEO = ({ listingData }: { listingData: any }) => {
  useEffect(() => {
    if (!listingData) return;

    // Update meta tags for client-side navigation
    const metaTags = {
      "og:title": listingData.title,
      "og:description": listingData.description,
      "og:image": listingData.image,
      "og:url": window.location.href,
      "og:type": "website",
      "twitter:card": "summary_large_image",
      "twitter:title": listingData.title,
      "twitter:description": listingData.description,
      "twitter:image": listingData.image,
      description: listingData.description,
    };

    Object.entries(metaTags).forEach(([property, content]) => {
      let meta =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        if (property.startsWith("og:")) {
          meta.setAttribute("property", property);
        } else {
          meta.setAttribute("name", property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });

    document.title = listingData.title;
  }, [listingData]);

  return null;
};

export default ListingSEO;
