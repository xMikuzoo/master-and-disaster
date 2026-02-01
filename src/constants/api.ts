/**
 * API-related constants for match fetching
 */
export const MATCH_FETCH = {
	/** Number of matches to fetch per batch */
	BATCH_SIZE: 20,
	/** Target number of matches to find */
	TARGET_COUNT: 10,
} as const

/**
 * Cache timing constants (in milliseconds)
 */
export const CACHE_TIMING = {
	/** How long data is considered fresh */
	STALE_TIME: 5 * 60 * 1000, // 5 minutes
	/** How long to keep data in garbage collection */
	GC_TIME: 10 * 60 * 1000, // 10 minutes
} as const
