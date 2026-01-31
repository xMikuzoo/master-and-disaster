import { memo } from "react"
import { cn, getMultikillBadges, formatKdaRatio } from "@/utils"
import {
	getChampionIcon,
	getItemIcon,
	getSummonerSpellIcon,
} from "@/api/ddragon-cdn"
import { Badge } from "@/components/ui/badge"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"

interface PlayerHighlightCellProps {
	player: ParticipantDto
}

export const PlayerHighlightCell = memo(function PlayerHighlightCell({
	player,
}: PlayerHighlightCellProps) {
	const items = [
		player.item0,
		player.item1,
		player.item2,
		player.item3,
		player.item4,
		player.item5,
		player.item6,
	]

	const multikillBadges = getMultikillBadges(player)
	const kdaRatio = formatKdaRatio(player.kills, player.deaths, player.assists)

	const spell1Icon = getSummonerSpellIcon(player.summoner1Id)
	const spell2Icon = getSummonerSpellIcon(player.summoner2Id)

	return (
		<div className="flex flex-1 flex-col justify-center gap-2 border-x px-4 py-3">
			{/* Player name */}
			<div className="text-sm font-medium">
				{player.riotIdGameName}
				<span className="text-muted-foreground">#{player.riotIdTagline}</span>
			</div>

			{/* Top row: Champion, Spells, KDA, Badges */}
			<div className="flex items-center gap-4">
				{/* Champion icon with level badge */}
				<div className="relative">
					<img
						src={getChampionIcon(player.championName)}
						alt={player.championName}
						className="h-12 w-12 rounded-lg"
					/>
					<div className="bg-background absolute -right-1 -bottom-1 rounded px-1 text-[10px] font-bold">
						{player.champLevel}
					</div>
				</div>

				{/* Summoner spells */}
				<div className="flex flex-col gap-0.5">
					{spell1Icon && (
						<img
							src={spell1Icon}
							alt="Spell 1"
							className="h-5 w-5 rounded"
						/>
					)}
					{spell2Icon && (
						<img
							src={spell2Icon}
							alt="Spell 2"
							className="h-5 w-5 rounded"
						/>
					)}
				</div>

				{/* KDA */}
				<div className="flex flex-col gap-0.5">
					<div className="text-base font-bold">
						<span>{player.kills}</span>
						<span className="text-muted-foreground"> / </span>
						<span className="text-red-500">{player.deaths}</span>
						<span className="text-muted-foreground"> / </span>
						<span>{player.assists}</span>
					</div>
					<div className="text-muted-foreground text-xs">
						{kdaRatio} KDA
					</div>
				</div>
			</div>

			{/* Third row: Multikill badges */}
			{multikillBadges.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{multikillBadges.map((badge) => (
						<Badge
							key={badge}
							variant="secondary"
							className="text-xs"
						>
							{badge}
						</Badge>
					))}
				</div>
			)}

			{/* Second row: Items */}
			<div className="flex gap-0.5">
				{items.map((itemId, index) => {
					const icon = getItemIcon(itemId)
					return (
						<div
							key={index}
							className={cn(
								"bg-muted/50 h-7 w-7 rounded",
								index === 6 && "rounded-full"
							)}
						>
							{icon && (
								<img
									src={icon}
									alt={`Item ${index + 1}`}
									className={cn(
										"h-7 w-7 rounded",
										index === 6 && "rounded-full"
									)}
								/>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
})
