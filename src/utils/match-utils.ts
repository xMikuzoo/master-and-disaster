import type { ParticipantDto } from "@/api/riotgames/types/match.types"

// Performance score calculation weights
const PERFORMANCE_WEIGHTS = {
	KDA: 0.3,
	KILL_PARTICIPATION: 0.25,
	TEAM_DAMAGE: 0.25,
	GOLD_PER_MIN: 0.1,
	VISION_PER_MIN: 0.1,
} as const

// Normalization factors for performance metrics
const NORMALIZATION = {
	GOLD_PER_MIN_FACTOR: 500,
	VISION_PER_MIN_FACTOR: 2,
	PERCENTAGE_MULTIPLIER: 100,
} as const

/**
 * Safely extracts a numeric value from challenges object
 */
function getChallengeValue(
	challenges: Record<string, unknown> | undefined,
	key: string,
	fallback: number
): number {
	if (!challenges) return fallback
	const value = challenges[key]
	return typeof value === "number" && !Number.isNaN(value) ? value : fallback
}

/**
 * Calculates performance score based on Riot's MVP system metrics
 * Score weights:
 * - KDA: 30%
 * - Kill Participation: 25%
 * - Team Damage %: 25%
 * - Gold per minute: 10%
 * - Vision score per minute: 10%
 */
function getPerformanceScore(p: ParticipantDto): number {
	const challenges = p.challenges as Record<string, unknown> | undefined

	const fallbackKda = (p.kills + p.assists) / Math.max(p.deaths, 1)

	const kda = getChallengeValue(challenges, "kda", fallbackKda)
	const killParticipation = getChallengeValue(challenges, "killParticipation", 0)
	const teamDamagePercent = getChallengeValue(challenges, "teamDamagePercentage", 0)
	const goldPerMin = getChallengeValue(challenges, "goldPerMinute", 0)
	const visionPerMin = getChallengeValue(challenges, "visionScorePerMinute", 0)

	return (
		kda * PERFORMANCE_WEIGHTS.KDA +
		killParticipation * NORMALIZATION.PERCENTAGE_MULTIPLIER * PERFORMANCE_WEIGHTS.KILL_PARTICIPATION +
		teamDamagePercent * NORMALIZATION.PERCENTAGE_MULTIPLIER * PERFORMANCE_WEIGHTS.TEAM_DAMAGE +
		(goldPerMin / NORMALIZATION.GOLD_PER_MIN_FACTOR) * PERFORMANCE_WEIGHTS.GOLD_PER_MIN +
		(visionPerMin / NORMALIZATION.VISION_PER_MIN_FACTOR) * PERFORMANCE_WEIGHTS.VISION_PER_MIN
	)
}

/**
 * Returns the better performing player from two participants based on performance metrics
 */
export function getBetterPlayer(
	participants: ParticipantDto[],
	puuid1: string,
	puuid2: string
): ParticipantDto | null {
	const p1 = participants.find((p) => p.puuid === puuid1)
	const p2 = participants.find((p) => p.puuid === puuid2)

	if (!p1 || !p2) return p1 || p2 || null

	return getPerformanceScore(p1) >= getPerformanceScore(p2) ? p1 : p2
}

/**
 * Returns both players sorted by performance (master first, disaster second)
 */
export function getPlayersByPerformance(
	participants: ParticipantDto[],
	puuid1: string,
	puuid2: string
): { master: ParticipantDto; disaster: ParticipantDto } | null {
	const p1 = participants.find((p) => p.puuid === puuid1)
	const p2 = participants.find((p) => p.puuid === puuid2)

	if (!p1 || !p2) return null

	const score1 = getPerformanceScore(p1)
	const score2 = getPerformanceScore(p2)

	return score1 >= score2
		? { master: p1, disaster: p2 }
		: { master: p2, disaster: p1 }
}

/**
 * Gets multikill badges for a participant
 */
export function getMultikillBadges(participant: ParticipantDto): string[] {
	const badges: string[] = []

	if (participant.pentaKills > 0) {
		badges.push("Penta Kill")
	} else if (participant.quadraKills > 0) {
		badges.push("Quadra Kill")
	} else if (participant.tripleKills > 0) {
		badges.push("Triple Kill")
	} else if (participant.doubleKills > 0) {
		badges.push("Double Kill")
	}

	if (participant.firstBloodKill) {
		badges.push("First Blood")
	}

	return badges
}

/**
 * Calculates KDA ratio string
 */
export function formatKdaRatio(
	kills: number,
	deaths: number,
	assists: number
): string {
	if (deaths === 0) {
		return "Perfect"
	}
	const ratio = (kills + assists) / deaths
	return `${ratio.toFixed(2)}:1`
}

/**
 * Formats a number in compact notation (e.g., 12345 -> "12.3k")
 */
export function formatCompactNumber(num: number): string {
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}k`
	}
	return num.toString()
}

/**
 * Calculates total CS (minions + jungle monsters)
 */
export function getTotalCS(participant: ParticipantDto): number {
	return participant.totalMinionsKilled + participant.neutralMinionsKilled
}
