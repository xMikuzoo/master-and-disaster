import { useState, useCallback, useEffect } from "react"
import { SelectedAccountsContext } from "./selected-accounts-provider-context"
import { STORAGE_KEYS } from "@/constants"
import { TRACKED_PLAYERS } from "@/config/players"

type SelectedAccountsProviderProps = {
	children: React.ReactNode
}

function getDefaultSelectedAccounts(): Record<string, number> {
	return Object.fromEntries(TRACKED_PLAYERS.map((player) => [player.id, 0]))
}

function loadFromStorage(): Record<string, number> {
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_ACCOUNTS)
		if (!stored) return getDefaultSelectedAccounts()

		const parsed = JSON.parse(stored)
		if (typeof parsed !== "object" || parsed === null) {
			return getDefaultSelectedAccounts()
		}

		const defaults = getDefaultSelectedAccounts()
		const result: Record<string, number> = {}

		for (const playerId of Object.keys(defaults)) {
			const value = parsed[playerId]
			if (typeof value === "number" && value >= 0) {
				result[playerId] = value
			} else {
				result[playerId] = 0
			}
		}

		return result
	} catch {
		return getDefaultSelectedAccounts()
	}
}

export function SelectedAccountsProvider({
	children,
}: SelectedAccountsProviderProps) {
	const [selectedAccounts, setSelectedAccounts] =
		useState<Record<string, number>>(loadFromStorage)

	useEffect(() => {
		localStorage.setItem(
			STORAGE_KEYS.SELECTED_ACCOUNTS,
			JSON.stringify(selectedAccounts),
		)
	}, [selectedAccounts])

	const setSelectedAccount = useCallback(
		(playerId: string, index: number) => {
			setSelectedAccounts((prev) => ({
				...prev,
				[playerId]: index,
			}))
		},
		[],
	)

	const value = {
		selectedAccounts,
		setSelectedAccount,
	}

	return (
		<SelectedAccountsContext.Provider value={value}>
			{children}
		</SelectedAccountsContext.Provider>
	)
}
