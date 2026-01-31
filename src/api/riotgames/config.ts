export const REGIONS = {
	EUROPE: "europe",
	EUN1: "eun1",
	EUW1: "euw1",
	NA1: "na1",
} as const

export type Region = (typeof REGIONS)[keyof typeof REGIONS]

export const DEFAULT_ACCOUNT_REGION = REGIONS.EUROPE
export const DEFAULT_PLATFORM_REGION = REGIONS.EUN1
