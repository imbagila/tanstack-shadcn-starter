import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { ScriptOnce } from "@tanstack/react-router";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

function readStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  const stored = localStorage.getItem(storageKey);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : defaultTheme;
}

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultTheme);

  return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`;
}

const themeStoreListeners = new Set<() => void>();

function notifyThemeStore() {
  for (const listener of themeStoreListeners) {
    listener();
  }
}

function subscribeSystemTheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSystemThemeSnapshot(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getSystemThemeServerSnapshot(): ResolvedTheme {
  return "light";
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

function applyResolvedTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

function useStoredTheme(storageKey: string, defaultTheme: Theme) {
  return useSyncExternalStore(
    (onStoreChange) => {
      themeStoreListeners.add(onStoreChange);
      const onStorage = (event: StorageEvent) => {
        if (event.key === storageKey || event.key === null) onStoreChange();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        themeStoreListeners.delete(onStoreChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    () => readStoredTheme(storageKey, defaultTheme),
    () => defaultTheme,
  );
}

function useSystemTheme() {
  return useSyncExternalStore(subscribeSystemTheme, getSystemThemeSnapshot, getSystemThemeServerSnapshot);
}

function ThemeProviderInner({
  children,
  defaultTheme,
  storageKey,
}: Required<Pick<ThemeProviderProps, "defaultTheme" | "storageKey">> & Pick<ThemeProviderProps, "children">) {
  const theme = useStoredTheme(storageKey, defaultTheme);
  const systemTheme = useSystemTheme();
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next);
    notifyThemeStore();
  };

  return (
    <ThemeProviderContext value={{ theme, resolvedTheme, setTheme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext>
  );
}

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme" }: ThemeProviderProps) {
  return (
    <ThemeProviderInner key={`${storageKey}:${defaultTheme}`} defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeProviderInner>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
