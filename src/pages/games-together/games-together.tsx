import { useMemo } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"
import {
	getAccountByRiotId,
	getMatchById,
	getMatchListByPUUID,
	riotQueryKeys,
} from "@/api/riotgames"
import type { Match } from "@/api/riotgames/types"
import { TRACKED_PLAYERS } from "@/config/players"
import { PlayerStatsCard, GamesTable } from "@/components/games-together"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { UI_TEXTS } from "@/constants/ui-texts"

export function GamesTogetherPage() {
	// Step 1: Fetch both accounts
	const accountsQueries = useQueries({
		queries: TRACKED_PLAYERS.map((player) => ({
			queryKey: riotQueryKeys.account(player.gameName, player.tagLine),
			queryFn: () =>
				getAccountByRiotId({
					gameName: player.gameName,
					tagLine: player.tagLine,
				}),
			select: (data: Awaited<ReturnType<typeof getAccountByRiotId>>) =>
				data?.data,
		})),
	})

	const account1 = accountsQueries[0]?.data
	const account2 = accountsQueries[1]?.data
	const accountsLoading = accountsQueries.some((q) => q.isLoading)
	const accountsError = accountsQueries.find((q) => q.error)?.error

	// Step 2: Fetch match list for player 1 (ranked games only)
	const matchListQuery = useQuery({
		queryKey: riotQueryKeys.matchListRanked(account1?.puuid ?? ""),
		queryFn: () =>
			getMatchListByPUUID({
				params: { puuid: account1!.puuid },
				query: { count: 20, type: "ranked" },
			}),
		select: (data) => data?.data,
		enabled: !!account1?.puuid,
	})

	const matchList = matchListQuery.data ?? []

	// Step 3: Fetch details for all matches
	const matchDetailsQueries = useQueries({
		queries: matchList.map((matchId) => ({
			queryKey: riotQueryKeys.matchDetails(matchId),
			queryFn: () => getMatchById({ matchId }),
			select: (data: Awaited<ReturnType<typeof getMatchById>>) =>
				data?.data,
			enabled: matchList.length > 0,
		})),
	})

	const matchDetailsLoading = matchDetailsQueries.some((q) => q.isLoading)

	// Step 4: Filter to find common matches (both players participated)
	const commonMatches = useMemo(() => {
		if (!account1?.puuid || !account2?.puuid) return []

		return matchDetailsQueries
			.map((q) => q.data)
			.filter((match): match is Match => {
				if (!match) return false
				const participants = match.metadata.participants
				return (
					participants.includes(account1.puuid) &&
					participants.includes(account2.puuid)
				)
			})
	}, [matchDetailsQueries, account1?.puuid, account2?.puuid])

	const isLoading = accountsLoading || matchListQuery.isLoading || matchDetailsLoading

	const winsLosses = useMemo(() => {
		if (!account1?.puuid) return { wins: 0, losses: 0 }

		const wins = commonMatches.filter((m) =>
			m.info.participants.find((p) => p.puuid === account1.puuid && p.win)
		).length

		return { wins, losses: commonMatches.length - wins }
	}, [commonMatches, account1?.puuid])

	if (accountsError) {
		return (
			<div className="text-destructive p-4">
				{UI_TEXTS.networkError}: {accountsError.message}
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">{UI_TEXTS.commonGames}</h1>

			<div className="grid gap-6 lg:grid-cols-[300px_1fr]">
				{/* Player Stats Cards */}
				<div className="space-y-4">
					{isLoading ? (
						<>
							<Skeleton className="h-48 w-full" />
							<Skeleton className="h-48 w-full" />
						</>
					) : (
						<>
							{account1 && (
								<PlayerStatsCard
									puuid={account1.puuid}
									gameName={account1.gameName}
									tagLine={account1.tagLine}
									matches={commonMatches}
								/>
							)}
							{account2 && (
								<PlayerStatsCard
									puuid={account2.puuid}
									gameName={account2.gameName}
									tagLine={account2.tagLine}
									matches={commonMatches}
								/>
							)}
						</>
					)}
				</div>

				{/* Games Table */}
				<div className="space-y-4">
					{/* Wins/Losses Summary */}
					{!isLoading && commonMatches.length > 0 && (
						<div className="flex items-center gap-3">
							<Badge variant="default" className="text-sm">
								{winsLosses.wins} {UI_TEXTS.wins}
							</Badge>
							<Badge variant="destructive" className="text-sm">
								{winsLosses.losses} {UI_TEXTS.losses}
							</Badge>
						</div>
					)}

					{isLoading ? (
						<div className="space-y-2">
							<Skeleton className="h-10 w-full" />
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : account1 && account2 ? (
						<GamesTable
							matches={commonMatches}
							puuid1={account1.puuid}
							puuid2={account2.puuid}
						/>
					) : null}
				</div>
			</div>
		</div>
	)
}
