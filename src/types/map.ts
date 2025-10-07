export interface Location {
  lat: number;
  lng: number;
}

export interface Farm {
  id: string;
  name: string;
  description: string | null;
  location?: Location;
  latitude?: number;
  longitude?: number;
  address: string | null;
  contact_phone: string | null;
  images: string[] | null;
  is_verified: boolean;
  created_at: string;
  farmer_id: string;
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  listings?: Listing[];
}

export interface Listing {
  id: string;
  farm_id: string;
  title: string;
  description: string | null;
  product_type:
    | "vegetables"
    | "fruits"
    | "grains"
    | "honey"
    | "eggs"
    | "dairy"
    | "meat"
    | "preserves"
    | "other";
  price_type: "normal" | "rescue" | "pick_your_own";
  price_per_unit: number | null;
  unit: "kg" | "item" | "bundle" | "dozen" | "liter";
  estimated_amount: number | null;
  available_from: string;
  available_until: string | null;
  status: "active" | "inactive" | "completed";
  rescue_reason: string | null;
  pickup_instructions: string | null;
  created_at: string;
}

export type MapViewport = {
  center: [number, number];
  zoom: number;
};

export function getFarmCoordinates(farm: Farm): Location {
  if (farm.location && farm.location.lat && farm.location.lng) {
    return farm.location;
  }

  if (farm.location && (farm.location as any).coordinates) {
    const [lng, lat] = (farm.location as any).coordinates;
    if (lat && lng) {
      return { lat, lng };
    }
  }

  if (farm.latitude && farm.longitude) {
    return { lat: farm.latitude, lng: farm.longitude };
  }

  console.warn("Farm without valid coordinates:", farm.id, farm.name);
  return { lat: 52.2297, lng: 21.0122 };
}
