import type { ReactNode } from "react";
import { Header } from "@/components/header.tsx";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="m-2 mt-0 flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 overflow-y-auto rounded-b-md px-4 py-8">
        {children}
      </main>
    </div>
  );
}
