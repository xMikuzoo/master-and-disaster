import { memo } from "react"
import { PlayerRow } from "./player-row"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"
import { TEAM_IDS } from "@/constants"

interface TeamDisplayProps {
	participants: ParticipantDto[]
}

export const TeamDisplay = memo(function TeamDisplay({
	participants,
}: TeamDisplayProps) {
	const team1 = participants.filter((p) => p.teamId === TEAM_IDS.BLUE)
	const team2 = participants.filter((p) => p.teamId === TEAM_IDS.RED)

	return (
		<div className="flex justify-between">
			<div className="flex w-full flex-col gap-0.5">
				{team1.map((p) => (
					<PlayerRow
						key={p.participantId}
						participant={p}
						team={1}
					/>
				))}
			</div>
			<div className="flex w-full flex-col gap-0.5">
				{team2.map((p) => (
					<PlayerRow
						key={p.participantId}
						participant={p}
						team={2}
					/>
				))}
			</div>
		</div>
	)
})
