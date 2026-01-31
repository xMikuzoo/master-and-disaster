export interface AccountInfo {
	gameName: string
	tagLine: string
}

export interface PlayerConfig {
	id: string
	displayName: string
	accounts: AccountInfo[]
}

export const TRACKED_PLAYERS: PlayerConfig[] = [
	{
		id: "cinos",
		displayName: "Marcinek",
		accounts: [
			{ gameName: "cinosBBC", tagLine: "EUNE" },
			{ gameName: "IndonesiaMachine", tagLine: "1067" },
		],
	},
	{
		id: "lowca",
		displayName: "Bartuś",
		accounts: [{ gameName: "Łowca dziekanów", tagLine: "EUNE" }],
	},
]
