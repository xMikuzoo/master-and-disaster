import { memo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getProfileIcon } from "@/api/ddragon-cdn"
import { Skeleton } from "@/components/ui/skeleton"
import { Crown, Skull } from "lucide-react"
import { UI_TEXTS } from "@/constants/ui-texts"
import { cn } from "@/utils"

interface PlayerInfo {
	displayName: string
	profileIconId?: number
	isMaster: boolean
	score: number
}

interface MasterDisasterBannerProps {
	player1: PlayerInfo
	player2: PlayerInfo
	isLoading?: boolean
}

export const MasterDisasterBanner = memo(function MasterDisasterBanner({
	player1,
	player2,
	isLoading,
}: MasterDisasterBannerProps) {
	if (isLoading) {
		return (
			<div className="bg-muted rounded-lg p-4">
				<div className="flex items-center justify-center gap-8">
					<div className="flex flex-col items-center gap-2">
						<Skeleton className="h-16 w-16 rounded-full" />
						<Skeleton className="h-4 w-20" />
					</div>
					<Skeleton className="h-6 w-8" />
					<div className="flex flex-col items-center gap-2">
						<Skeleton className="h-16 w-16 rounded-full" />
						<Skeleton className="h-4 w-20" />
					</div>
				</div>
			</div>
		)
	}

	const master = player1.isMaster ? player1 : player2
	const disaster = player1.isMaster ? player2 : player1

	return (
		<div className="relative overflow-hidden rounded-lg">
			{/* Gradient background */}
			<div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-red-500/20" />

			<div className="relative px-4 py-6">
				<div className="flex items-center justify-center gap-4 sm:gap-8">
					{/* Master */}
					<div className="flex flex-col items-center gap-2">
						<div className="relative">
							<Avatar className="h-14 w-14 ring-2 ring-yellow-500 sm:h-16 sm:w-16">
								{master.profileIconId && (
									<AvatarImage
										src={getProfileIcon(
											master.profileIconId
										)}
									/>
								)}
								<AvatarFallback>
									{master.displayName
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<Crown className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 text-yellow-500" />
						</div>
						<div className="text-center">
							<div className="text-sm font-semibold">
								{master.displayName}
							</div>
							<Badge
								className={cn(
									"mt-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
								)}
							>
								{UI_TEXTS.master}
							</Badge>
							<div className="text-muted-foreground mt-1 text-xs">
								{master.score} pts
							</div>
						</div>
					</div>

					{/* VS */}
					<div className="text-muted-foreground text-xl font-bold">
						vs
					</div>

					{/* Disaster */}
					<div className="flex flex-col items-center gap-2">
						<div className="relative">
							<Avatar className="h-14 w-14 ring-2 ring-red-500 sm:h-16 sm:w-16">
								{disaster.profileIconId && (
									<AvatarImage
										src={getProfileIcon(
											disaster.profileIconId
										)}
									/>
								)}
								<AvatarFallback>
									{disaster.displayName
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<Skull className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 text-red-500" />
						</div>
						<div className="text-center">
							<div className="text-sm font-semibold">
								{disaster.displayName}
							</div>
							<Badge
								className={cn(
									"mt-1 bg-red-500/20 text-red-600 dark:text-red-400"
								)}
							>
								{UI_TEXTS.disaster}
							</Badge>
							<div className="text-muted-foreground mt-1 text-xs">
								{disaster.score} pts
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
})
