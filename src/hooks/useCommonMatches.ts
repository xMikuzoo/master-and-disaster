import { useState, useCallback, useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
	getMatchById,
	getMatchListByPUUID,
	riotQueryKeys,
} from "@/api/riotgames"
import type { Match } from "@/api/riotgames/types"

const BATCH_SIZE = 20
const TARGET_COUNT = 10

interface UseCommonMatchesParams {
	puuid1: string | undefined
	puuid2: string | undefined
}

interface UseCommonMatchesResult {
	commonMatches: Match[]
	isLoading: boolean
	isFetchingMore: boolean
	hasMore: boolean
	fetchMore: () => void
}

export function useCommonMatches({
	puuid1,
	puuid2,
}: UseCommonMatchesParams): UseCommonMatchesResult {
	const queryClient = useQueryClient()
	const [commonMatches, setCommonMatches] = useState<Match[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isFetchingMore, setIsFetchingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const startIndexRef = useRef(0)
	const fetchedMatchIdsRef = useRef<Set<string>>(new Set())
	const initialFetchDoneRef = useRef(false)
	const commonMatchesRef = useRef<Match[]>([])

	// Keep ref in sync with state
	useEffect(() => {
		commonMatchesRef.current = commonMatches
	}, [commonMatches])

	const fetchCommonMatches = useCallback(
		async (isInitial: boolean) => {
			if (!puuid1 || !puuid2) return

			if (isInitial) {
				setIsLoading(true)
				commonMatchesRef.current = []
			} else {
				setIsFetchingMore(true)
			}

			const currentMatches = commonMatchesRef.current
			const targetTotal = isInitial
				? TARGET_COUNT
				: currentMatches.length + TARGET_COUNT
			let foundCommon: Match[] = isInitial ? [] : [...currentMatches]
			let currentStart = startIndexRef.current

			try {
				while (foundCommon.length < targetTotal) {
					// Fetch batch of match IDs for player 1
					const matchListResponse = await getMatchListByPUUID({
						params: { puuid: puuid1 },
						query: {
							start: currentStart,
							count: BATCH_SIZE,
							type: "ranked",
						},
					})

					const matchIds = matchListResponse?.data ?? []

					// No more matches available
					if (matchIds.length === 0) {
						setHasMore(false)
						break
					}

					// Fetch details for each match
					for (const matchId of matchIds) {
						// Skip already fetched matches
						if (fetchedMatchIdsRef.current.has(matchId)) continue

						fetchedMatchIdsRef.current.add(matchId)

						// Try to get from cache first
						const cachedMatch = queryClient.getQueryData<{ data: Match }>(
							riotQueryKeys.matchDetails(matchId)
						)

						let match: Match | undefined

						if (cachedMatch) {
							match = cachedMatch.data
						} else {
							const matchResponse = await getMatchById({ matchId })
							match = matchResponse?.data

							// Cache the match for later use
							if (matchResponse) {
								queryClient.setQueryData(
									riotQueryKeys.matchDetails(matchId),
									matchResponse
								)
							}
						}

						if (!match) continue

						// Check if both players participated
						const participants = match.metadata.participants
						if (
							participants.includes(puuid1) &&
							participants.includes(puuid2)
						) {
							foundCommon.push(match)
							commonMatchesRef.current = [...foundCommon]

							// Update state incrementally for better UX
							setCommonMatches([...foundCommon])

							if (foundCommon.length >= targetTotal) {
								break
							}
						}
					}

					currentStart += BATCH_SIZE

					// If we didn't get a full batch, there are no more matches
					if (matchIds.length < BATCH_SIZE) {
						setHasMore(false)
						break
					}
				}

				startIndexRef.current = currentStart
			} finally {
				setIsLoading(false)
				setIsFetchingMore(false)
			}
		},
		[puuid1, puuid2, queryClient]
	)

	// Initial fetch when puuids are available
	useEffect(() => {
		if (puuid1 && puuid2 && !initialFetchDoneRef.current) {
			initialFetchDoneRef.current = true
			// Reset state for fresh fetch
			startIndexRef.current = 0
			fetchedMatchIdsRef.current = new Set()
			setCommonMatches([])
			setHasMore(true)
			fetchCommonMatches(true)
		}
	}, [puuid1, puuid2, fetchCommonMatches])

	// Reset when puuids change
	useEffect(() => {
		return () => {
			initialFetchDoneRef.current = false
		}
	}, [puuid1, puuid2])

	const fetchMore = useCallback(() => {
		if (!isFetchingMore && hasMore) {
			fetchCommonMatches(false)
		}
	}, [isFetchingMore, hasMore, fetchCommonMatches])

	return {
		commonMatches,
		isLoading,
		isFetchingMore,
		hasMore,
		fetchMore,
	}
}
