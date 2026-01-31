import { memo, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getChampionIcon } from "@/api/ddragon-cdn"
import type { Match } from "@/api/riotgames/types"
import { UI_TEXTS } from "@/constants/ui-texts"
import { Trophy, Target, Crown } from "lucide-react"

interface PlayerAccount {
	puuid: string
	gameName: string
	tagLine: string
}

interface OverallStatsProps {
	matches: Match[]
	player1: PlayerAccount
	player2: PlayerAccount
}

interface PlayerKDAStats {
	puuid: string
	gameName: string
	kills: number
	deaths: number
	assists: number
	kda: number
	bestChampion: {
		name: string
		wins: number
		games: number
		winrate: number
	} | null
}

export const OverallStats = memo(function OverallStats({
	matches,
	player1,
	player2,
}: OverallStatsProps) {
	const stats = useMemo(() => {
		if (matches.length === 0) return null

		const calculatePlayerStats = (puuid: string, gameName: string): PlayerKDAStats => {
			let kills = 0
			let deaths = 0
			let assists = 0
			const championMap = new Map<string, { wins: number; games: number }>()

			for (const match of matches) {
				const participant = match.info.participants.find(
					(p) => p.puuid === puuid
				)
				if (!participant) continue

				kills += participant.kills
				deaths += participant.deaths
				assists += participant.assists

				const champStats = championMap.get(participant.championName) || {
					wins: 0,
					games: 0,
				}
				champStats.games++
				if (participant.win) champStats.wins++
				championMap.set(participant.championName, champStats)
			}

			// Find best champion (by wins, then by winrate if tied)
			let bestChampion: PlayerKDAStats["bestChampion"] = null
			let maxWins = 0
			let maxWinrate = 0

			for (const [name, data] of championMap) {
				const winrate = (data.wins / data.games) * 100
				if (
					data.wins > maxWins ||
					(data.wins === maxWins && winrate > maxWinrate)
				) {
					maxWins = data.wins
					maxWinrate = winrate
					bestChampion = {
						name,
						wins: data.wins,
						games: data.games,
						winrate,
					}
				}
			}

			return {
				puuid,
				gameName,
				kills,
				deaths,
				assists,
				kda: (kills + assists) / Math.max(deaths, 1),
				bestChampion,
			}
		}

		const p1Stats = calculatePlayerStats(player1.puuid, player1.gameName)
		const p2Stats = calculatePlayerStats(player2.puuid, player2.gameName)

		// Calculate overall winrate
		const wins = matches.filter((m) =>
			m.info.participants.find((p) => p.puuid === player1.puuid && p.win)
		).length
		const winrate = (wins / matches.length) * 100

		// Determine MVP (better KDA)
		const mvp = p1Stats.kda >= p2Stats.kda ? p1Stats : p2Stats

		return {
			winrate,
			wins,
			losses: matches.length - wins,
			player1Stats: p1Stats,
			player2Stats: p2Stats,
			mvp,
		}
	}, [matches, player1, player2])

	if (!stats) return null

	return (
		<Card>
			<CardContent className="pt-4">
				<div className="grid gap-4 sm:grid-cols-3">
					{/* Winrate */}
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
							<Target className="text-primary h-5 w-5" />
						</div>
						<div>
							<div className="text-muted-foreground text-xs">
								{UI_TEXTS.overallWinrate}
							</div>
							<div className="flex items-center gap-2">
								<span className="text-lg font-bold">
									{stats.winrate.toFixed(1)}%
								</span>
								<span className="text-muted-foreground text-xs">
									({stats.wins}W / {stats.losses}L)
								</span>
							</div>
						</div>
					</div>

					{/* Best Champions */}
					<div className="flex items-start gap-3">
						<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
							<Trophy className="text-primary h-5 w-5" />
						</div>
						<div className="space-y-1">
							<div className="text-muted-foreground text-xs">
								{UI_TEXTS.bestChampion}
							</div>
							{[stats.player1Stats, stats.player2Stats].map((pStats) => (
								<div key={pStats.puuid} className="flex items-center gap-2">
									{pStats.bestChampion && (
										<>
											<img
												src={getChampionIcon(pStats.bestChampion.name)}
												alt={pStats.bestChampion.name}
												className="h-5 w-5 rounded"
											/>
											<span className="text-xs font-medium">
												{pStats.gameName}
											</span>
											<Badge variant="secondary" className="text-[10px] px-1.5 py-0">
												{pStats.bestChampion.wins}W/{pStats.bestChampion.games}G
											</Badge>
										</>
									)}
								</div>
							))}
						</div>
					</div>

					{/* MVP */}
					<div className="flex items-center gap-3">
						<div className="bg-yellow-500/10 flex h-10 w-10 items-center justify-center rounded-full">
							<Crown className="h-5 w-5 text-yellow-500" />
						</div>
						<div>
							<div className="text-muted-foreground text-xs">
								{UI_TEXTS.mvp} ({UI_TEXTS.bestKDA})
							</div>
							<div className="flex items-center gap-2">
								<span className="text-lg font-bold">
									{stats.mvp.gameName}
								</span>
								<Badge variant="outline" className="text-xs">
									{stats.mvp.kda.toFixed(2)} KDA
								</Badge>
							</div>
							<div className="text-muted-foreground text-[10px]">
								{stats.mvp.kills}/{stats.mvp.deaths}/{stats.mvp.assists}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
})
