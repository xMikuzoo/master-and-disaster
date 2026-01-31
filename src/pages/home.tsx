import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { Link } from "react-router"
import { getAccountByRiotId, riotQueryKeys } from "@/api/riotgames"
import { TRACKED_PLAYERS } from "@/config/players"
import { useSummoner } from "@/api/riotgames/hooks"
import { usePlayerMatches } from "@/hooks/usePlayerMatches"
import { useSelectedAccounts } from "@/hooks/use-selected-accounts"
import { MasterDisasterBanner, PlayerDashboardCard } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { UI_TEXTS } from "@/constants/ui-texts"
import { RouterPath } from "@/types/enums"
import {
	calculateAggregatedStats,
	determineMasterDisaster,
} from "@/utils/dashboard-stats"

export function HomePage() {
	const { selectedAccounts, setSelectedAccount } = useSelectedAccounts()

	// Fetch accounts based on selected indices
	const accountsQueries = useQueries({
		queries: TRACKED_PLAYERS.map((player) => {
			const selectedIndex = selectedAccounts[player.id] ?? 0
			const account = player.accounts[selectedIndex]
			return {
				queryKey: riotQueryKeys.account(
					account.gameName,
					account.tagLine
				),
				queryFn: () =>
					getAccountByRiotId({
						gameName: account.gameName,
						tagLine: account.tagLine,
					}),
				select: (
					data: Awaited<ReturnType<typeof getAccountByRiotId>>
				) => data?.data,
			}
		}),
	})

	const account1 = accountsQueries[0]?.data
	const account2 = accountsQueries[1]?.data
	const accountsLoading = accountsQueries.some((q) => q.isLoading)

	// Fetch summoner data for profile icons
	const { data: summoner1 } = useSummoner(account1?.puuid)
	const { data: summoner2 } = useSummoner(account2?.puuid)

	// Fetch matches for each player
	const { matches: matches1, isLoading: isLoadingMatches1 } =
		usePlayerMatches({ puuid: account1?.puuid })
	const { matches: matches2, isLoading: isLoadingMatches2 } =
		usePlayerMatches({ puuid: account2?.puuid })

	// Calculate aggregated stats
	const stats1 = useMemo(() => {
		if (!account1?.puuid || matches1.length === 0) return null
		return calculateAggregatedStats(matches1, account1.puuid)
	}, [matches1, account1?.puuid])

	const stats2 = useMemo(() => {
		if (!account2?.puuid || matches2.length === 0) return null
		return calculateAggregatedStats(matches2, account2.puuid)
	}, [matches2, account2?.puuid])

	// Determine Master/Disaster
	const masterDisasterResult = useMemo(() => {
		if (!stats1 || !stats2 || !account1?.puuid || !account2?.puuid)
			return null
		return determineMasterDisaster(
			stats1,
			stats2,
			account1.puuid,
			account2.puuid
		)
	}, [stats1, stats2, account1?.puuid, account2?.puuid])

	const isLoadingBanner = accountsLoading || isLoadingMatches1 || isLoadingMatches2

	// Prepare banner data
	const player1Info = {
		displayName: TRACKED_PLAYERS[0].displayName,
		profileIconId: summoner1?.profileIconId,
		isMaster: masterDisasterResult?.masterPuuid === account1?.puuid,
		score: stats1?.overallPerformanceScore ?? 0,
	}

	const player2Info = {
		displayName: TRACKED_PLAYERS[1].displayName,
		profileIconId: summoner2?.profileIconId,
		isMaster: masterDisasterResult?.masterPuuid === account2?.puuid,
		score: stats2?.overallPerformanceScore ?? 0,
	}

	return (
		<div className="space-y-6">
			{/* Header with title and CTA */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Master and Disaster</h1>
				<Button asChild variant="outline">
					<Link to={RouterPath.GAMES_TOGETHER}>
						{UI_TEXTS.viewGamesTogether}
					</Link>
				</Button>
			</div>

			{/* Master vs Disaster Banner */}
			<MasterDisasterBanner
				player1={player1Info}
				player2={player2Info}
				isLoading={isLoadingBanner || !masterDisasterResult}
			/>

			{/* Player Dashboard Cards */}
			<div className="grid gap-6 lg:grid-cols-2">
				{TRACKED_PLAYERS.map((player, index) => {
					const account = accountsQueries[index]?.data
					const matches = index === 0 ? matches1 : matches2
					const isLoadingMatches =
						index === 0 ? isLoadingMatches1 : isLoadingMatches2

					return (
						<PlayerDashboardCard
							key={player.id}
							playerConfig={player}
							selectedAccountIndex={
								selectedAccounts[player.id] ?? 0
							}
							onAccountChange={(idx) =>
								setSelectedAccount(player.id, idx)
							}
							puuid={account?.puuid}
							matches={matches}
							isLoadingAccount={accountsQueries[index]?.isLoading}
							isLoadingMatches={isLoadingMatches}
						/>
					)
				})}
			</div>
		</div>
	)
}
