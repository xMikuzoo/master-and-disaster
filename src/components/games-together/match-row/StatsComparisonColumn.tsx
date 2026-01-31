import { memo } from "react"
import { Crosshair, Coins, Flame, Eye, type LucideIcon } from "lucide-react"
import { cn, formatCompactNumber, getTotalCS } from "@/utils"
import { UI_TEXTS } from "@/constants/ui-texts"
import type { ParticipantDto } from "@/api/riotgames/types/match.types"

interface StatsComparisonColumnProps {
	master: ParticipantDto
	disaster: ParticipantDto
}

interface StatBarProps {
	icon: LucideIcon
	label: string
	masterValue: number
	disasterValue: number
}

const StatBar = memo(function StatBar({
	icon: Icon,
	label,
	masterValue,
	disasterValue,
}: StatBarProps) {
	const total = masterValue + disasterValue
	const masterPercent = total > 0 ? (masterValue / total) * 100 : 50

	return (
		<div className="flex flex-col gap-0.5">
			{/* Values and label */}
			<div className="flex items-center justify-between text-xs">
				<span className="w-12 text-right font-medium text-amber-500">
					{formatCompactNumber(masterValue)}
				</span>
				<div className="text-muted-foreground flex items-center gap-1">
					<Icon className="h-3 w-3" />
					<span>{label}</span>
				</div>
				<span className="w-12 font-medium text-red-500">
					{formatCompactNumber(disasterValue)}
				</span>
			</div>
			{/* Bar */}
			<div className="flex h-1.5 w-full overflow-hidden rounded-full">
				<div
					className={cn(
						"bg-amber-500 transition-all",
						masterValue > disasterValue && "bg-amber-400"
					)}
					style={{ width: `${masterPercent}%` }}
				/>
				<div
					className={cn(
						"bg-red-500 transition-all",
						disasterValue > masterValue && "bg-red-400"
					)}
					style={{ width: `${100 - masterPercent}%` }}
				/>
			</div>
		</div>
	)
})

export const StatsComparisonColumn = memo(function StatsComparisonColumn({
	master,
	disaster,
}: StatsComparisonColumnProps) {
	const stats = [
		{
			icon: Crosshair,
			label: UI_TEXTS.cs,
			masterValue: getTotalCS(master),
			disasterValue: getTotalCS(disaster),
		},
		{
			icon: Coins,
			label: UI_TEXTS.gold,
			masterValue: master.goldEarned,
			disasterValue: disaster.goldEarned,
		},
		{
			icon: Flame,
			label: UI_TEXTS.damage,
			masterValue: master.totalDamageDealtToChampions,
			disasterValue: disaster.totalDamageDealtToChampions,
		},
		{
			icon: Eye,
			label: UI_TEXTS.vision,
			masterValue: master.visionScore,
			disasterValue: disaster.visionScore,
		},
	]

	return (
		<div className="flex w-32 shrink-0 flex-col justify-center gap-2">
			{stats.map((stat) => (
				<StatBar
					key={stat.label}
					icon={stat.icon}
					label={stat.label}
					masterValue={stat.masterValue}
					disasterValue={stat.disasterValue}
				/>
			))}
		</div>
	)
})
