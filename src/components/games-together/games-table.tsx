import { memo, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, getPlayersByPerformance } from "@/utils"
import type { Match } from "@/api/riotgames/types"
import { UI_TEXTS } from "@/constants/ui-texts"
import {
	MatchInfoCell,
	PlayersComparisonCell,
	TeamsCell,
} from "./match-row"

interface GamesTableProps {
	matches: Match[]
	puuid1: string
	puuid2: string
	isLoadingMore?: boolean
}

interface MatchRowProps {
	match: Match
	puuid1: string
	puuid2: string
}

const MatchRow = memo(function MatchRow({
	match,
	puuid1,
	puuid2,
}: MatchRowProps) {
	const participant1 = match.info.participants.find((p) => p.puuid === puuid1)
	const players = getPlayersByPerformance(
		match.info.participants,
		puuid1,
		puuid2
	)

	if (!participant1 || !players) return null

	const didWin = participant1.win

	return (
		<div
			className={cn(
				"flex items-stretch rounded-lg border",
				didWin
					? "border-l-4 border-l-green-500 bg-green-500/5"
					: "border-l-4 border-l-red-500 bg-red-500/5"
			)}
		>
			<MatchInfoCell
				queueId={match.info.queueId}
				gameStartTimestamp={match.info.gameStartTimestamp}
				gameDuration={match.info.gameDuration}
				didWin={didWin}
			/>
			<PlayersComparisonCell
				master={players.master}
				disaster={players.disaster}
			/>
			<TeamsCell
				participants={match.info.participants}
				puuid1={puuid1}
				puuid2={puuid2}
			/>
		</div>
	)
})

const LoadingRow = memo(function LoadingRow() {
	return (
		<div className="flex items-stretch rounded-lg border">
			{/* Match info skeleton */}
			<div className="flex min-w-[120px] flex-col justify-center gap-2 px-4 py-3">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-5 w-14" />
				<Skeleton className="h-3 w-12" />
			</div>

			{/* Player highlight skeleton */}
			<div className="flex flex-1 items-center gap-4 border-x px-4 py-3">
				<Skeleton className="h-16 w-16 rounded-lg" />
				<div className="flex flex-col gap-1">
					<Skeleton className="h-6 w-6 rounded" />
					<Skeleton className="h-6 w-6 rounded" />
				</div>
				<div className="flex flex-col gap-1">
					<Skeleton className="h-5 w-20" />
					<Skeleton className="h-3 w-16" />
				</div>
				<div className="flex gap-0.5">
					{Array.from({ length: 7 }).map((_, i) => (
						<Skeleton key={i} className="h-7 w-7 rounded" />
					))}
				</div>
			</div>

			{/* Teams skeleton */}
			<div className="flex gap-6 px-4 py-3">
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
			<div className="space-y-2">
				{sortedMatches.map((match) => (
					<MatchRow
						key={match.metadata.matchId}
						match={match}
						puuid1={puuid1}
						puuid2={puuid2}
					/>
				))}
				{isLoadingMore && <LoadingRow />}
			</div>

			<div className="text-muted-foreground text-center text-xs">
				{matches.length} {UI_TEXTS.games}
			</div>
		</div>
	)
})
