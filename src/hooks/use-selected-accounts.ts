import { useContext } from "react"
import { SelectedAccountsContext } from "@/providers/selected-accounts-provider-context"

export const useSelectedAccounts = () => {
	const context = useContext(SelectedAccountsContext)
	if (context === undefined)
		throw new Error(
			"useSelectedAccounts must be used within a SelectedAccountsProvider",
		)
	return context
}
