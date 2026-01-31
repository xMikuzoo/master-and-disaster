interface QueueInfo {
	name: string
}

export const QUEUE_DATA: Record<number, QueueInfo> = {
	420: {
		name: "Ranked Solo/Duo",
	},
	440: { name: "Ranked Flex" },
	400: { name: "Normal Draft" },
	430: { name: "Normal Blind" },
	490: { name: "Quickplay" },

	450: { name: "ARAM" },

	1700: { name: "Arena" },

	1090: { name: "TFT Normal" },
	1100: { name: "TFT Ranked" },

	900: { name: "URF" },
	1900: { name: "URF" },

	0: { name: "Custom/Unknown" },
}

export const getQueueNameById = (queueId: number): string => {
	return QUEUE_DATA[queueId]?.name ?? "Custom/Unknown"
}
