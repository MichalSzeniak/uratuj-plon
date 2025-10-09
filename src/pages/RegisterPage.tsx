import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Profile } from "@/types/database";
import { Logo } from "@/components/Logo";
// import { useAuth } from "@/store/auth";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    full_name: "",
    role: "customer" as Profile["role"],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // const { signUpWithPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Walidacja
    if (formData.password !== formData.confirmPassword) {
      setMessage("Hasła nie są identyczne");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Hasło musi mieć co najmniej 6 znaków");
      setLoading(false);
      return;
    }

    try {
      // await signUpWithPassword(formData.email, formData.password, {
      //   username: formData.username || formData.email.split("@")[0],
      //   full_name: formData.full_name,
      //   role: formData.role,
      // });
      setMessage("Konto utworzone! Sprawdź email aby potwierdzić rejestrację.");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setMessage(error.message || "Błąd podczas rejestracji");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-muted-foreground">
            Dołącz do <Logo />
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Stwórz konto i zacznij korzystać z platformy
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-muted-foreground rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="adres@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-muted-foreground"
            >
              Nazwa użytkownika
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-muted-foreground rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="twój_nick"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-muted-foreground"
            >
              Imię i nazwisko
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-muted-foreground rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Jan Kowalski"
              value={formData.full_name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-muted-foreground"
            >
              Kim jesteś? *
            </label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="customer">
                🛒 Klient - chcę kupować świeże produkty
              </option>
              <option value="farmer">
                👨‍🌾 Rolnik - chcę sprzedawać swoje plony
              </option>
              <option value="collector">
                🌱 Zbieracz - chcę ratować niewykorzystane plony
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Hasło *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-muted-foreground rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Minimum 6 znaków"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-muted-foreground"
            >
              Potwierdź hasło *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-muted-foreground rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Powtórz hasło"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Rejestracja..." : "Zarejestruj się"}
            </button>
          </div>

          {message && (
            <div
              className={`text-center text-sm p-3 rounded-lg ${
                message.includes("Błąd") || message.includes("błąd")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Masz już konto?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Zaloguj się
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Rejestrując się, akceptujesz nasze</p>
          <p>
            <a href="#" className="text-green-600 hover:text-green-500">
              Warunki korzystania z usługi
            </a>{" "}
            i{" "}
            <a href="#" className="text-green-600 hover:text-green-500">
              Politykę prywatności
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
