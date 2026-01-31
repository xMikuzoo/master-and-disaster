import type { ParticipantDto } from "@/api/riotgames/types/match.types"

/**
 * Calculates performance score based on Riot's MVP system metrics
 */
function getPerformanceScore(p: ParticipantDto): number {
	const c = p.challenges || {}

	// KDA (30%)
	const kda =
		(c.kda as number) ?? (p.kills + p.assists) / Math.max(p.deaths, 1)

	// Kill Participation (25%)
	const killParticipation = (c.killParticipation as number) ?? 0

	// Team Damage % (25%)
	const teamDamagePercent = (c.teamDamagePercentage as number) ?? 0

	// Gold per minute (10%)
	const goldPerMin = (c.goldPerMinute as number) ?? 0

	// Vision score per minute (10%)
	const visionPerMin = (c.visionScorePerMinute as number) ?? 0

	// Normalize and weight
	return (
		kda * 0.3 +
		killParticipation * 100 * 0.25 +
		teamDamagePercent * 100 * 0.25 +
		(goldPerMin / 500) * 0.1 +
		(visionPerMin / 2) * 0.1
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
