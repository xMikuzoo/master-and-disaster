import { getAccountByRiotId } from "@/api/riotgames"
import { useQueries } from "@tanstack/react-query"
import { SummonerProfile } from "@/components/summoner-profile"

const RUN_QUERIES = true

export function HomePage() {
	type PlayerInfo = {
		gameName: string
		tagLine: string
	}
	const players: PlayerInfo[] = [
		{ gameName: "cinosBBC", tagLine: "EUNE" },
		{ gameName: "Łowca dziekanów", tagLine: "EUNE" },
	]

	function SummonerProfiles() {
		const accountsQueries = useQueries({
			queries: players.map((account) => ({
				queryKey: ["summonerProfile", account],
				queryFn: () =>
					getAccountByRiotId({
						gameName: account.gameName,
						tagLine: account.tagLine,
					}),
				enabled: RUN_QUERIES,
			})),
		})

		return (
			<div className="space-y-4">
				{accountsQueries.map(
					(accountQuery) =>
						!!accountQuery.data?.data && (
							<SummonerProfile
								key={accountQuery.data?.data.puuid}
								{...accountQuery.data?.data}
							/>
						)
				)}
			</div>
		)
	}

	// const {
	// 	data: matchList,
	// 	error: matchListError,
	// 	isLoading: matchListIsLoading,
	// } = useQuery({
	// 	queryKey: ["matchList", cinosPUUID],
	// 	queryFn: () =>
	// 		getMatchListByPUUID({
	// 			params: { puuid: cinosPUUID! },
	// 			query: { count: 3 },
	// 		}),
	// 	select: (data) => data?.data,
	// 	enabled: !!cinosPUUID,
	// })

	// const matches = useQueries({
	// 	queries: (matchList ?? []).map((matchId) => ({
	// 		queryKey: ["match", matchId],
	// 		queryFn: () =>
	// 			getMatchById({
	// 				matchId: matchId,
	// 			}),
	// 		enabled: !!matchList,
	// 	})),
	// })
	return (
		<>
			<SummonerProfiles />

			{/*
			<div className="mt-6">
				{matchListIsLoading && <div>Loading Match List...</div>}
				{matchListError && (
					<div>Error: {(matchListError as Error).message}</div>
				)}
				{!!matchList && (
					<div>
						<h2 className="mb-4 text-lg font-semibold">
							Recent Matches
						</h2>
						<div className="space-y-4">
							{matches.map((match, index) => {
								if (match.isPending)
									return (
										<div key={index}>Loading match...</div>
									)
								if (match.error)
									return (
										<div key={index}>
											Error:{" "}
											{(match.error as Error).message}
										</div>
									)

								const matchData = match.data?.data
								if (!matchData?.info) return null

								const info = matchData.info
								const gameDurationMinutes = Math.floor(
									info.gameDuration / 60
								)
								const gameDurationSeconds =
									info.gameDuration % 60
								const gameDate = new Date(
									info.gameStartTimestamp
								).toLocaleString()

								return (
									<div
										key={index}
										className="rounded-lg border p-4"
									>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-sm text-gray-500">
													Game Mode
												</p>
												<p className="font-semibold">
													{info.gameMode}
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">
													Duration
												</p>
												<p className="font-semibold">
													{gameDurationMinutes}m{" "}
													{gameDurationSeconds}s
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">
													Date
												</p>
												<p className="text-sm">
													{gameDate}
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">
													Queue ID
												</p>
												<p className="font-semibold">
													{info.queueId}
												</p>
											</div>
										</div>
										<div className="mt-3 border-t pt-3">
											<p className="mb-2 text-sm text-gray-500">
												Teams
											</p>
											<div className="grid grid-cols-2 gap-2">
												{info.teams.map(
													(
														team: (typeof info.teams)[0]
													) => (
														<div
															key={team.teamId}
															className={`rounded p-2 text-center ${
																team.win
																	? "bg-green-100 text-green-800"
																	: "bg-red-100 text-red-800"
															}`}
														>
															<p className="font-semibold">
																Team{" "}
																{team.teamId}
															</p>
															<p className="text-sm">
																{team.win
																	? "Victory"
																	: "Defeat"}
															</p>
														</div>
													)
												)}
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div> */}
		</>
	)
}
