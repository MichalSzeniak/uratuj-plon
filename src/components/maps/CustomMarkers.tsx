import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (color: string) => {
  const html = renderToStaticMarkup(
    <div
      style={{
        position: "relative",
        width: "30px",
        height: "40px",
      }}
    >
      <svg width="30" height="40" viewBox="0 0 30 40">
        <path
          d="M15 40s-10-6.5-10-17.5c0-5.5 4.5-10 10-10s10 4.5 10 10c0 11-10 17.5-10 17.5z"
          fill="#000"
          fillOpacity="0.2"
          transform="translate(0, 2)"
        />
        <path
          d="M15 38s-10-6.5-10-17.5c0-5.5 4.5-10 10-10s10 4.5 10 10c0 11-10 17.5-10 17.5z"
          fill={color}
          stroke="#fff"
          strokeWidth="2"
        />
        <circle cx="15" cy="18" r="4" fill="#fff" fillOpacity="0.8" />
      </svg>
    </div>
  );

  return L.divIcon({
    html: html,
    className: "custom-leaflet-marker",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};

export const markerColors = {
  normal: "#22c55e",
  rescue: "#ef4444",
  pickup: "#3b82f6",
};

export const getMarkerColor = (listing: any) => {
  if (listing.price_type === "rescue") {
    return markerColors.rescue;
  }

  if (listing.price_type === "pick_your_own") {
    return markerColors.pickup;
  }

  return markerColors.normal;
};

export const createFarmIcon = (listing: any) => {
  const color = getMarkerColor(listing);

  return createCustomIcon(color);
};
