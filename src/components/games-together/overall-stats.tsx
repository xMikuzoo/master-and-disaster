import { memo, useMemo } from "react"
import { getChampionIcon } from "@/api/ddragon-cdn"
import type { Match } from "@/api/riotgames/types"
import { cn } from "@/utils"

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

interface BestChampion {
	name: string
	wins: number
	games: number
	winrate: number
}

interface WinrateDonutProps {
	percent: number
	wins: number
	losses: number
	total: number
}

const WinrateDonut = memo(function WinrateDonut({
	percent,
	wins,
	losses,
	total,
}: WinrateDonutProps) {
	const size = 80
	const strokeWidth = 8
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const winOffset = circumference - (percent / 100) * circumference

	return (
		<div className="flex flex-col items-center gap-1">
			<div className="relative" style={{ width: size, height: size }}>
				<svg
					width={size}
					height={size}
					className="-rotate-90"
				>
					{/* Background circle (losses) */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="currentColor"
						strokeWidth={strokeWidth}
						className="text-red-500/40"
					/>
					{/* Foreground arc (wins) */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="currentColor"
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={winOffset}
						className="text-green-500 transition-all duration-500"
					/>
				</svg>
				{/* Center text */}
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className={cn(
						"text-lg font-bold",
						percent >= 50 ? "text-green-500" : "text-red-500"
					)}>
						{percent.toFixed(0)}%
					</span>
				</div>
			</div>
			<span className="text-xs text-muted-foreground">
				{total}G {wins}W {losses}L
			</span>
		</div>
	)
})

interface ChampionBadgeProps {
	champion: BestChampion
	playerName: string
	variant: "amber" | "red"
}

const ChampionBadge = memo(function ChampionBadge({
	champion,
	playerName,
	variant,
}: ChampionBadgeProps) {
	const textColor = variant === "amber" ? "text-amber-500" : "text-red-500"

	return (
		<div className="flex flex-col items-center gap-1">
			<div className="flex items-center gap-2">
				<img
					src={getChampionIcon(champion.name)}
					alt={champion.name}
					className="h-8 w-8 rounded"
				/>
				<div className="flex flex-col">
					<span className="text-sm font-medium">
						{champion.winrate.toFixed(0)}% {champion.games}G
					</span>
				</div>
			</div>
			<span className={cn("text-xs font-medium", textColor)}>
				{playerName}
			</span>
		</div>
	)
})

export const OverallStats = memo(function OverallStats({
	matches,
	player1,
	player2,
}: OverallStatsProps) {
	const stats = useMemo(() => {
		if (matches.length === 0) return null

		let p1Kills = 0, p1Deaths = 0, p1Assists = 0
		let p2Kills = 0, p2Deaths = 0, p2Assists = 0
		const p1ChampionMap = new Map<string, { wins: number; games: number }>()
		const p2ChampionMap = new Map<string, { wins: number; games: number }>()

		for (const match of matches) {
			const p1Participant = match.info.participants.find(
				(p) => p.puuid === player1.puuid
			)
			const p2Participant = match.info.participants.find(
				(p) => p.puuid === player2.puuid
			)

			if (p1Participant) {
				p1Kills += p1Participant.kills
				p1Deaths += p1Participant.deaths
				p1Assists += p1Participant.assists

				const champStats = p1ChampionMap.get(p1Participant.championName) || {
					wins: 0,
					games: 0,
				}
				champStats.games++
				if (p1Participant.win) champStats.wins++
				p1ChampionMap.set(p1Participant.championName, champStats)
			}

			if (p2Participant) {
				p2Kills += p2Participant.kills
				p2Deaths += p2Participant.deaths
				p2Assists += p2Participant.assists

				const champStats = p2ChampionMap.get(p2Participant.championName) || {
					wins: 0,
					games: 0,
				}
				champStats.games++
				if (p2Participant.win) champStats.wins++
				p2ChampionMap.set(p2Participant.championName, champStats)
			}
		}

		// Find best champion for each player (by wins, then by winrate if tied)
		const findBestChampion = (
			championMap: Map<string, { wins: number; games: number }>
		): BestChampion | null => {
			let best: BestChampion | null = null
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
					best = {
						name,
						wins: data.wins,
						games: data.games,
						winrate,
					}
				}
			}
			return best
		}

		const p1BestChampion = findBestChampion(p1ChampionMap)
		const p2BestChampion = findBestChampion(p2ChampionMap)

		// Calculate overall winrate (shared - they're on the same team)
		const wins = matches.filter((m) =>
			m.info.participants.find((p) => p.puuid === player1.puuid && p.win)
		).length
		const winrate = (wins / matches.length) * 100

		// Combined KDA (average of both players)
		const totalGames = matches.length
		const avgKills = (p1Kills + p2Kills) / 2 / totalGames
		const avgDeaths = (p1Deaths + p2Deaths) / 2 / totalGames
		const avgAssists = (p1Assists + p2Assists) / 2 / totalGames
		const combinedKda = (avgKills + avgAssists) / Math.max(avgDeaths, 0.1)

		return {
			winrate,
			wins,
			losses: matches.length - wins,
			totalGames: matches.length,
			avgKills,
			avgDeaths,
			avgAssists,
			combinedKda,
			p1BestChampion,
			p2BestChampion,
		}
	}, [matches, player1, player2])

	if (!stats) return null

	return (
		<div className="flex flex-wrap items-center justify-center gap-6 rounded-lg border bg-card p-4 sm:justify-start md:gap-8">
			{/* Winrate Donut */}
			<WinrateDonut
				percent={stats.winrate}
				wins={stats.wins}
				losses={stats.losses}
				total={stats.totalGames}
			/>

			{/* Combined KDA */}
			<div className="flex flex-col items-center sm:items-start">
				<span className="text-sm text-muted-foreground">
					{stats.avgKills.toFixed(1)} / {stats.avgDeaths.toFixed(1)} / {stats.avgAssists.toFixed(1)}
				</span>
				<span className={cn(
					"text-xl font-bold",
					stats.combinedKda >= 3 ? "text-green-500" :
					stats.combinedKda >= 2 ? "text-blue-500" :
					stats.combinedKda >= 1 ? "text-foreground" : "text-red-500"
				)}>
					{stats.combinedKda.toFixed(2)} : 1
				</span>
				<span className="text-xs text-muted-foreground">KDA</span>
			</div>

			{/* Best Champions */}
			{(stats.p1BestChampion || stats.p2BestChampion) && (
				<div className="flex gap-6">
					{stats.p1BestChampion && (
						<ChampionBadge
							champion={stats.p1BestChampion}
							playerName={player1.gameName}
							variant="amber"
						/>
					)}
					{stats.p2BestChampion && (
						<ChampionBadge
							champion={stats.p2BestChampion}
							playerName={player2.gameName}
							variant="red"
						/>
					)}
				</div>
			)}
		</div>
	)
})
