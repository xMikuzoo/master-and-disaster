import { GamesTogetherPage } from "@/pages/games-together/games-together"
import { HomePage } from "@/pages/home"
import { NotFoundPage } from "@/pages/not-found"
import { RouterPath } from "@/types/enums"
import { createBrowserRouter, Navigate } from "react-router"
import { MainLayout } from "@/layouts/main-layout"

export const router = createBrowserRouter([
	{
		element: <MainLayout />,
		children: [
			{
				path: RouterPath.HOME,
				element: <HomePage />,
			},
			{
				path: RouterPath.GAMES_TOGETHER,
				element: <GamesTogetherPage />,
			},
			{
				path: RouterPath.NOT_FOUND,
				element: <NotFoundPage />,
			},
			{
				path: "*",
				element: <Navigate to={RouterPath.NOT_FOUND} replace />,
			},
		],
	},
])
