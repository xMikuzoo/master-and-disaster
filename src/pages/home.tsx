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

	function SummonerProfiles() {
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
	return (
		<>
			<SummonerProfiles />
		</>
	)
}
