export function formatTimeAgo(timestamp: number): string {
	const now = Date.now()
	const diff = now - timestamp

	const minutes = Math.floor(diff / 60000)
	const hours = Math.floor(diff / 3600000)
	const days = Math.floor(diff / 86400000)

	if (days > 0) return `${days} dni temu`
	if (hours > 0) return `${hours} godz. temu`
	return `${minutes} min temu`
}

export function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}m ${secs}s`
}
