import { useEffect } from "react";
import { useThemeStore } from "./theme-provider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useThemeStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        setTheme("system"); // re-apply system theme
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, setTheme]);

  return <>{children}</>;
}
