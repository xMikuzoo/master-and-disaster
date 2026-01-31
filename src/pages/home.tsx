import { getAccountByRiotId, riotQueryKeys } from "@/api/riotgames"
import { useQueries } from "@tanstack/react-query"
import { SummonerProfile } from "@/components/summoner-profile"
import { TRACKED_PLAYERS } from "@/config/players"

const RUN_QUERIES = true

export function HomePage() {
	// Flatten all accounts from all players for the home page
	const allAccounts = TRACKED_PLAYERS.flatMap((player) => player.accounts)

	const accountsQueries = useQueries({
		queries: allAccounts.map((account) => ({
			queryKey: riotQueryKeys.account(account.gameName, account.tagLine),
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
