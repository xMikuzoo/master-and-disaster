import { getProfileIcon } from "@/api/ddragon-cdn"
import {
	getAccountByRiotId,
	getLeagueEntryByPUUID,
	getMatchById,
	getMatchListByPUUID,
	getSummonerByPUUID,
} from "@/api/riotgames"
import { Button } from "@/components/ui/button"
import { useQueries, useQuery } from "@tanstack/react-query"
export function HomePage() {
	const { data, error, isPending, isLoading, refetch } = useQuery({
		queryKey: ["riotAccount", "someTagLine", "someGameName"],
		queryFn: () =>
			getAccountByRiotId({ gameName: "cinosBBC", tagLine: "eune" }),
		select: (data) => data?.data,
		enabled: false,
	})

	const {
		data: profile,
		error: profileError,
		isLoading: profileIsLoading,
	} = useQuery({
		queryKey: ["riotAccount", "anotherTagLine", "anotherGameName"],
		queryFn: () =>
			getSummonerByPUUID({
				puuid: data?.puuid!,
			}),
		select: (data) => data?.data,
		enabled: !!data?.puuid,
	})

	const {
		data: matchList,
		error: matchListError,
		isLoading: matchListIsLoading,
	} = useQuery({
		queryKey: ["matchList", data?.puuid],
		queryFn: () =>
			getMatchListByPUUID({
				params: { puuid: data?.puuid! },
				query: { count: 3 },
			}),
		select: (data) => data?.data,
		enabled: !!data?.puuid,
	})

	const {
		data: leagueEntry,
		error: leagueEntryError,
		isLoading: leagueEntryIsLoading,
	} = useQuery({
		queryKey: ["leagueEntry", profile?.puuid],
		queryFn: () =>
			getLeagueEntryByPUUID({
				puuid: data!.puuid,
			}),
		select: (data) => data?.data,
		enabled: !!profile?.puuid,
	})

	const matches = useQueries({
		queries: (matchList ?? []).map((matchId) => ({
			queryKey: ["match", matchId],
			queryFn: () =>
				getMatchById({
					matchId: matchId,
				}),
			enabled: !!matchList,
		})),
	})

	return (
		<>
			<div>Welcome to the Home Page</div>
			<Button onClick={() => refetch()}>trigger api</Button>
			<div className="">
				{isLoading
					? isPending && <div>Loading Riot Account...</div>
					: null}
				{error && <div>Error: {(error as Error).message}</div>}
				{!!data && <div>Riot Account Data: {JSON.stringify(data)}</div>}
			</div>

			<div className="">
				{profileIsLoading && <div>Loading Summoner Profile...</div>}
				{profileError && (
					<div>Error: {(profileError as Error).message}</div>
				)}
				{!!profile && (
					<div className="mt-4">
						<h2 className="mb-2 text-lg font-semibold">
							Summoner Profile
						</h2>
						<div className="space-y-2">
							<p>
								<strong>Summoner Level:</strong>{" "}
								{profile.summonerLevel}
							</p>
							<p>
								<strong>Profile Icon ID:</strong>{" "}
								{profile.profileIconId}
								<img
									src={getProfileIcon(profile.profileIconId)}
									alt="Profile Icon"
								/>
							</p>
							<div className="">
								<strong>League Entry:</strong>{" "}
								{leagueEntryIsLoading && (
									<span>Loading League Entry...</span>
								)}
								{leagueEntryError && (
									<span>
										Error:{" "}
										{(leagueEntryError as Error).message}
									</span>
								)}
								{leagueEntry && (
									<span>
										{leagueEntry.length === 0
											? "Unranked"
											: leagueEntry
													.map(
														(entry) =>
															`${entry.tier} ${entry.rank} - ${entry.leaguePoints} LP`
													)
													.join(", ")}
									</span>
								)}
							</div>
							<p>
								<strong>Revision Date:</strong>{" "}
								{new Date(
									profile.revisionDate
								).toLocaleString()}
							</p>
						</div>
					</div>
				)}
			</div>
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
			</div>
		</>
	)
}
