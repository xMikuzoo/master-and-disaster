import { useState, useEffect } from "react"
import { useQueries } from "@tanstack/react-query"
import { getAccountByRiotId, riotQueryKeys } from "@/api/riotgames"
import { TRACKED_PLAYERS } from "@/config/players"
import { PlayerStatsCard, GamesTable, OverallStats } from "@/components/games-together"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { UI_TEXTS } from "@/constants/ui-texts"
import { useCommonMatches } from "@/hooks/useCommonMatches"

export function GamesTogetherPage() {
	const [showScrollTop, setShowScrollTop] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 300)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

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

	// Step 2: Fetch common matches using the custom hook
	const {
		commonMatches,
		isLoading: matchesLoading,
		isFetchingMore,
		hasMore,
		fetchMore,
	} = useCommonMatches({
		puuid1: account1?.puuid,
		puuid2: account2?.puuid,
	})

	const isLoading = accountsLoading || matchesLoading

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

			<div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
				{/* Player Stats Cards */}
				<div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
					{isLoading && commonMatches.length === 0 ? (
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
					{/* Overall Stats Summary */}
					{commonMatches.length > 0 && account1 && account2 && (
						<OverallStats
							matches={commonMatches}
							player1={account1}
							player2={account2}
						/>
					)}

					{isLoading && commonMatches.length === 0 ? (
						<div className="space-y-2">
							<Skeleton className="h-10 w-full" />
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : account1 && account2 ? (
						<>
							<GamesTable
								matches={commonMatches}
								puuid1={account1.puuid}
								puuid2={account2.puuid}
								isLoadingMore={isFetchingMore}
							/>

							{/* Load More Button */}
							{hasMore && (
								<div className="flex justify-center pt-4">
									<Button
										onClick={fetchMore}
										disabled={isFetchingMore}
										variant="outline"
									>
										{isFetchingMore
											? UI_TEXTS.loading
											: UI_TEXTS.loadMore}
									</Button>
								</div>
							)}
						</>
					) : null}
				</div>
			</div>

			{/* Scroll to top button */}
			{showScrollTop && (
				<Button
					onClick={scrollToTop}
					className="fixed bottom-6 right-6 z-50 rounded-full p-3"
					size="icon"
					variant="outline"
					aria-label={UI_TEXTS.scrollToTop}
				>
					<ChevronUp className="h-5 w-5" />
				</Button>
			)}
		</div>
	)
}
