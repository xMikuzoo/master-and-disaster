import { createContext } from "react"

export type SelectedAccountsState = {
	selectedAccounts: Record<string, number>
	setSelectedAccount: (playerId: string, index: number) => void
}

const initialState: SelectedAccountsState = {
	selectedAccounts: {},
	setSelectedAccount: () => null,
}

export const SelectedAccountsContext =
	createContext<SelectedAccountsState>(initialState)
