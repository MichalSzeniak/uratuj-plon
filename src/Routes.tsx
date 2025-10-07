// src/Routes.tsx - DODAJ PROFIL
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthCallback } from "./pages/AuthCallback";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ListingsPage } from "./pages/ListingsPage";
import { ListingPage } from "./pages/ListingPage";
import { RescueView } from "./components/rescue/RescueView";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/rescue" element={<RescueView />} />
        {/* DODANA STRONA PROFILU */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
