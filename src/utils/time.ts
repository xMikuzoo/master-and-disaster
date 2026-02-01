import { UI_TEXTS } from "@/constants/ui-texts"

// Time constants in milliseconds
const MS_PER_MINUTE = 60000
const MS_PER_HOUR = 3600000
const MS_PER_DAY = 86400000

export function formatTimeAgo(timestamp: number): string {
	const now = Date.now()
	const diff = now - timestamp

	const minutes = Math.floor(diff / MS_PER_MINUTE)
	const hours = Math.floor(diff / MS_PER_HOUR)
	const days = Math.floor(diff / MS_PER_DAY)

	if (days > 0) return `${days} ${UI_TEXTS.daysAgo}`
	if (hours > 0) return `${hours} ${UI_TEXTS.hoursAgo}`
	return `${minutes} ${UI_TEXTS.minutesAgo}`
}

export function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}m ${secs}s`
}
