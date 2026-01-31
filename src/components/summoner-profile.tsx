import { memo, useMemo } from "react"
import {
	getLeagueEntryByPUUID,
	getSummonerByPUUID,
	riotQueryKeys,
} from "@/api/riotgames"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
	ItemGroup,
} from "@/components/ui/item"
import type { Account } from "@/api/riotgames/types"
import { SummonerProfileSkeleton } from "./summoner-profile.skeleton"
import { Matches } from "./matches"
import { getProfileIcon } from "@/api/ddragon-cdn"
import { UI_TEXTS } from "@/constants/ui-texts"

type SummonerProfileProps = Account

export const SummonerProfile = memo(function SummonerProfile(
	props: SummonerProfileProps
) {

	const {
		data: summoner,
		error: summonerError,
		isPending: isPendingSummoner,
	} = useQuery({
		queryKey: riotQueryKeys.summoner(props.puuid),
		queryFn: () => getSummonerByPUUID({ puuid: props.puuid }),
		select: (data) => data?.data,
	})

	const {
		data: leagueEntry,
		error: leagueEntryError,
		isPending: isPendingLeagueEntry,
	} = useQuery({
		queryKey: riotQueryKeys.leagueEntry(props.puuid),
		queryFn: () => getLeagueEntryByPUUID({ puuid: props.puuid }),
		select: (data) => data?.data,
		enabled: !!summoner,
	})

	const soloQueueEntry = useMemo(() => {
		return leagueEntry?.find(
			(entry) => entry.queueType === "RANKED_SOLO_5x5"
		)
	}, [leagueEntry])

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
									{UI_TEXTS.level}: {summoner?.summonerLevel}
									{soloQueueEntry && (
										<>
											{" | "}
											{soloQueueEntry.tier} {soloQueueEntry.rank} - {soloQueueEntry.leaguePoints} LP
										</>
									)}
								</ItemDescription>
							</ItemContent>
						</Item>
					</ItemGroup>
				)
			)}
			<Matches accountPUUID={props.puuid} />
		</>
	)
})
