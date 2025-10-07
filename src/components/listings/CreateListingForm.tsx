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
import { AlertTriangle } from "lucide-react";
import { useGuestListingLimit } from "@/hooks/useGuestListingLimit";

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

  const { canCreateListing, incrementGuestListing } = useGuestListingLimit();
  const [isGuestMode, setIsGuestMode] = useState(!user);
  const [guestContact, setGuestContact] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    setIsGuestMode(!user);
  }, [user]);
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
      contact_phone: "",
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
    if (isGuestMode && !canCreateListing) {
      toast.error("❌ Osiągnięto dzienny limit ogłoszeń");
      return;
    }
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
        is_guest_listing: isGuestMode,
        guest_contact_email: isGuestMode ? guestContact.email : null,
        guest_contact_phone: isGuestMode ? guestContact.phone : null,
        requires_approval: isGuestMode, // Tylko guest ogłoszenia wymagają aprobaty
        status: isGuestMode ? "pending" : "active", // Guest = pending, user = active
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

        if (isGuestMode) {
          incrementGuestListing();
        }
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
            : isGuestMode
            ? "Dodaj ogłoszenie bez logowania (wymaga potwierdzenia)"
            : "Wystaw produkt lub zgłoś akcję ratunkową"}
        </CardDescription>

        {/* ★ INFORMACJA O TRYBIE GOŚCIA */}
        {isGuestMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-medium">Tryb gościa</p>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Twoje ogłoszenie będzie widoczne po zatwierdzeniu przez
              administratora. Pamiętaj aby podać prawidłowy kontakt.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                📝 Podstawowe informacje
              </h3>

              {isGuestMode && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900">
                    📞 Twoje dane kontaktowe
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Podaj dane do kontaktu - będą widoczne tylko w ogłoszeniu po
                    zatwierdzeniu.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="twoj@email.com"
                        value={guestContact.email}
                        onChange={(e) =>
                          setGuestContact((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Telefon *
                      </label>
                      <Input
                        type="tel"
                        placeholder="+48 123 456 789"
                        value={guestContact.phone}
                        onChange={(e) =>
                          setGuestContact((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <p className="text-xs text-blue-600">
                    💡 Te dane będą wykorzystane tylko do kontaktu w sprawie
                    tego ogłoszenia.
                  </p>
                </div>
              )}

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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                📞 Informacje kontaktowe
              </h3>
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numer telefonu (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+48 123 456 789"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Numer będzie widoczny publicznie
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                disabled={currentMutation.isPending || !canCreateListing}
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
