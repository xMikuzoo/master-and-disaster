import {
  NavigationMenu as _NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
export function NavigationMenu() {
  return (
    <_NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/">Home</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/asf">Non existing</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </_NavigationMenu>
  );
}
