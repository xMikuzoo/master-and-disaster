import { RouterProvider } from "react-router"
import { MainLayout } from "./layouts/main-layout"
import { ThemeProvider } from "./providers/ThemeProvider"
import { router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
})

export function App() {
	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<MainLayout>
					<RouterProvider router={router} />
				</MainLayout>
			</QueryClientProvider>
		</ThemeProvider>
	)
}

export default App
