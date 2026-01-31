export const getProfileIcon = (iconId: number) => {
	return `ddragon-cdn/img/profileicon/${iconId}.png`
}

// Mapowanie ID summoner spelli na nazwy plików
const SUMMONER_SPELL_MAP: Record<number, string> = {
	1: "SummonerBoost", // Cleanse
	3: "SummonerExhaust", // Exhaust
	4: "SummonerFlash", // Flash
	6: "SummonerHaste", // Ghost
	7: "SummonerHeal", // Heal
	11: "SummonerSmite", // Smite
	12: "SummonerTeleport", // Teleport
	13: "SummonerMana", // Clarity
	14: "SummonerDot", // Ignite
	21: "SummonerBarrier", // Barrier
	32: "SummonerSnowball", // Mark (ARAM)
}

export const getItemIcon = (itemId: number) => {
	if (itemId === 0) return null
	return `ddragon-cdn/img/item/${itemId}.png`
}

export const getSummonerSpellIcon = (spellId: number) => {
	const spellName = SUMMONER_SPELL_MAP[spellId]
	if (!spellName) return null
	return `ddragon-cdn/img/spell/${spellName}.png`
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
