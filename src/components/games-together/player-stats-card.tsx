import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getChampionIcon, getProfileIcon } from "@/api/ddragon-cdn"
import type { Match } from "@/api/riotgames/types"
import { UI_TEXTS } from "@/constants/ui-texts"
import { useSummoner } from "@/api/riotgames/hooks"

interface PlayerStatsCardProps {
	puuid: string
	gameName: string
	tagLine: string
	matches: Match[]
}

interface ChampionStat {
	championId: number
	championName: string
	gamesPlayed: number
	wins: number
	kills: number
	deaths: number
	assists: number
	winrate: number
	kda: number
}

export const PlayerStatsCard = memo(function PlayerStatsCard({
	puuid,
	gameName,
	tagLine,
	matches,
}: PlayerStatsCardProps) {
	const { data: summoner } = useSummoner(puuid)

	const championStats = useMemo(() => {
		const statsMap = new Map<number, ChampionStat>()

		for (const match of matches) {
			const participant = match.info.participants.find(
				(p) => p.puuid === puuid
			)
			if (!participant) continue

			const existing = statsMap.get(participant.championId)
			if (existing) {
				existing.gamesPlayed++
				existing.wins += participant.win ? 1 : 0
				existing.kills += participant.kills
				existing.deaths += participant.deaths
				existing.assists += participant.assists
			} else {
				statsMap.set(participant.championId, {
					championId: participant.championId,
					championName: participant.championName,
					gamesPlayed: 1,
					wins: participant.win ? 1 : 0,
					kills: participant.kills,
					deaths: participant.deaths,
					assists: participant.assists,
					winrate: 0,
					kda: 0,
				})
			}
		}

		const stats = Array.from(statsMap.values())
		for (const stat of stats) {
			stat.winrate = (stat.wins / stat.gamesPlayed) * 100
			stat.kda =
				(stat.kills + stat.assists) / Math.max(stat.deaths, 1)
		}

		return stats.sort((a, b) => b.winrate - a.winrate).slice(0, 3)
	}, [matches, puuid])

	return (
		<Card className="w-full">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-3">
					<Avatar size="lg">
						{summoner?.profileIconId && (
							<AvatarImage
								src={getProfileIcon(summoner.profileIconId)}
							/>
						)}
						<AvatarFallback>
							{gameName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<CardTitle>
						{gameName}#{tagLine}
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-muted-foreground mb-2 text-xs font-medium">
					{UI_TEXTS.topChampions}
				</div>
				<div className="space-y-2">
					{championStats.map((stat) => (
						<div
							key={stat.championId}
							className="flex items-center gap-2"
						>
							<img
								src={getChampionIcon(stat.championName)}
								alt={stat.championName}
								className="h-8 w-8 rounded"
							/>
							<div className="flex-1">
								<div className="text-xs font-medium">
									{stat.championName}
								</div>
								<div className="text-muted-foreground text-xs">
									{stat.gamesPlayed} {UI_TEXTS.games} •{" "}
									{stat.kda.toFixed(1)} KDA
								</div>
							</div>
							<Badge
								variant={
									stat.winrate >= 50 ? "default" : "secondary"
								}
							>
								{stat.winrate.toFixed(0)}% WR
							</Badge>
						</div>
					))}
					{championStats.length === 0 && (
						<div className="text-muted-foreground text-xs">
							{UI_TEXTS.noCommonGames}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
})
