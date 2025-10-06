// src/components/listings/CreateListingForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingFormSchema } from "@/schemas/listing";
import { useCreateListing } from "@/hooks/useListings";
import { useFarms } from "@/hooks/useFarms";
import { useAuth } from "@/store/auth";
import type { ListingFormData } from "@/types/listings";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CreateListingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateListingForm({
  onSuccess,
  onCancel,
}: CreateListingFormProps) {
  const { user } = useAuth();
  const { data: farms } = useFarms();
  const createListing = useCreateListing();

  // Filtruj farmy użytkownika
  const userFarms = farms?.filter((farm) => farm.farmer_id === user?.id) || [];

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      product_type: "vegetables",
      price_type: "normal",
      unit: "kg",
      available_from: new Date().toISOString().split("T")[0],
    },
  });

  const watchPriceType = form.watch("price_type");

  const onSubmit = async (data: ListingFormData) => {
    try {
      await createListing.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error("Błąd submit:", error);
    }
  };

  if (userFarms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dodaj Ogłoszenie</CardTitle>
          <CardDescription>
            Aby dodać ogłoszenie, najpierw załóż gospodarstwo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <p className="text-gray-600 mb-4">
              Nie masz jeszcze żadnego gospodarstwa
            </p>
            <Button>Dodaj Gospodarstwo</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Dodaj Nowe Ogłoszenie</CardTitle>
        <CardDescription>
          Wystaw produkt lub zgłoś akcję ratunkową
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Wybór gospodarstwa */}
            <FormField
              control={form.control}
              name="farm_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gospodarstwo *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz gospodarstwo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userFarms.map((farm) => (
                        <SelectItem key={farm.id} value={farm.id}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tytuł */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="np. Świeże pomidory koktajlowe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opis */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Opisz swój produkt, metody uprawy, stan..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Typ produktu */}
              <FormField
                control={form.control}
                name="product_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ produktu *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz typ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vegetables">🥦 Warzywa</SelectItem>
                        <SelectItem value="fruits">🍎 Owoce</SelectItem>
                        <SelectItem value="grains">🌾 Zboża</SelectItem>
                        <SelectItem value="honey">🍯 Miód</SelectItem>
                        <SelectItem value="eggs">🥚 Jaja</SelectItem>
                        <SelectItem value="dairy">🧀 Nabiał</SelectItem>
                        <SelectItem value="meat">🥩 Mięso</SelectItem>
                        <SelectItem value="preserves">🥫 Przetwory</SelectItem>
                        <SelectItem value="other">📦 Inne</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Jednostka */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jednostka *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz jednostkę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="item">sztuka</SelectItem>
                        <SelectItem value="bundle">pęczek</SelectItem>
                        <SelectItem value="dozen">tuzin</SelectItem>
                        <SelectItem value="liter">litr</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Typ ceny */}
            <FormField
              control={form.control}
              name="price_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ oferty *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                      <SelectItem value="rescue">🚨 Akcja ratunkowa</SelectItem>
                      <SelectItem value="pick_your_own">
                        🌱 Zbierz sam
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === "rescue" &&
                      "Akcja ratunkowa wymaga zatwierdzenia przez administratora"}
                    {field.value === "pick_your_own" &&
                      "Klient przyjeżdża i zbiera samodzielnie"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cena - pokazuj tylko jeśli NIE jest to akcja ratunkowa */}
            {watchPriceType !== "rescue" && (
              <FormField
                control={form.control}
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cena za {form.watch("unit") || "jednostkę"} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>Wpisz cenę w PLN</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Powód akcji ratunkowej - pokazuj tylko dla rescue */}
            {watchPriceType === "rescue" && (
              <FormField
                control={form.control}
                name="rescue_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Powód akcji ratunkowej *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opisz dlaczego potrzebujesz akcji ratunkowej (np. niskie ceny rynkowe, nadmiar plonów, krótki termin...)"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Szacowana ilość */}
            <FormField
              control={form.control}
              name="estimated_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Szacowana ilość (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="np. 100"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    Przybliżona ilość produktu do sprzedania
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instrukcje odbioru */}
            <FormField
              control={form.control}
              name="pickup_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrukcje odbioru (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Godziny odbioru, miejsce, dodatkowe uwagi..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data dostępności od */}
              <FormField
                control={form.control}
                name="available_from"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dostępne od *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", {
                                locale: pl,
                              })
                            ) : (
                              <span>Wybierz datę</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString().split("T")[0])
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data dostępności do */}
              <FormField
                control={form.control}
                name="available_until"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dostępne do (opcjonalnie)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", {
                                locale: pl,
                              })
                            ) : (
                              <span>Wybierz datę</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString().split("T")[0])
                          }
                          disabled={(date) => {
                            const fromDate = form.watch("available_from");
                            return date < new Date(fromDate);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Przyciski */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={createListing.isPending}
                className="flex-1"
              >
                {createListing.isPending
                  ? "Dodawanie..."
                  : watchPriceType === "rescue"
                  ? "🎯 Zgłoś Akcję Ratunkową"
                  : "✅ Dodaj Ogłoszenie"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={createListing.isPending}
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
