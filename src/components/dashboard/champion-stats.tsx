import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { getChampionIcon } from "@/api/ddragon-cdn"
import type { ChampionStat } from "@/utils/dashboard-stats"
import { UI_TEXTS } from "@/constants/ui-texts"

interface ChampionStatsProps {
	champions: ChampionStat[]
}

export const ChampionStats = memo(function ChampionStats({
	champions,
}: ChampionStatsProps) {
	if (champions.length === 0) {
		return (
			<div className="text-muted-foreground text-center text-xs">
				{UI_TEXTS.noCommonGames}
			</div>
		)
	}

	return (
		<div className="space-y-2">
			<div className="text-muted-foreground text-xs font-medium">
				{UI_TEXTS.topChampions}
			</div>
			{champions.map((champion) => (
				<div
					key={champion.championId}
					className="flex items-center gap-2"
				>
					<img
						src={getChampionIcon(champion.championName)}
						alt={champion.championName}
						className="h-8 w-8 rounded"
					/>
					<div className="flex-1">
						<div className="text-xs font-medium">
							{champion.championName}
						</div>
						<div className="text-muted-foreground text-xs">
							{champion.gamesPlayed} {UI_TEXTS.games} •{" "}
							{champion.avgKda.toFixed(1)} KDA
						</div>
					</div>
					<Badge
						variant={
							champion.winRate >= 50 ? "default" : "secondary"
						}
					>
						{champion.winRate.toFixed(0)}% WR
					</Badge>
				</div>
			))}
		</div>
	)
})
