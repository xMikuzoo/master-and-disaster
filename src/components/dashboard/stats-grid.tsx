import { memo } from "react"
import {
	Swords,
	Target,
	Coins,
	Eye,
	TrendingUp,
	Crosshair,
} from "lucide-react"
import { cn } from "@/utils"

interface StatTileProps {
	icon: React.ReactNode
	value: string
	label: string
	subValue?: string
	colorClass?: string
}

function StatTile({ icon, value, label, subValue, colorClass }: StatTileProps) {
	return (
		<div className="bg-muted/50 rounded-lg p-3 text-center">
			<div
				className={cn(
					"mb-1 flex items-center justify-center",
					colorClass
				)}
			>
				{icon}
			</div>
			<div className="text-lg font-bold">{value}</div>
			{subValue && (
				<div className="text-muted-foreground text-xs">{subValue}</div>
			)}
			<div className="text-muted-foreground mt-1 text-xs">{label}</div>
		</div>
	)
}

interface StatsGridProps {
	winRate: number
	avgKDA: number
	avgKills: number
	avgDeaths: number
	avgAssists: number
	avgCSPerMin: number
	avgDamagePerMin: number
	avgVisionPerMin: number
	avgGoldPerMin: number
}

export const StatsGrid = memo(function StatsGrid({
	winRate,
	avgKDA,
	avgKills,
	avgDeaths,
	avgAssists,
	avgCSPerMin,
	avgDamagePerMin,
	avgVisionPerMin,
	avgGoldPerMin,
}: StatsGridProps) {
	const winRateColor =
		winRate >= 60
			? "text-green-500"
			: winRate >= 50
				? "text-yellow-500"
				: "text-red-500"

	const kdaColor =
		avgKDA >= 4
			? "text-green-500"
			: avgKDA >= 2.5
				? "text-yellow-500"
				: "text-red-500"

	return (
		<div className="grid grid-cols-3 gap-2">
			<StatTile
				icon={<TrendingUp className="h-4 w-4" />}
				value={`${winRate.toFixed(0)}%`}
				label="Win Rate"
				colorClass={winRateColor}
			/>
			<StatTile
				icon={<Crosshair className="h-4 w-4" />}
				value={avgKDA.toFixed(2)}
				label="KDA"
				subValue={`${avgKills.toFixed(1)}/${avgDeaths.toFixed(1)}/${avgAssists.toFixed(1)}`}
				colorClass={kdaColor}
			/>
			<StatTile
				icon={<Swords className="h-4 w-4" />}
				value={avgCSPerMin.toFixed(1)}
				label="CS/min"
				colorClass="text-blue-500"
			/>
			<StatTile
				icon={<Target className="h-4 w-4" />}
				value={avgDamagePerMin.toFixed(0)}
				label="DMG/min"
				colorClass="text-orange-500"
			/>
			<StatTile
				icon={<Eye className="h-4 w-4" />}
				value={avgVisionPerMin.toFixed(2)}
				label="Vision/min"
				colorClass="text-purple-500"
			/>
			<StatTile
				icon={<Coins className="h-4 w-4" />}
				value={avgGoldPerMin.toFixed(0)}
				label="Gold/min"
				colorClass="text-yellow-500"
			/>
		</div>
	)
})
