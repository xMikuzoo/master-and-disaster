import { memo } from "react"
import { getChampionIcon } from "@/api/ddragon-cdn"
import { UI_TEXTS } from "@/constants/ui-texts"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"

interface PlayerRowProps {
	participant: ParticipantDto
	isTracked: boolean
}

const PlayerRow = memo(function PlayerRow({
	participant,
	isTracked,
}: PlayerRowProps) {
	return (
		<div
			className={`flex items-center gap-1.5 rounded px-1 py-0.5 ${
				isTracked ? "bg-primary/20 ring-primary/50 ring-1" : ""
			}`}
		>
			<img
				src={getChampionIcon(participant.championName)}
				alt={participant.championName}
				className="h-5 w-5 rounded"
			/>
			<span
				className={`max-w-20 truncate text-xs ${
					isTracked ? "font-semibold" : "text-muted-foreground"
				}`}
			>
				{participant.riotIdGameName}
			</span>
		</div>
	)
})

interface TeamsCellProps {
	participants: ParticipantDto[]
	puuid1: string
	puuid2: string
}

export const TeamsCell = memo(function TeamsCell({
	participants,
	puuid1,
	puuid2,
}: TeamsCellProps) {
	const blueTeam = participants.filter((p) => p.teamId === 100)
	const redTeam = participants.filter((p) => p.teamId === 200)

	const isTracked = (puuid: string) => puuid === puuid1 || puuid === puuid2

	return (
		<div className="flex gap-6 px-4 py-3">
			{/* Blue Team */}
			<div className="space-y-0.5">
				<div className="text-muted-foreground mb-1 text-[10px] font-medium uppercase">
					{UI_TEXTS.blueTeam}
				</div>
				{blueTeam.map((p) => (
					<PlayerRow
						key={p.participantId}
						participant={p}
						isTracked={isTracked(p.puuid)}
					/>
				))}
			</div>
			{/* Red Team */}
			<div className="space-y-0.5">
				<div className="text-muted-foreground mb-1 text-[10px] font-medium uppercase">
					{UI_TEXTS.redTeam}
				</div>
				{redTeam.map((p) => (
					<PlayerRow
						key={p.participantId}
						participant={p}
						isTracked={isTracked(p.puuid)}
					/>
				))}
			</div>
		</div>
	)
})
