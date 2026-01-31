import { memo, useMemo } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getChampionIcon } from "@/api/ddragon-cdn"
import type { Match } from "@/api/riotgames/types"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"
import { UI_TEXTS } from "@/constants/ui-texts"

interface GamesTableProps {
	matches: Match[]
	puuid1: string
	puuid2: string
	isLoadingMore?: boolean
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}:${secs.toString().padStart(2, "0")}`
}

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

const TeamsCell = memo(function TeamsCell({
	participants,
	puuid1,
	puuid2,
}: TeamsCellProps) {
	const blueTeam = participants.filter((p) => p.teamId === 100)
	const redTeam = participants.filter((p) => p.teamId === 200)

	const isTracked = (puuid: string) => puuid === puuid1 || puuid === puuid2

	return (
		<div className="flex gap-6">
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

export const GamesTable = memo(function GamesTable({
	matches,
	puuid1,
	puuid2,
	isLoadingMore,
}: GamesTableProps) {
	const sortedMatches = useMemo(() => {
		return [...matches].sort(
			(a, b) => b.info.gameStartTimestamp - a.info.gameStartTimestamp
		)
	}, [matches])

	if (matches.length === 0) {
		return (
			<div className="text-muted-foreground rounded-md border p-8 text-center">
				{UI_TEXTS.noCommonGames}
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{UI_TEXTS.date}</TableHead>
							<TableHead>{UI_TEXTS.duration}</TableHead>
							<TableHead>{UI_TEXTS.result}</TableHead>
							<TableHead>{UI_TEXTS.teams}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedMatches.map((match) => {
							const participant1 = match.info.participants.find(
								(p) => p.puuid === puuid1
							)

							if (!participant1) return null

							const didWin = participant1.win

							return (
								<TableRow key={match.metadata.matchId}>
									<TableCell>
										{new Date(
											match.info.gameStartTimestamp
										).toLocaleDateString("pl-PL")}
									</TableCell>
									<TableCell>
										{formatDuration(match.info.gameDuration)}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												didWin
													? "default"
													: "destructive"
											}
											className="w-fit"
										>
											{didWin
												? UI_TEXTS.win
												: UI_TEXTS.loss}
										</Badge>
									</TableCell>
									<TableCell>
										<TeamsCell
											participants={match.info.participants}
											puuid1={puuid1}
											puuid2={puuid2}
										/>
									</TableCell>
								</TableRow>
							)
						})}
						{isLoadingMore && (
							<TableRow>
								<TableCell>
									<Skeleton className="h-4 w-20" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-16" />
								</TableCell>
								<TableCell>
									<div className="flex gap-6">
										<div className="space-y-1">
											{Array.from({ length: 5 }).map((_, i) => (
												<Skeleton key={i} className="h-5 w-24" />
											))}
										</div>
										<div className="space-y-1">
											{Array.from({ length: 5 }).map((_, i) => (
												<Skeleton key={i} className="h-5 w-24" />
											))}
										</div>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="text-muted-foreground text-center text-xs">
				{matches.length} {UI_TEXTS.games}
			</div>
		</div>
	)
})
