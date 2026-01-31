import type { InfoDto, MetadataDto } from "./match.types"

export interface Account {
	puuid: string
	gameName: string
	tagLine: string
}

export interface GetAccountPathParams {
	tagLine: string
	gameName: string
}

export interface Summoner {
	puuid: string
	profileIconId: number
	revisionDate: number
	summonerLevel: number
}

export interface GetSummonerPathParams {
	puuid: string
}

export interface GetMatchListParams {
	puuid: string
}
export interface GetMatchListQueryParams {
	startTime?: number
	endTime?: number
	queue?: number
	type?: string
	start?: number
	count?: number
}

export interface GetMatchListRequest {
	params: GetMatchListParams
	query?: GetMatchListQueryParams
}

export type MatchList = string[]

export interface GetMatchRequest {
	matchId: string
}

export interface Match {
	metadata: MetadataDto
	info: InfoDto
}

export interface MiniSeries {
	losses: number
	progress: string
	target: number
	wins: number
}

export interface LeagueEntry {
	leagueId: string
	puuid: string
	queueType: string
	tier: string
	rank: string
	leaguePoints: number
	wins: number
	losses: number
	hotStreak: boolean
	veteran: boolean
	freshBlood: boolean
	inactive: boolean
	miniSeries?: MiniSeries
}

export interface GetLeagueEntryRequest {
	puuid: string
}

export interface ChampionMastery {
	championId: number
	championLevel: number
	championPoints: number
	lastPlayTime: number
	championPointsSinceLastLevel: number
	championPointsUntilNextLevel: number
}

export interface GetChampionMasteryTopRequest {
	puuid: string
	count?: number
}
