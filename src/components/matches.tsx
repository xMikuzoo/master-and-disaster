import { getChampionIcon } from "@/api/ddragon-cdn"
import { getMatchById, getMatchListByPUUID } from "@/api/riotgames"
import type { Match } from "@/api/riotgames/types"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { getQueueNameById } from "@/utils/queueMapping"
import { useQueries, useQuery } from "@tanstack/react-query"

interface MatchesProps {
	accountPUUID: string
}
export function Matches(props: MatchesProps) {
	const {
		data: matchList,
		error: matchListError,
		isLoading: matchListIsLoading,
	} = useQuery({
		queryKey: ["matchList", props.accountPUUID],
		queryFn: () =>
			getMatchListByPUUID({
				params: { puuid: props.accountPUUID },
				query: { count: 3 },
			}),
		select: (data) => data?.data,
		enabled: !!props.accountPUUID,
	})
	const matchDetailsQueries = useQueries({
		queries: (matchList ?? []).map((matchId) => ({
			queryKey: ["matchDetails", matchId],
			queryFn: () => getMatchById({ matchId }),
			enabled: !!matchList,
		})),
	})

	const matches = () => {
		return matchDetailsQueries
			.map((query) => query.data?.data)
			.filter((match): match is Match => match !== undefined)
	}

	const champions = (participants: Match["info"]["participants"]) => {
		const team1 = participants.filter((p) => p.teamId === 100)
		const team2 = participants.filter((p) => p.teamId === 200)

		const PlayerRow = ({
			p,
			team,
		}: {
			p: (typeof participants)[0]
			team: 1 | 2
		}) => (
			<div className="flex items-center gap-1">
				<img
					src={getChampionIcon(p.championName)}
					alt={p.championName}
					className={`h-5 w-5 rounded ${team === 1 ? "border border-blue-500" : "border border-red-500"}`}
				/>
				<span className="max-w-20 truncate text-xs">
					{p.riotIdGameName}
				</span>
			</div>
		)

		return (
			<div className="flex justify-between">
				<div className="flex w-full flex-col gap-1">
					{team1.map((p) => (
						<PlayerRow key={p.participantId} p={p} team={1} />
					))}
				</div>
				<div className="flex w-full flex-col gap-1">
					{team2.map((p) => (
						<PlayerRow key={p.participantId} p={p} team={2} />
					))}
				</div>
			</div>
		)
	}

	const matchRow = (match: Match) => {
		return (
			<TableRow key={match.metadata.matchId}>
				<TableCell className="font-medium">
					{getQueueNameById(match.info.queueId)}
				</TableCell>
				<TableCell className="font-medium">
					{match.metadata.matchId}
				</TableCell>
				<TableCell>{match.info.gameMode}</TableCell>
				<TableCell>{match.info.gameType}</TableCell>
				<TableCell>
					{new Date(
						match.info.gameStartTimestamp
					).toLocaleDateString()}
				</TableCell>
				<TableCell>
					{(match.info.gameDuration / 60).toFixed(2)} mins
				</TableCell>
				<TableCell>{champions(match.info.participants)}</TableCell>
			</TableRow>
		)
	}

	return (
		<div className="rounded-md border p-2">
			<Table>
				<TableCaption>Ostatnie mecze</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead></TableHead>
						<TableHead>Match ID</TableHead>
						<TableHead>Game Mode</TableHead>
						<TableHead>Game Type</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Duration</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>{matches().map(matchRow)}</TableBody>
			</Table>
		</div>
	)
}
