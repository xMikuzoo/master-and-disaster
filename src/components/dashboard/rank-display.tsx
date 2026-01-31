import { memo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { LeagueEntry } from "@/api/riotgames/types"
import { UI_TEXTS } from "@/constants/ui-texts"

interface RankDisplayProps {
	leagueEntry: LeagueEntry | undefined
	isLoading?: boolean
}

const TIER_COLORS: Record<string, string> = {
	IRON: "text-gray-400",
	BRONZE: "text-amber-700",
	SILVER: "text-gray-300",
	GOLD: "text-yellow-500",
	PLATINUM: "text-cyan-400",
	EMERALD: "text-emerald-500",
	DIAMOND: "text-blue-400",
	MASTER: "text-purple-500",
	GRANDMASTER: "text-red-500",
	CHALLENGER: "text-cyan-300",
}

export const RankDisplay = memo(function RankDisplay({
	leagueEntry,
	isLoading,
}: RankDisplayProps) {
	if (isLoading) {
		return (
			<div className="space-y-1">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-3 w-20" />
			</div>
		)
	}

	if (!leagueEntry) {
		return (
			<div className="text-muted-foreground text-sm">
				Unranked
			</div>
		)
	}

	const tierColor = TIER_COLORS[leagueEntry.tier] || "text-foreground"

	return (
		<div>
			<div className={`text-sm font-bold ${tierColor}`}>
				{leagueEntry.tier} {leagueEntry.rank} · {leagueEntry.leaguePoints} LP
			</div>
			<div className="text-muted-foreground text-xs">
				{UI_TEXTS.wins}: {leagueEntry.wins} | {UI_TEXTS.losses}: {leagueEntry.losses}
			</div>
		</div>
	)
})
