import { memo, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getProfileIcon } from "@/api/ddragon-cdn"
import type { Match, LeagueEntry } from "@/api/riotgames/types"
import type { PlayerConfig } from "@/config/players"
import { useSummoner, useLeagueEntry } from "@/api/riotgames/hooks"
import { AccountSelector } from "@/components/games-together/account-selector"
import { StatsGrid } from "./stats-grid"
import { ChampionStats } from "./champion-stats"
import { RankDisplay } from "./rank-display"
import { calculateAggregatedStats } from "@/utils/dashboard-stats"
import { Separator } from "@/components/ui/separator"

interface PlayerDashboardCardProps {
	playerConfig: PlayerConfig
	selectedAccountIndex: number
	onAccountChange: (index: number) => void
	puuid: string | undefined
	matches: Match[]
	isLoadingAccount?: boolean
	isLoadingMatches?: boolean
}

export const PlayerDashboardCard = memo(function PlayerDashboardCard({
	playerConfig,
	selectedAccountIndex,
	onAccountChange,
	puuid,
	matches,
	isLoadingAccount,
	isLoadingMatches,
}: PlayerDashboardCardProps) {
	const { data: summoner, isLoading: isLoadingSummoner } = useSummoner(puuid)
	const { data: leagueEntries, isLoading: isLoadingLeague } =
		useLeagueEntry(puuid ?? "", !!puuid)

	const rankedEntry = useMemo(() => {
		if (!leagueEntries) return undefined
		return leagueEntries.find(
			(entry: LeagueEntry) =>
				entry.queueType === "RANKED_SOLO_5x5"
		)
	}, [leagueEntries])

	const stats = useMemo(() => {
		if (!puuid || matches.length === 0) return null
		return calculateAggregatedStats(matches, puuid)
	}, [matches, puuid])

	const isLoading = isLoadingAccount || isLoadingSummoner

	if (isLoading) {
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
				<CardContent className="space-y-4">
					<Skeleton className="h-5 w-24" />
					<div className="grid grid-cols-3 gap-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-20" />
						))}
					</div>
					<Skeleton className="h-24 w-full" />
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
			<CardContent className="space-y-4">
				{/* Rank Display */}
				<RankDisplay
					leagueEntry={rankedEntry}
					isLoading={isLoadingLeague}
				/>

				<Separator />

				{/* Stats Grid */}
				{isLoadingMatches ? (
					<div className="grid grid-cols-3 gap-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-20" />
						))}
					</div>
				) : stats ? (
					<StatsGrid
						winRate={stats.winRate}
						avgKDA={stats.avgKDA}
						avgKills={stats.avgKills}
						avgDeaths={stats.avgDeaths}
						avgAssists={stats.avgAssists}
						avgCSPerMin={stats.avgCSPerMin}
						avgDamagePerMin={stats.avgDamagePerMin}
						avgVisionPerMin={stats.avgVisionPerMin}
						avgGoldPerMin={stats.avgGoldPerMin}
					/>
				) : (
					<div className="text-muted-foreground text-center text-sm">
						Brak danych z ostatnich gier
					</div>
				)}

				<Separator />

				{/* Champion Stats */}
				{isLoadingMatches ? (
					<div className="space-y-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-10" />
						))}
					</div>
				) : stats ? (
					<ChampionStats champions={stats.topChampions} />
				) : null}
			</CardContent>
		</Card>
	)
})
