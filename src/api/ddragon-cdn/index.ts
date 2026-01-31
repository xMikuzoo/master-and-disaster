export const getProfileIcon = (iconId: number) => {
	return `ddragon-cdn/img/profileicon/${iconId}.png`
}

export const getChampionIcon = (championName: string) => {
	return `ddragon-cdn/img/champion/${championName}.png`
}

interface ChampionInfo {
	key: string
	name: string
	id: string
}

export interface ChampionData {
	data: Record<string, ChampionInfo>
}

export const getChampionData = async (): Promise<ChampionData> => {
	const response = await fetch("ddragon-cdn/data/en_US/champion.json")
	return response.json()
}

export const getChampionNameById = (
	data: ChampionData,
	id: number
): string | undefined => {
	const idStr = id.toString()
	const champion = Object.values(data.data).find((c) => c.key === idStr)
	return champion?.id
}
