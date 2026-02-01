import { lazy, Suspense } from "react"
import { RouterPath } from "@/types/enums"
import { createBrowserRouter, Navigate } from "react-router"
import { MainLayout } from "@/layouts/main-layout"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load page components for code splitting
const HomePage = lazy(() =>
	import("@/pages/home").then((m) => ({ default: m.HomePage }))
)
const GamesTogetherPage = lazy(() =>
	import("@/pages/games-together/games-together").then((m) => ({
		default: m.GamesTogetherPage,
	}))
)
const NotFoundPage = lazy(() =>
	import("@/pages/not-found").then((m) => ({ default: m.NotFoundPage }))
)

function PageSkeleton() {
	return (
		<div className="container mx-auto p-4">
			<div className="space-y-4">
				<Skeleton className="h-12 w-64" />
				<Skeleton className="h-48 w-full" />
				<Skeleton className="h-48 w-full" />
			</div>
		</div>
	)
}

function withSuspense(Component: React.ComponentType) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<Component />
		</Suspense>
	)
}

export const router = createBrowserRouter([
	{
		element: <MainLayout />,
		children: [
			{
				path: RouterPath.HOME,
				element: withSuspense(HomePage),
			},
			{
				path: RouterPath.GAMES_TOGETHER,
				element: withSuspense(GamesTogetherPage),
			},
			{
				path: RouterPath.NOT_FOUND,
				element: withSuspense(NotFoundPage),
			},
			{
				path: "*",
				element: <Navigate to={RouterPath.NOT_FOUND} replace />,
			},
		],
	},
])
