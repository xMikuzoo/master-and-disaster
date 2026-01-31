import { memo } from "react"
import { getMatchById, getMatchListByPUUID, riotQueryKeys } from "@/api/riotgames"
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
import { TeamDisplay } from "./team-display"
import { getQueueNameById } from "@/utils/queue-mapping"
import { useQueries, useQuery } from "@tanstack/react-query"
import { UI_TEXTS } from "@/constants/ui-texts"

interface MatchesProps {
	accountPUUID: string
}

export const Matches = memo(function Matches(props: MatchesProps) {
	const {
		data: matchList,
		error,
		isLoading,
	} = useQuery({
		queryKey: riotQueryKeys.matchList(props.accountPUUID),
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
			queryKey: riotQueryKeys.matchDetails(matchId),
			queryFn: () => getMatchById({ matchId }),
			enabled: !!matchList,
		})),
	})

	const matches = matchDetailsQueries
		.map((query) => query.data?.data)
		.filter((match): match is Match => match !== undefined)

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
				<TableCell>
					<TeamDisplay participants={match.info.participants} />
				</TableCell>
			</TableRow>
		)
	}

	if (isLoading) {
		return (
			<div className="rounded-md border p-2">
				{UI_TEXTS.loadingMatches}
			</div>
		)
	}

	if (error) {
		return (
			<div className="rounded-md border p-2 text-red-500">
				{UI_TEXTS.failedToLoadMatches}
			</div>
		)
	}

	return (
		<div className="rounded-md border p-2">
			<Table>
				<TableCaption>{UI_TEXTS.recentMatches}</TableCaption>
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
				<TableBody>{matches.map(matchRow)}</TableBody>
			</Table>
		</div>
	)
})
