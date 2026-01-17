import { RouterProvider } from "react-router";
import { MainLayout } from "./layouts/main-layout";
import { ThemeProvider } from "./providers/ThemeProvider";
import { router } from "./router";

export function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <RouterProvider router={router} />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
