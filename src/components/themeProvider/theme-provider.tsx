import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: "dark" | "light";
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      systemTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",

      setTheme: (theme: Theme) => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        let appliedTheme = theme;

        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          appliedTheme = systemTheme;
          set({ systemTheme });
        }

        root.classList.add(appliedTheme);
        set({ theme });
      },
    }),
    {
      name: "vite-ui-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme after hydration
          setTimeout(() => state.setTheme(state.theme), 0);
        }
      },
    }
  )
);

// Hook dla komponentów
export const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  return { theme, setTheme };
};

// Hook dla aktualnego wyglądu (uwzględnia system theme)
export const useCurrentTheme = () => {
  const { theme, systemTheme } = useThemeStore();
  return theme === "system" ? systemTheme : theme;
};
