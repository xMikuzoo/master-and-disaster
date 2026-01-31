import { RouterProvider } from "react-router"
import { ThemeProvider } from "./providers/theme-provider"
import { router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: 5 * 60 * 1000,
			gcTime: 10 * 60 * 1000,
		},
	},
})

export function App() {
	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</ThemeProvider>
	)
}

export default App
