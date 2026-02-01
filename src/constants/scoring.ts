/**
 * Scoring weights for calculating overall player performance
 * Total weights must sum to 100%
 */
export const SCORING_WEIGHTS = {
	/** Weight for win rate contribution (40%) */
	WIN_RATE: 40,
	/** Weight for KDA contribution (25%) */
	KDA: 25,
	/** Weight for CS per minute contribution (15%) */
	CS: 15,
	/** Weight for damage per minute contribution (10%) */
	DAMAGE: 10,
	/** Weight for vision score per minute contribution (10%) */
	VISION: 10,
} as const

/**
 * Maximum thresholds for normalizing performance metrics
 * Values above these are capped at 1.0 (100%)
 */
export const SCORING_THRESHOLDS = {
	/** Maximum KDA for full score (5.0) */
	MAX_KDA: 5.0,
	/** Maximum CS per minute for full score (8.0) */
	MAX_CS_PER_MIN: 8.0,
	/** Maximum damage per minute for full score (1000) */
	MAX_DAMAGE_PER_MIN: 1000,
	/** Maximum vision score per minute for full score (1.5) */
	MAX_VISION_PER_MIN: 1.5,
} as const
