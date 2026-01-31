import { useQueryClient } from "@tanstack/react-query"
import { useState, useCallback, useEffect, useRef } from "react"
import {
	getMatchById,
	getMatchListByPUUID,
	riotQueryKeys,
} from "@/api/riotgames"
import type { Match } from "@/api/riotgames/types"

const TARGET_COUNT = 10

interface UsePlayerMatchesParams {
	puuid: string | undefined
}

interface UsePlayerMatchesResult {
	matches: Match[]
	isLoading: boolean
}

export function usePlayerMatches({
	puuid,
}: UsePlayerMatchesParams): UsePlayerMatchesResult {
	const queryClient = useQueryClient()
	const [matches, setMatches] = useState<Match[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const fetchedMatchIdsRef = useRef<Set<string>>(new Set())
	const initialFetchDoneRef = useRef(false)
	const currentPuuidRef = useRef<string | undefined>(undefined)

	const fetchMatches = useCallback(
		async (targetPuuid: string) => {
			setIsLoading(true)

			try {
				// Fetch match IDs for the player (ranked only)
				const matchListResponse = await getMatchListByPUUID({
					params: { puuid: targetPuuid },
					query: {
						start: 0,
						count: TARGET_COUNT,
						type: "ranked",
					},
				})

				const matchIds = matchListResponse?.data ?? []

				if (matchIds.length === 0) {
					setMatches([])
					return
				}

				const fetchedMatches: Match[] = []

				// Fetch details for each match
				for (const matchId of matchIds) {
					// Skip if already fetched
					if (fetchedMatchIdsRef.current.has(matchId)) continue

					fetchedMatchIdsRef.current.add(matchId)

					// Try to get from cache first
					const cachedMatch = queryClient.getQueryData<{
						data: Match
					}>(riotQueryKeys.matchDetails(matchId))

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

					if (match) {
						fetchedMatches.push(match)
					}
				}

				setMatches(fetchedMatches)
			} finally {
				setIsLoading(false)
			}
		},
		[queryClient]
	)

	// Initial fetch when puuid is available
	useEffect(() => {
		if (puuid && (!initialFetchDoneRef.current || currentPuuidRef.current !== puuid)) {
			initialFetchDoneRef.current = true
			currentPuuidRef.current = puuid
			// Reset state for fresh fetch
			fetchedMatchIdsRef.current = new Set()
			setMatches([])
			fetchMatches(puuid)
		}
	}, [puuid, fetchMatches])

	// Reset when puuid changes
	useEffect(() => {
		return () => {
			initialFetchDoneRef.current = false
		}
	}, [puuid])

	return {
		matches,
		isLoading,
	}
}
