import type { LeagueEntry, GetLeagueEntryRequest } from "./types/index"
import { axiosRequest } from "@/hooks/useAxios"
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

export const getAccountByRiotId = async (pathParams: GetAccountPathParams) => {
	return await axiosRequest<Account>({
		url: `api/riotgames/europe/riot/account/v1/accounts/by-riot-id/${pathParams.gameName}/${pathParams.tagLine}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch account data from Riot API",
	})
}

export const getSummonerByPUUID = async (pathParams: GetSummonerPathParams) => {
	return await axiosRequest<Summoner>({
		url: `api/riotgames/eun1/lol/summoner/v4/summoners/by-puuid/${pathParams.puuid}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch account data from Riot API",
	})
}

export const getMatchListByPUUID = async (request: GetMatchListRequest) => {
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
		url: `api/riotgames/europe/lol/match/v5/matches/by-puuid/${request.params.puuid}/ids`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch match list from Riot API",
		params: params,
	})
}

export const getMatchById = async (request: GetMatchRequest) => {
	return await axiosRequest<Match>({
		url: `api/riotgames/europe/lol/match/v5/matches/${request.matchId}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch match data from Riot API",
	})
}

export const getLeagueEntryByPUUID = async (request: GetLeagueEntryRequest) => {
	return await axiosRequest<LeagueEntry[]>({
		url: `api/riotgames/eun1/lol/league/v4/entries/by-puuid/${request.puuid}`,
		method: "GET",
		defaultErrorMessage: "Failed to fetch league entry data from Riot API",
	})
}
