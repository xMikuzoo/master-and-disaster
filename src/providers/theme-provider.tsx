import { useEffect, useState } from "react"
import { ThemeProviderContext } from "./theme-provider-context"
import { STORAGE_KEYS } from "@/constants"

type Theme = "dark" | "light" | "system"

const VALID_THEMES: readonly Theme[] = ["dark", "light", "system"] as const

function isValidTheme(value: unknown): value is Theme {
	return typeof value === "string" && VALID_THEMES.includes(value as Theme)
}

function loadThemeFromStorage(storageKey: string, defaultTheme: Theme): Theme {
	try {
		const stored = localStorage.getItem(storageKey)
		return isValidTheme(stored) ? stored : defaultTheme
	} catch {
		// localStorage may throw in private browsing mode
		return defaultTheme
	}
}

type ThemeProviderProps = {
	children: React.ReactNode
	defaultTheme?: Theme
	storageKey?: string
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = STORAGE_KEYS.THEME,
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() =>
		loadThemeFromStorage(storageKey, defaultTheme)
	)

	useEffect(() => {
		const root = window.document.documentElement

		root.classList.remove("light", "dark")

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light"

			root.classList.add(systemTheme)
			return
		}

		root.classList.add(theme)
	}, [theme])

	const value = {
		theme,
		setTheme: (newTheme: Theme) => {
			if (!isValidTheme(newTheme)) return
			try {
				localStorage.setItem(storageKey, newTheme)
			} catch {
				// localStorage may throw in private browsing mode
			}
			setTheme(newTheme)
		},
	}

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	)
}
