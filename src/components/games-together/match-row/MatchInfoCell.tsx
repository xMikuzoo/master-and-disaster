import { memo } from "react"
import { cn, getQueueNameById, formatTimeAgo, formatDuration } from "@/utils"
import { UI_TEXTS } from "@/constants/ui-texts"

interface MatchInfoCellProps {
	queueId: number
	gameStartTimestamp: number
	gameDuration: number
	didWin: boolean
}

export const MatchInfoCell = memo(function MatchInfoCell({
	queueId,
	gameStartTimestamp,
	gameDuration,
	didWin,
}: MatchInfoCellProps) {
	return (
		<div className="flex min-w-[120px] flex-col justify-center gap-1 px-4 py-3">
			<div className="text-xs font-medium">{getQueueNameById(queueId)}</div>
			<div className="text-muted-foreground text-xs">
				{formatTimeAgo(gameStartTimestamp)}
			</div>
			<div
				className={cn(
					"mt-1 text-sm font-bold",
					didWin ? "text-green-500" : "text-red-500"
				)}
			>
				{didWin ? UI_TEXTS.victory : UI_TEXTS.defeat}
			</div>
			<div className="text-muted-foreground text-xs">
				{formatDuration(gameDuration)}
			</div>
		</div>
	)
})
