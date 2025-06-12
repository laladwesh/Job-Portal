import { createContext, useContext, useEffect, useState } from "react";

// Default context state and dummy setter (for initial structure)
const initialState = {
  theme: "system",
  setTheme: () => null,
};

// Create the theme context with default state
const ThemeProviderContext = createContext(initialState);

/**
 * ThemeProvider component
 * - Manages color theme ('light', 'dark', or 'system')
 * - Saves user preference to localStorage
 * - Listens to system theme changes if set to 'system'
 * - Provides theme and setter to children via context
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  // State: theme is loaded from localStorage if available, else fallback to defaultTheme
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  // Effect: Whenever theme changes, update <html> class and handle system theme if needed
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove any existing theme classes
    root.classList.remove("light", "dark");

    if (theme === "system") {
      // Detect and apply system color scheme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    // Apply selected theme
    root.classList.add(theme);
  }, [theme]);

  // The context value: theme + setter (which also saves to localStorage)
  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme); // Persist to localStorage
      setTheme(theme);                        // Update local state
    },
  };

  // Provide the context to all child components
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * useTheme hook
 * - Returns current theme and setter function from context
 * - Throws error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
