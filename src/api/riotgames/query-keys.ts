export const riotQueryKeys = {
	all: ["riot"] as const,
	accounts: () => [...riotQueryKeys.all, "accounts"] as const,
	account: (gameName: string, tagLine: string) =>
		[...riotQueryKeys.accounts(), gameName, tagLine] as const,
	summoners: () => [...riotQueryKeys.all, "summoners"] as const,
	summoner: (puuid: string) => [...riotQueryKeys.summoners(), puuid] as const,
	leagues: () => [...riotQueryKeys.all, "leagues"] as const,
	leagueEntry: (puuid: string) =>
		[...riotQueryKeys.leagues(), puuid] as const,
	matches: () => [...riotQueryKeys.all, "matches"] as const,
	matchList: (puuid: string) =>
		[...riotQueryKeys.matches(), "list", puuid] as const,
	matchListRanked: (puuid: string) =>
		[...riotQueryKeys.matches(), "list", "ranked", puuid] as const,
	matchDetails: (matchId: string) =>
		[...riotQueryKeys.matches(), "details", matchId] as const,
	commonMatches: (puuid1: string, puuid2: string) =>
		[...riotQueryKeys.matches(), "common", puuid1, puuid2] as const,
	championMastery: () => [...riotQueryKeys.all, "champion-mastery"] as const,
	championMasteryTop: (puuid: string, count?: number) =>
		[...riotQueryKeys.championMastery(), "top", puuid, count] as const,
}
