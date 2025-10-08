import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FarmMap } from "@/components/maps/FarmMap";
import SEO from "@/components/SEO";

export function HomePage() {
  const [showRescueOnly, setShowRescueOnly] = useState(false);

  return (
    <>
      <SEO
        title="Znajdź rolnika w swojej okolicy | Pomóż, kup lub przekaż plony - RatujPlon"
        description="Znajdź rolników w swojej okolicy, kupuj lokalne produkty prosto z gospodarstw i pomóż ratować plony przed zmarnowaniem."
      />

      <section className="space-y-10 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              {showRescueOnly
                ? "🚨 Ratuj plony i wspieraj rolników"
                : "Znajdź lokalnych rolników i świeże plony"}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              {showRescueOnly
                ? "Pomóż rolnikom w potrzebie, ratuj żywność przed zmarnowaniem i wspieraj polskie gospodarstwa rolne."
                : "Odkryj lokalne gospodarstwa rolne, kupuj świeże produkty bezpośrednio od rolników i wspieraj wieś w swojej okolicy."}
            </p>
          </div>

          <Button
            variant={showRescueOnly ? "destructive" : "outline"}
            size="lg"
            onClick={() => setShowRescueOnly(!showRescueOnly)}
            className="flex items-center space-x-2"
          >
            <span>🚨</span>
            <span>Akcje ratunkowe</span>
            {showRescueOnly && (
              <span className="bg-white text-red-500 text-xs px-2 py-1 rounded-full ml-2">
                Aktywne
              </span>
            )}
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="h-[600px] min-h-[400px] w-full relative">
            <FarmMap showRescueOnly={showRescueOnly} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-none">
            <CardHeader className="text-center">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold text-gray-900">
                Świeże produkty od rolników
              </h3>
            </CardHeader>
            <CardContent className="text-center text-gray-600 text-sm">
              Kupuj warzywa, owoce i zboża bezpośrednio z gospodarstw rolnych w
              Twojej okolicy.
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-none">
            <CardHeader className="text-center">
              <div className="text-3xl mb-2">🚨</div>
              <h3 className="font-semibold text-gray-900">
                Ratuj plony i pomagaj
              </h3>
            </CardHeader>
            <CardContent className="text-center text-gray-600 text-sm">
              Dołącz do akcji ratunkowych i pomóż ograniczyć marnowanie żywności
              wśród lokalnych gospodarstw.
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-none">
            <CardHeader className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-semibold text-gray-900">
                Wspieraj lokalne gospodarstwa
              </h3>
            </CardHeader>
            <CardContent className="text-center text-gray-600 text-sm">
              Pomóż rolnikom rozwijać swoje gospodarstwa, kupując bezpośrednio u
              źródła.
            </CardContent>
          </Card>
        </div>

        <section className="mt-12 text-center text-gray-600 text-sm max-w-3xl mx-auto leading-relaxed">
          <p>
            <strong>RatujPlon</strong> to platforma wspierająca polskich
            rolników i lokalne społeczności. Dzięki interaktywnej mapie
            znajdziesz gospodarstwa, które potrzebują wsparcia lub oferują
            świeże produkty prosto z pola. Wspieraj rolników, ratuj plony i
            buduj zrównoważoną przyszłość polskiego rolnictwa.
          </p>
        </section>
      </section>
    </>
  );
}
