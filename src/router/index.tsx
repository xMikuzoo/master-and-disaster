import { Example } from "@/components/example";
import { createBrowserRouter, Navigate } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Example title="Home Page" />,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
  {
    path: "/404",
    element: <Example title="404 - Not Found" />,
  },
]);
