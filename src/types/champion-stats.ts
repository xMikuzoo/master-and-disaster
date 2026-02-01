/**
 * Unified champion statistics type used across the application
 */
export interface ChampionStat {
	championId: number
	championName: string
	gamesPlayed: number
	wins: number
	kills: number
	deaths: number
	assists: number
	/** Win rate as percentage (0-100) */
	winRate: number
	/** Average KDA ratio */
	avgKda: number
}

/**
 * Raw champion aggregation data before calculating derived stats
 */
export interface ChampionAggregation {
	championId: number
	championName: string
	gamesPlayed: number
	wins: number
	kills: number
	deaths: number
	assists: number
}

/**
 * Converts raw aggregation data to ChampionStat with calculated derived values
 */
export function toChampionStat(agg: ChampionAggregation): ChampionStat {
	return {
		...agg,
		winRate: (agg.wins / agg.gamesPlayed) * 100,
		avgKda: (agg.kills + agg.assists) / Math.max(agg.deaths, 1),
	}
}
