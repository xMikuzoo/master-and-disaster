import {
	NavigationMenu as _NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { RouterPath } from "@/types/enums"
import { Link } from "react-router"

export function NavigationMenu() {
	return (
		<_NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to={RouterPath.HOME}>Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<a href="/asf">Non existing</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</_NavigationMenu>
	)
}
