export const API_DEFAULTS = {
	MATCH_LIST_COUNT: 20,
	MATCH_LIST_START: 0,
} as const

export const TEAM_IDS = {
	BLUE: 100,
	RED: 200,
} as const

export const STORAGE_KEYS = {
	THEME: "master-or-disaster-ui-theme",
	SELECTED_ACCOUNTS: "master-or-disaster-selected-accounts",
} as const

export { SCORING_WEIGHTS, SCORING_THRESHOLDS } from "./scoring"
export { MATCH_FETCH, CACHE_TIMING } from "./api"
