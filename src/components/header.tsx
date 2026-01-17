import { ModeToggle } from "./mode-toggle";
import { NavigationMenu } from "./navigation-menu";

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 flex min-h-12 justify-between rounded-md border-b p-4">
      <NavigationMenu />
      <ModeToggle />
    </header>
  );
}
