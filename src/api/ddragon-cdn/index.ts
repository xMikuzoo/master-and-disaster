export const getProfileIcon = (iconId: number) => {
	return `ddragon-cdn/img/profileicon/${iconId}.png`
}

// Known mismatches between champion names from Match API and actual CDN file names
// See: https://github.com/RiotGames/developer-relations/issues/693
const CHAMPION_NAME_FIXES: Record<string, string> = {
	FiddleSticks: "Fiddlesticks",
}

export const getChampionIcon = (championName: string) => {
	const fixedName = CHAMPION_NAME_FIXES[championName] ?? championName
	return `ddragon-cdn/img/champion/${fixedName}.png`
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
