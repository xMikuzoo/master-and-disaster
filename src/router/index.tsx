import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import { createBrowserRouter, Navigate } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
  {
    path: "/not-found",
    element: <NotFoundPage />,
  },
]);
