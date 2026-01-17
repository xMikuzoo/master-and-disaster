import { Skeleton } from "./ui/skeleton"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"

export function SummonerProfileSkeleton() {
	return (
		<>
			<Item variant={"outline"} className="w-fit min-w-96">
				<ItemMedia>
					<Skeleton className="h-12 w-12 rounded-full" />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>
						<Skeleton className="h-6 w-40 rounded" />
					</ItemTitle>
					<Skeleton className="mt-2 h-4 w-32 rounded" />
				</ItemContent>
				<ItemActions></ItemActions>
			</Item>
		</>
	)
}
