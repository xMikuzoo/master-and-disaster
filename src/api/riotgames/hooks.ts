import { useQueries, useQuery } from "@tanstack/react-query"
import {
	getAccountByRiotId,
	getSummonerByPUUID,
	getLeagueEntryByPUUID,
	getMatchListByPUUID,
	getMatchById,
} from "./index"
import { riotQueryKeys } from "./query-keys"
import type { GetAccountPathParams, GetMatchListQueryParams } from "./types"

export function useAccount(params: GetAccountPathParams, enabled = true) {
	return useQuery({
		queryKey: riotQueryKeys.account(params.gameName, params.tagLine),
		queryFn: () => getAccountByRiotId(params),
		select: (data) => data?.data,
		enabled,
	})
}

export function useSummoner(puuid: string, enabled = true) {
	return useQuery({
		queryKey: riotQueryKeys.summoner(puuid),
		queryFn: () => getSummonerByPUUID({ puuid }),
		select: (data) => data?.data,
		enabled: enabled && !!puuid,
	})
}

export function useLeagueEntry(puuid: string, enabled = true) {
	return useQuery({
		queryKey: riotQueryKeys.leagueEntry(puuid),
		queryFn: () => getLeagueEntryByPUUID({ puuid }),
		select: (data) => data?.data,
		enabled: enabled && !!puuid,
	})
}

export function useMatchList(
	puuid: string,
	query?: GetMatchListQueryParams,
	enabled = true
) {
	return useQuery({
		queryKey: riotQueryKeys.matchList(puuid),
		queryFn: () => getMatchListByPUUID({ params: { puuid }, query }),
		select: (data) => data?.data,
		enabled: enabled && !!puuid,
	})
}

export function useMatchDetails(matchIds: string[], enabled = true) {
	return useQueries({
		queries: matchIds.map((matchId) => ({
			queryKey: riotQueryKeys.matchDetails(matchId),
			queryFn: () => getMatchById({ matchId }),
			select: (data: Awaited<ReturnType<typeof getMatchById>>) =>
				data?.data,
			enabled: enabled && matchIds.length > 0,
		})),
	})
}
