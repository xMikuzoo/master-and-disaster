import { Outlet } from "react-router"
import { Header } from "@/components/header.tsx"
import { Toaster } from "@/components/ui/sonner"

export function MainLayout() {
	return (
		<div className="m-2 mt-0 flex min-h-screen flex-col">
			<Header />
			<main className="container mx-auto flex-1 overflow-y-auto rounded-b-md px-4 py-8">
				<Outlet />
			</main>
			<Toaster />
		</div>
	)
}
