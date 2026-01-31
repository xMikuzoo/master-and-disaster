import { memo, useState, useMemo } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { getChampionIcon } from "@/api/ddragon-cdn"
import type { Match } from "@/api/riotgames/types"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"
import { UI_TEXTS } from "@/constants/ui-texts"
import { TEAM_IDS } from "@/constants"
import { cn } from "@/utils/cn"

const GAMES_PER_PAGE = 10

interface GamesTableProps {
	matches: Match[]
	puuid1: string
	puuid2: string
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatKDA(participant: ParticipantDto): string {
	return `${participant.kills}/${participant.deaths}/${participant.assists}`
}

interface TeamCellProps {
	participants: ParticipantDto[]
	trackedPuuids: string[]
	teamColor: "blue" | "red"
}

const TeamCell = memo(function TeamCell({
	participants,
	trackedPuuids,
	teamColor,
}: TeamCellProps) {
	return (
		<div className="flex flex-col gap-0.5">
			{participants.map((p) => {
				const isTracked = trackedPuuids.includes(p.puuid)
				return (
					<div
						key={p.participantId}
						className={cn(
							"flex items-center gap-1",
							isTracked && "font-semibold text-primary"
						)}
					>
						<img
							src={getChampionIcon(p.championName)}
							alt={p.championName}
							className={cn(
								"h-5 w-5 rounded border",
								isTracked
									? "border-primary"
									: teamColor === "blue"
										? "border-blue-500"
										: "border-red-500"
							)}
						/>
						<span className="max-w-20 truncate text-xs">
							{p.riotIdGameName}
						</span>
						<span className="text-muted-foreground text-xs">
							{formatKDA(p)}
						</span>
					</div>
				)
			})}
		</div>
	)
})

export const GamesTable = memo(function GamesTable({
	matches,
	puuid1,
	puuid2,
}: GamesTableProps) {
	const [currentPage, setCurrentPage] = useState(1)
	const trackedPuuids = useMemo(() => [puuid1, puuid2], [puuid1, puuid2])

	const sortedMatches = useMemo(() => {
		return [...matches].sort(
			(a, b) => b.info.gameStartTimestamp - a.info.gameStartTimestamp
		)
	}, [matches])

	const totalPages = Math.ceil(sortedMatches.length / GAMES_PER_PAGE)

	const paginatedMatches = useMemo(() => {
		const start = (currentPage - 1) * GAMES_PER_PAGE
		return sortedMatches.slice(start, start + GAMES_PER_PAGE)
	}, [sortedMatches, currentPage])

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

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
							<TableHead>{UI_TEXTS.blueTeam}</TableHead>
							<TableHead>{UI_TEXTS.redTeam}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedMatches.map((match) => {
							const participant1 = match.info.participants.find(
								(p) => p.puuid === puuid1
							)

							if (!participant1) return null

							const blueTeam = match.info.participants.filter(
								(p) => p.teamId === TEAM_IDS.BLUE
							)
							const redTeam = match.info.participants.filter(
								(p) => p.teamId === TEAM_IDS.RED
							)

							const blueWon = blueTeam[0]?.win

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
										<div className="flex flex-col gap-1">
											<Badge
												variant={
													blueWon
														? "default"
														: "destructive"
												}
												className="w-fit"
											>
												{blueWon
													? UI_TEXTS.win
													: UI_TEXTS.loss}
											</Badge>
											<Badge
												variant={
													!blueWon
														? "default"
														: "destructive"
												}
												className="w-fit"
											>
												{!blueWon
													? UI_TEXTS.win
													: UI_TEXTS.loss}
											</Badge>
										</div>
									</TableCell>
									<TableCell>
										<TeamCell
											participants={blueTeam}
											trackedPuuids={trackedPuuids}
											teamColor="blue"
										/>
									</TableCell>
									<TableCell>
										<TeamCell
											participants={redTeam}
											trackedPuuids={trackedPuuids}
											teamColor="red"
										/>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>

			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								text={UI_TEXTS.previous}
								onClick={(e) => {
									e.preventDefault()
									handlePageChange(currentPage - 1)
								}}
								aria-disabled={currentPage === 1}
								className={
									currentPage === 1
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>

						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter((page) => {
								return (
									page === 1 ||
									page === totalPages ||
									Math.abs(page - currentPage) <= 1
								)
							})
							.map((page, index, arr) => {
								const showEllipsis =
									index > 0 && page - arr[index - 1] > 1

								return (
									<>
										{showEllipsis && (
											<PaginationItem key={`ellipsis-${page}`}>
												<span className="px-2">...</span>
											</PaginationItem>
										)}
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												isActive={page === currentPage}
												onClick={(e) => {
													e.preventDefault()
													handlePageChange(page)
												}}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									</>
								)
							})}

						<PaginationItem>
							<PaginationNext
								href="#"
								text={UI_TEXTS.next}
								onClick={(e) => {
									e.preventDefault()
									handlePageChange(currentPage + 1)
								}}
								aria-disabled={currentPage === totalPages}
								className={
									currentPage === totalPages
										? "pointer-events-none opacity-50"
										: ""
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}

			<div className="text-muted-foreground text-center text-xs">
				{matches.length} {UI_TEXTS.games}
			</div>
		</div>
	)
})
