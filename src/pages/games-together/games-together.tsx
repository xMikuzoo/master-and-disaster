import { useState, useEffect, useCallback } from "react"
import { useQueries } from "@tanstack/react-query"
import { getAccountByRiotId, riotQueryKeys } from "@/api/riotgames"
import { TRACKED_PLAYERS } from "@/config/players"
import { PlayerStatsCard, GamesTable } from "@/components/games-together"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { UI_TEXTS } from "@/constants/ui-texts"
import { useCommonMatches } from "@/hooks/useCommonMatches"

export function GamesTogetherPage() {
	const [showScrollTop, setShowScrollTop] = useState(false)
	const [selectedAccounts, setSelectedAccounts] = useState<
		Record<string, number>
	>(() => Object.fromEntries(TRACKED_PLAYERS.map((player) => [player.id, 0])))

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

	const handleAccountChange = useCallback(
		(playerId: string, index: number) => {
			setSelectedAccounts((prev) => ({
				...prev,
				[playerId]: index,
			}))
		},
		[]
	)

	// Step 1: Fetch accounts based on selected indices
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
		<div>
			<div className="grid gap-6 lg:grid-cols-[300px_1fr]">
				{/* Player Stats Cards */}
				<div className="space-y-4 px-1 lg:sticky lg:top-20 lg:self-start">
					{TRACKED_PLAYERS.map((player, index) => (
						<PlayerStatsCard
							key={player.id}
							playerConfig={player}
							selectedAccountIndex={
								selectedAccounts[player.id] ?? 0
							}
							onAccountChange={(idx) =>
								handleAccountChange(player.id, idx)
							}
							accountData={accountsQueries[index]?.data}
							matches={commonMatches}
							isLoadingAccount={accountsQueries[index]?.isLoading}
						/>
					))}
				</div>

				{/* Games Table */}
				<div className="flex flex-col p-1">
					{/* Table container */}
					<div className="space-y-2">
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
			</div>

			{/* Scroll to top button */}
			{showScrollTop && (
				<Button
					onClick={scrollToTop}
					className="fixed right-6 bottom-6 z-50 rounded-full p-3"
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
