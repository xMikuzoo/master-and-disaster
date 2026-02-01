import { RouterProvider } from "react-router"
import { ThemeProvider } from "./providers/theme-provider"
import { SelectedAccountsProvider } from "./providers/selected-accounts-provider"
import { router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ErrorBoundary } from "./components/error-boundary"
import { composeProviders } from "./lib/compose-providers"
import { CACHE_TIMING } from "./constants/api"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: CACHE_TIMING.STALE_TIME,
			gcTime: CACHE_TIMING.GC_TIME,
		},
	},
})

function QueryProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	)
}

const Providers = composeProviders(
	ThemeProvider,
	SelectedAccountsProvider,
	QueryProvider
)

export function App() {
	return (
		<ErrorBoundary>
			<Providers>
				<RouterProvider router={router} />
			</Providers>
		</ErrorBoundary>
	)
}

export default App
