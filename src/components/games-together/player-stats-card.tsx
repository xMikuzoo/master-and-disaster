import { memo, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
	getChampionIcon,
	getProfileIcon,
	getChampionData,
	getChampionNameById,
} from "@/api/ddragon-cdn"
import type { Match } from "@/api/riotgames/types"
import { UI_TEXTS } from "@/constants/ui-texts"
import { useSummoner, useChampionMasteryTop } from "@/api/riotgames/hooks"

interface PlayerStatsCardProps {
	puuid: string
	gameName: string
	tagLine: string
	matches: Match[]
}

function formatMasteryPoints(points: number): string {
	if (points >= 1000000) {
		return `${(points / 1000000).toFixed(1)}M`
	}
	if (points >= 1000) {
		return `${(points / 1000).toFixed(0)}K`
	}
	return points.toString()
}

export const PlayerStatsCard = memo(function PlayerStatsCard({
	puuid,
	gameName,
	tagLine,
	matches,
}: PlayerStatsCardProps) {
	const { data: summoner } = useSummoner(puuid)
	const { data: masteryData } = useChampionMasteryTop(puuid, 3)

	const { data: championData } = useQuery({
		queryKey: ["ddragon", "champions"],
		queryFn: getChampionData,
		staleTime: Infinity,
	})

	const masteryWithNames = useMemo(() => {
		if (!masteryData || !championData) return []
		return masteryData.map((mastery) => ({
			...mastery,
			championName: getChampionNameById(championData, mastery.championId),
		}))
	}, [masteryData, championData])

	const totalWins = useMemo(
		() =>
			matches.filter((m) =>
				m.info.participants.find((p) => p.puuid === puuid && p.win)
			).length,
		[matches, puuid]
	)

	const totalLosses = matches.length - totalWins

	return (
		<Card className="w-full">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-3">
					<Avatar size="lg">
						{summoner?.profileIconId && (
							<AvatarImage
								src={getProfileIcon(summoner.profileIconId)}
							/>
						)}
						<AvatarFallback>
							{gameName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle>
							{gameName}#{tagLine}
						</CardTitle>
						<div className="text-muted-foreground mt-1 flex gap-2 text-xs">
							<span className="text-green-500">
								{totalWins} {UI_TEXTS.wins}
							</span>
							<span className="text-red-500">
								{totalLosses} {UI_TEXTS.losses}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-muted-foreground mb-2 text-xs font-medium">
					{UI_TEXTS.topChampions}
				</div>
				<div className="space-y-2">
					{masteryWithNames.map((mastery) => (
						<div
							key={mastery.championId}
							className="flex items-center gap-2"
						>
							{mastery.championName && (
								<img
									src={getChampionIcon(mastery.championName)}
									alt={mastery.championName}
									className="h-8 w-8 rounded"
								/>
							)}
							<div className="flex-1">
								<div className="text-xs font-medium">
									{mastery.championName ?? "Unknown"}
								</div>
								<div className="text-muted-foreground text-xs">
									{UI_TEXTS.masteryLevel}{" "}
									{mastery.championLevel}
								</div>
							</div>
							<Badge variant="secondary">
								{formatMasteryPoints(mastery.championPoints)}
							</Badge>
						</div>
					))}
					{masteryWithNames.length === 0 && (
						<div className="text-muted-foreground text-xs">
							{UI_TEXTS.noCommonGames}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
})
