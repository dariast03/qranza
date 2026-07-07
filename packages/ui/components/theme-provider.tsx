import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

const ThemeProviderContext = createContext<{
	theme: Theme;
	setTheme: (theme: Theme) => void;
}>({
	theme: "system",
	setTheme: () => null,
});

function isTheme(value: string | null): value is Theme {
	return value === "dark" || value === "light" || value === "system";
}

function applyThemeToDocument(theme: Theme): void {
	const root = document.documentElement;
	root.classList.remove("light", "dark");

	if (theme === "system") {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
		root.classList.add(systemTheme);
		return;
	}

	root.classList.add(theme);
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(defaultTheme);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(storageKey);
			if (isTheme(stored)) {
				setThemeState(stored);
			}
		} catch {
			// localStorage may be unavailable (private mode, SSR polyfills, etc.)
		}
	}, [storageKey]);

	useEffect(() => {
		applyThemeToDocument(theme);

		if (theme !== "system") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			applyThemeToDocument("system");
		};
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [theme]);

	const value = {
		theme,
		setTheme: (next: Theme) => {
			try {
				if (typeof localStorage !== "undefined") {
					localStorage.setItem(storageKey, next);
				}
			} catch {
				// ignore persistence failures
			}
			setThemeState(next);
		},
	};

	return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
};
