import type {
	LeagueEntry,
	GetLeagueEntryRequest,
	ChampionMastery,
	GetChampionMasteryTopRequest,
} from "./types/index"
import { axiosRequest } from "@/hooks/use-axios"
import type {
	Account,
	GetAccountPathParams,
	Summoner,
	GetSummonerPathParams,
	GetMatchListRequest,
	MatchList,
	Match,
	GetMatchRequest,
} from "./types"
import {
	type Region,
	DEFAULT_ACCOUNT_REGION,
	DEFAULT_PLATFORM_REGION,
} from "./config"

export const getAccountByRiotId = async (
	pathParams: GetAccountPathParams,
	region: Region = DEFAULT_ACCOUNT_REGION
) => {
	return await axiosRequest<Account>({
		url: `api/riotgames/${region}/riot/account/v1/accounts/by-riot-id/${pathParams.gameName}/${pathParams.tagLine}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch account data from Riot API",
	})
}

export const getSummonerByPUUID = async (
	pathParams: GetSummonerPathParams,
	region: Region = DEFAULT_PLATFORM_REGION
) => {
	return await axiosRequest<Summoner>({
		url: `api/riotgames/${region}/lol/summoner/v4/summoners/by-puuid/${pathParams.puuid}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch summoner data from Riot API",
	})
}

export const getMatchListByPUUID = async (
	request: GetMatchListRequest,
	region: Region = DEFAULT_ACCOUNT_REGION
) => {
	const params = new URLSearchParams({})
	if (request.query?.startTime) {
		params.append("startTime", request.query.startTime.toString())
	}
	if (request.query?.endTime) {
		params.append("endTime", request.query.endTime.toString())
	}
	if (request.query?.queue) {
		params.append("queue", request.query.queue.toString())
	}
	if (request.query?.type) {
		params.append("type", request.query.type)
	}
	params.append("start", (request.query?.start ?? 0).toString())
	params.append("count", (request.query?.count ?? 20).toString())

	return await axiosRequest<MatchList>({
		url: `api/riotgames/${region}/lol/match/v5/matches/by-puuid/${request.params.puuid}/ids`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch match list from Riot API",
		params: params,
	})
}

export const getMatchById = async (
	request: GetMatchRequest,
	region: Region = DEFAULT_ACCOUNT_REGION
) => {
	return await axiosRequest<Match>({
		url: `api/riotgames/${region}/lol/match/v5/matches/${request.matchId}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch match data from Riot API",
	})
}

export const getLeagueEntryByPUUID = async (
	request: GetLeagueEntryRequest,
	region: Region = DEFAULT_PLATFORM_REGION
) => {
	return await axiosRequest<LeagueEntry[]>({
		url: `api/riotgames/${region}/lol/league/v4/entries/by-puuid/${request.puuid}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch league entry data from Riot API",
	})
}

export const getChampionMasteryTop = async (
	request: GetChampionMasteryTopRequest,
	region: Region = DEFAULT_PLATFORM_REGION
) => {
	const params = new URLSearchParams()
	if (request.count) {
		params.append("count", request.count.toString())
	}

	return await axiosRequest<ChampionMastery[]>({
		url: `api/riotgames/${region}/lol/champion-mastery/v4/champion-masteries/by-puuid/${request.puuid}/top`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch champion mastery data from Riot API",
		params,
	})
}

export { riotQueryKeys } from "./query-keys"
export { REGIONS, DEFAULT_ACCOUNT_REGION, DEFAULT_PLATFORM_REGION } from "./config"
export type { Region } from "./config"
