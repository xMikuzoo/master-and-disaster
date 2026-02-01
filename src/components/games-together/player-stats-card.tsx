import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getChampionIcon, getProfileIcon } from "@/api/ddragon-cdn"
import type { Match } from "@/api/riotgames/types"
import type { Account } from "@/api/riotgames/types"
import type { PlayerConfig } from "@/config/players"
import type { ChampionStat, ChampionAggregation } from "@/types/champion-stats"
import { toChampionStat } from "@/types/champion-stats"
import { UI_TEXTS } from "@/constants/ui-texts"
import { useSummoner } from "@/api/riotgames/hooks"
import { AccountSelector } from "./account-selector"

interface PlayerStatsCardProps {
	playerConfig: PlayerConfig
	selectedAccountIndex: number
	onAccountChange: (index: number) => void
	accountData: Account | undefined
	matches: Match[]
	isLoadingAccount?: boolean
}

export const PlayerStatsCard = memo(function PlayerStatsCard({
	playerConfig,
	selectedAccountIndex,
	onAccountChange,
	accountData,
	matches,
	isLoadingAccount,
}: PlayerStatsCardProps) {
	const puuid = accountData?.puuid
	const { data: summoner } = useSummoner(puuid)

	const championStats = useMemo((): ChampionStat[] => {
		if (!puuid) return []

		const statsMap = new Map<number, ChampionAggregation>()

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
				})
			}
		}

		return Array.from(statsMap.values())
			.map(toChampionStat)
			.sort((a, b) => b.winRate - a.winRate)
			.slice(0, 3)
	}, [matches, puuid])

	if (isLoadingAccount) {
		return (
			<Card className="w-full">
				<CardHeader className="pb-2">
					<div className="flex items-center gap-3">
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3 w-32" />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Skeleton className="mb-2 h-3 w-20" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
					</div>
				</CardContent>
			</Card>
		)
	}

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
							{playerConfig.displayName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-1">
						<CardTitle>{playerConfig.displayName}</CardTitle>
						<AccountSelector
							accounts={playerConfig.accounts}
							selectedIndex={selectedAccountIndex}
							onSelect={onAccountChange}
						/>
					</div>
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
									{stat.avgKda.toFixed(1)} KDA
								</div>
							</div>
							<Badge
								variant={
									stat.winRate >= 50 ? "default" : "secondary"
								}
							>
								{stat.winRate.toFixed(0)}% WR
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
