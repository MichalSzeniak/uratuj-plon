import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingFormSchema, type ListingFormData } from "@/schemas/listing";
import { useCreateListing, useUpdateListing } from "@/hooks/useListings";
import { useAuth } from "@/store/auth";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUploadSimple } from "../ImageUploadSimple";
import { LocationPicker } from "../maps/LocationPicker";
import { toast } from "sonner";

interface CreateListingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editingListing?: any;
}

export function CreateListingForm({
  onSuccess,
  onCancel,
  editingListing,
}: CreateListingFormProps) {
  const { user } = useAuth();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const [newImage, setNewImage] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const isEditing = !!editingListing;

  const [removedExistingImage, setRemovedExistingImage] = useState(false);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      product_type: "vegetables",
      price_type: "normal",
      unit: "kg",
      address: "",
      available_from: new Date().toISOString().split("T")[0],
      images: [],
    },
    values: {
      ...editingListing,
    },
  });

  useEffect(() => {
    if (editingListing && editingListing.product_type) {
      console.log("📝 Setting up form for editing");

      const coordinates = extractCoordinates(editingListing.location);
      setSelectedLocation(coordinates);
      setNewImage(null);
      setRemovedExistingImage(false);

      form.reset({
        title: editingListing.title || "",
        description: editingListing.description || "",
        product_type: editingListing.product_type,
        price_type: editingListing.price_type || "normal",
        price_per_unit: editingListing.price_per_unit || 0,
        unit: editingListing.unit || "kg",
        estimated_amount: editingListing.estimated_amount || undefined,
        address: editingListing.address || "",
        available_from:
          editingListing.available_from?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        available_until: editingListing.available_until?.split("T")[0] || "",
        rescue_reason: editingListing.rescue_reason || "",
        pickup_instructions: editingListing.pickup_instructions || "",
        city: editingListing.city || "",
        region: editingListing.region || "",
        images: editingListing.images || [],
      });

      setTimeout(() => {
        if (editingListing.product_type) {
          form.setValue("product_type", editingListing.product_type);
        }
        if (editingListing.price_type) {
          form.setValue("price_type", editingListing.price_type);
        }
      }, 10);
    }
  }, [editingListing, form]);

  const handleImageChange = (file: File | null) => {
    console.log("📸 Image changed:", file);
    setNewImage(file);
  };

  const handleExistingImageRemove = () => {
    console.log("🗑️ User removed existing image");
    setRemovedExistingImage(true);
    form.setValue("images", []);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    toast.success("📍 Lokalizacja zapisana");
  };

  console.log(editingListing);

  const onSubmit = async (data: ListingFormData) => {
    if (!selectedLocation) {
      toast.error("❌ Wybierz lokalizację na mapie");
      return;
    }

    try {
      const baseData = {
        ...data,
        location: `POINT(${selectedLocation.lng} ${selectedLocation.lat})`,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        available_until: data.available_until || null,
        price_per_unit:
          data.price_type === "rescue" ? null : data.price_per_unit,
        estimated_amount: data.estimated_amount || null,
        rescue_reason: data.rescue_reason || null,
        pickup_instructions: data.pickup_instructions || null,
      };

      if (isEditing) {
        const imagesToSave = removedExistingImage ? [] : data.images;

        await updateListing.mutateAsync({
          id: editingListing.id,
          updates: {
            ...baseData,
            images: imagesToSave,
            new_image: newImage,
          },
        });
      } else {
        await createListing.mutateAsync({
          ...baseData,
          new_image: newImage,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("💥 Form submission failed:", error);
      toast.error("❌ Błąd podczas zapisywania");
    }
  };
  const currentMutation = isEditing ? updateListing : createListing;
  const watchPriceType = form.watch("price_type");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "✏️ Edytuj Ogłoszenie" : "➕ Dodaj Nowe Ogłoszenie"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Zaktualizuj informacje o swoim ogłoszeniu"
            : "Wystaw produkt lub zgłoś akcję ratunkową"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                📝 Podstawowe informacje
              </h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tytuł *</FormLabel>
                    <FormControl>
                      <Input placeholder="Np. Świeże pomidory" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opisz swój produkt..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="product_type"
                  render={({ field }) => {
                    console.log("🎯 Product type field value:", field.value); // ★ DODAJ TEN LOG
                    return (
                      <FormItem>
                        <FormLabel>Typ produktu *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz typ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vegetables">
                              🥦 Warzywa
                            </SelectItem>
                            <SelectItem value="fruits">🍎 Owoce</SelectItem>
                            <SelectItem value="grains">🌾 Zboża</SelectItem>
                            <SelectItem value="honey">🍯 Miód</SelectItem>
                            <SelectItem value="eggs">🥚 Jaja</SelectItem>
                            <SelectItem value="dairy">🧀 Nabiał</SelectItem>
                            <SelectItem value="meat">🥩 Mięso</SelectItem>
                            <SelectItem value="preserves">
                              🥫 Przetwory
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jednostka *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz jednostkę" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">kilogram (kg)</SelectItem>
                          <SelectItem value="item">sztuka (szt.)</SelectItem>
                          <SelectItem value="bundle">pęczek</SelectItem>
                          <SelectItem value="dozen">tuzin (12 szt.)</SelectItem>
                          <SelectItem value="liter">litr (l)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Cena i oferta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">💰 Cena i oferta</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typ oferty *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz typ oferty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">
                            💰 Normalna sprzedaż
                          </SelectItem>
                          <SelectItem value="rescue">
                            🚨 Akcja ratunkowa
                          </SelectItem>
                          <SelectItem value="pick_your_own">
                            🌱 Zbierz sam
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchPriceType !== "rescue" && (
                  <FormField
                    control={form.control}
                    name="price_per_unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cena za {form.watch("unit")} *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Zdjęcie */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🖼️ Zdjęcie główne</h3>

              <FormItem>
                <FormLabel>
                  {isEditing
                    ? "Zmień zdjęcie (opcjonalnie)"
                    : "Dodaj zdjęcie (opcjonalnie)"}
                </FormLabel>
                <FormControl>
                  <ImageUploadSimple
                    onImageChange={handleImageChange}
                    existingImageUrl={editingListing?.images?.[0] || null}
                    onExistingImageRemove={handleExistingImageRemove} // ★ NOWE
                  />
                </FormControl>
                <FormDescription>
                  Zdjęcie główne zwiększa zainteresowanie ogłoszeniem
                </FormDescription>
              </FormItem>
            </div>

            {/* Lokalizacja */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📍 Lokalizacja</h3>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ul. Przykładowa 123, 00-000 Miasto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Wybierz dokładną lokalizację na mapie *
                  {!selectedLocation && (
                    <span className="text-red-500 text-sm">(wymagane)</span>
                  )}
                </FormLabel>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={{
                    lat:
                      selectedLocation?.lat || editingListing?.latitude || 52.0,
                    lng:
                      selectedLocation?.lng ||
                      editingListing?.longitude ||
                      19.0,
                  }}
                />
                {!selectedLocation && (
                  <p className="text-red-500 text-sm">
                    Kliknij na mapie aby wybrać lokalizację
                  </p>
                )}
              </FormItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data dostępności od */}
              <FormField
                control={form.control}
                name="available_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dostępne od *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data dostępności do (opcjonalne) */}
              <FormField
                control={form.control}
                name="available_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dostępne do (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        min={
                          form.watch("available_from") ||
                          new Date().toISOString().split("T")[0]
                        }
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Przyciski */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={currentMutation.isPending}
                className="flex-1"
                size="lg"
              >
                {currentMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditing ? "Zapisywanie..." : "Dodawanie..."}
                  </div>
                ) : isEditing ? (
                  "💾 Zapisz zmiany"
                ) : (
                  "✅ Dodaj ogłoszenie"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={currentMutation.isPending}
                size="lg"
              >
                Anuluj
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function extractCoordinates(location: any) {
  if (!location) return null;

  if (location.coordinates) {
    const [lng, lat] = location.coordinates;
    return { lat, lng };
  } else if (location.x && location.y) {
    return { lat: location.y, lng: location.x };
  }

  return null;
}
