import { getLeagueEntryByPUUID, getSummonerByPUUID } from "@/api/riotgames"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
	ItemGroup,
	ItemSeparator,
} from "@/components/ui/item"
import type { Account } from "@/api/riotgames/types"
import { SummonerProfileSkeleton } from "./summoner-profile.skeleton"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { XIcon } from "lucide-react"
import { Matches } from "./matches"
import { getProfileIcon } from "@/api/ddragon-cdn"

type SummonerProfileProps = Account

export function SummonerProfile(props: SummonerProfileProps) {
	const [selectedQueueType, setSelectedQueueType] = useState<string | null>(
		null
	)

	const {
		data: summoner,
		error: summonerError,
		isPending: isPendingSummoner,
	} = useQuery({
		queryKey: ["summonerProfile", props.puuid],
		queryFn: () => getSummonerByPUUID({ puuid: props.puuid }),
		select: (data) => data?.data,
	})

	const {
		data: leagueEntry,
		error: leagueEntryError,
		isPending: isPendingLeagueEntry,
	} = useQuery({
		queryKey: ["leagueEntry", props.puuid],
		queryFn: () => getLeagueEntryByPUUID({ puuid: props.puuid }),
		select: (data) => data?.data,
		enabled: !!summoner,
	})

	const filteredLeagueEntry = useMemo(() => {
		return leagueEntry?.find(
			(entry) => entry.queueType === selectedQueueType
		)
	}, [leagueEntry, selectedQueueType])

	return (
		<>
			{isPendingSummoner || isPendingLeagueEntry ? (
				<SummonerProfileSkeleton />
			) : !!summonerError || !!leagueEntryError ? (
				<div>{summonerError?.message || leagueEntryError?.message}</div>
			) : (
				!!summoner && (
					<ItemGroup className="w-fit gap-1">
						<Item variant={"outline"} className="w-fit min-w-96">
							<ItemMedia>
								<Avatar size="xl">
									<AvatarImage
										src={getProfileIcon(
											summoner?.profileIconId
										)}
									/>
									<AvatarFallback>
										{props.gameName
											.slice(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</ItemMedia>

							<ItemContent>
								<ItemTitle>
									{props.gameName}#{props.tagLine}
								</ItemTitle>
								<ItemDescription>
									Poziom: {summoner?.summonerLevel}
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								{!!leagueEntry && (
									<DropdownMenu>
										<ButtonGroup>
											<DropdownMenuTrigger asChild>
												<Button variant={"outline"}>
													Ranking
												</Button>
											</DropdownMenuTrigger>
											{!!filteredLeagueEntry && (
												<Button
													variant={"outline"}
													size={"icon"}
													onClick={() =>
														setSelectedQueueType(
															null
														)
													}
												>
													<XIcon />
												</Button>
											)}
										</ButtonGroup>
										<DropdownMenuContent className="w-fit">
											{leagueEntry.map((entry) => (
												<DropdownMenuItem
													key={entry.queueType}
													onClick={() =>
														setSelectedQueueType(
															entry.queueType
														)
													}
												>
													{entry.queueType}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</ItemActions>
						</Item>
						{!!leagueEntry &&
							!!selectedQueueType &&
							filteredLeagueEntry && (
								<>
									<ItemSeparator />
									<Item
										variant={"outline"}
										className="w-fit min-w-96"
									>
										<ItemContent>
											<ItemTitle>
												{filteredLeagueEntry.tier}{" "}
												{filteredLeagueEntry.rank}{" "}
												-{" "}
											</ItemTitle>
											<ItemDescription>
												{
													filteredLeagueEntry.leaguePoints
												}{" "}
												LP
											</ItemDescription>
										</ItemContent>
										<ItemActions>
											{filteredLeagueEntry.miniSeries && (
												<div>
													Progress:{" "}
													{
														filteredLeagueEntry
															.miniSeries.progress
													}
												</div>
											)}
										</ItemActions>
									</Item>
								</>
							)}
					</ItemGroup>
				)
			)}
			<Matches accountPUUID={props.puuid} />
		</>
	)
}
