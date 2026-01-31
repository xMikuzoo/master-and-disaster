import { memo } from "react"
import { getChampionIcon } from "@/api/ddragon-cdn"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"

interface PlayerRowProps {
	participant: ParticipantDto
	team: 1 | 2
}

export const PlayerRow = memo(function PlayerRow({
	participant,
	team,
}: PlayerRowProps) {
	return (
		<div className="flex items-center gap-1">
			<img
				src={getChampionIcon(participant.championName)}
				alt={participant.championName}
				className={`h-5 w-5 rounded ${team === 1 ? "border border-blue-500" : "border border-red-500"}`}
			/>
			<span className="max-w-20 truncate text-xs">
				{participant.riotIdGameName}
			</span>
		</div>
	)
})
