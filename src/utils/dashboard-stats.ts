import type { Match } from "@/api/riotgames/types"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"
import type { ChampionStat, ChampionAggregation } from "@/types/champion-stats"
import { toChampionStat } from "@/types/champion-stats"
import { SCORING_WEIGHTS, SCORING_THRESHOLDS } from "@/constants/scoring"

export type { ChampionStat }

export interface AggregatedPlayerStats {
	// Basic
	gamesPlayed: number
	wins: number
	losses: number
	winRate: number

	// KDA
	avgKills: number
	avgDeaths: number
	avgAssists: number
	avgKDA: number

	// Farming
	avgCSPerMin: number
	avgGoldPerMin: number

	// Damage
	avgDamageDealt: number
	avgDamagePerMin: number

	// Vision
	avgVisionScore: number
	avgVisionPerMin: number

	// Best champion
	bestChampion: ChampionStat | null

	// Top 3 champions
	topChampions: ChampionStat[]

	// Performance score for Master/Disaster
	overallPerformanceScore: number
}

export function calculateAggregatedStats(
	matches: Match[],
	puuid: string
): AggregatedPlayerStats {
	if (matches.length === 0) {
		return {
			gamesPlayed: 0,
			wins: 0,
			losses: 0,
			winRate: 0,
			avgKills: 0,
			avgDeaths: 0,
			avgAssists: 0,
			avgKDA: 0,
			avgCSPerMin: 0,
			avgGoldPerMin: 0,
			avgDamageDealt: 0,
			avgDamagePerMin: 0,
			avgVisionScore: 0,
			avgVisionPerMin: 0,
			bestChampion: null,
			topChampions: [],
			overallPerformanceScore: 0,
		}
	}

	const participants: ParticipantDto[] = []
	const championMap = new Map<number, ChampionAggregation>()

	let totalKills = 0
	let totalDeaths = 0
	let totalAssists = 0
	let totalCS = 0
	let totalGold = 0
	let totalDamage = 0
	let totalVision = 0
	let totalGameDuration = 0
	let wins = 0

	for (const match of matches) {
		const participant = match.info.participants.find(
			(p) => p.puuid === puuid
		)
		if (!participant) continue

		participants.push(participant)

		const gameDurationMinutes = match.info.gameDuration / 60

		totalKills += participant.kills
		totalDeaths += participant.deaths
		totalAssists += participant.assists
		totalCS +=
			participant.totalMinionsKilled + participant.neutralMinionsKilled
		totalGold += participant.goldEarned
		totalDamage += participant.totalDamageDealtToChampions
		totalVision += participant.visionScore
		totalGameDuration += gameDurationMinutes

		if (participant.win) wins++

		// Champion stats
		const existing = championMap.get(participant.championId)
		if (existing) {
			existing.gamesPlayed++
			existing.wins += participant.win ? 1 : 0
			existing.kills += participant.kills
			existing.deaths += participant.deaths
			existing.assists += participant.assists
		} else {
			championMap.set(participant.championId, {
				championId: participant.championId,
				championName: participant.championName,
				gamesPlayed: 1,
				wins: participant.win ? 1 : 0,
				kills: participant.kills,
				deaths: participant.deaths,
				assists: participant.assists,
			})
		}
	}

	const gamesPlayed = participants.length
	const losses = gamesPlayed - wins

	// Calculate averages
	const avgKills = totalKills / gamesPlayed
	const avgDeaths = totalDeaths / gamesPlayed
	const avgAssists = totalAssists / gamesPlayed
	const avgKDA = (totalKills + totalAssists) / Math.max(totalDeaths, 1)

	const avgCSPerMin = totalCS / totalGameDuration
	const avgGoldPerMin = totalGold / totalGameDuration
	const avgDamageDealt = totalDamage / gamesPlayed
	const avgDamagePerMin = totalDamage / totalGameDuration
	const avgVisionScore = totalVision / gamesPlayed
	const avgVisionPerMin = totalVision / totalGameDuration

	// Build champion stats using shared helper
	const championStats: ChampionStat[] = Array.from(championMap.values()).map(
		toChampionStat
	)

	// Sort by games played, then winrate
	championStats.sort((a, b) => {
		if (b.gamesPlayed !== a.gamesPlayed) {
			return b.gamesPlayed - a.gamesPlayed
		}
		return b.winRate - a.winRate
	})

	const topChampions = championStats.slice(0, 3)
	const bestChampion = topChampions[0] || null

	// Calculate overall performance score (0-100)
	// Weighted formula based on typical ranked performance metrics
	const winRateScore = (wins / gamesPlayed) * SCORING_WEIGHTS.WIN_RATE
	const kdaScore = Math.min(avgKDA / SCORING_THRESHOLDS.MAX_KDA, 1) * SCORING_WEIGHTS.KDA
	const csScore = Math.min(avgCSPerMin / SCORING_THRESHOLDS.MAX_CS_PER_MIN, 1) * SCORING_WEIGHTS.CS
	const damageScore = Math.min(avgDamagePerMin / SCORING_THRESHOLDS.MAX_DAMAGE_PER_MIN, 1) * SCORING_WEIGHTS.DAMAGE
	const visionScore = Math.min(avgVisionPerMin / SCORING_THRESHOLDS.MAX_VISION_PER_MIN, 1) * SCORING_WEIGHTS.VISION

	const overallPerformanceScore = Math.round(
		(winRateScore + kdaScore + csScore + damageScore + visionScore) * 100
	)

	return {
		gamesPlayed,
		wins,
		losses,
		winRate: (wins / gamesPlayed) * 100,
		avgKills,
		avgDeaths,
		avgAssists,
		avgKDA,
		avgCSPerMin,
		avgGoldPerMin,
		avgDamageDealt,
		avgDamagePerMin,
		avgVisionScore,
		avgVisionPerMin,
		bestChampion,
		topChampions,
		overallPerformanceScore,
	}
}

export interface MasterDisasterResult {
	masterPuuid: string
	disasterPuuid: string
	masterScore: number
	disasterScore: number
}

export function determineMasterDisaster(
	stats1: AggregatedPlayerStats,
	stats2: AggregatedPlayerStats,
	puuid1: string,
	puuid2: string
): MasterDisasterResult {
	const score1 = stats1.overallPerformanceScore
	const score2 = stats2.overallPerformanceScore

	if (score1 >= score2) {
		return {
			masterPuuid: puuid1,
			disasterPuuid: puuid2,
			masterScore: score1,
			disasterScore: score2,
		}
	}

	return {
		masterPuuid: puuid2,
		disasterPuuid: puuid1,
		masterScore: score2,
		disasterScore: score1,
	}
}
