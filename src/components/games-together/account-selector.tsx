import { memo } from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { AccountInfo } from "@/config/players"

interface AccountSelectorProps {
	accounts: AccountInfo[]
	selectedIndex: number
	onSelect: (index: number) => void
}

export const AccountSelector = memo(function AccountSelector({
	accounts,
	selectedIndex,
	onSelect,
}: AccountSelectorProps) {
	if (accounts.length === 1) {
		return (
			<span className="text-muted-foreground text-xs">
				{accounts[0].gameName}#{accounts[0].tagLine}
			</span>
		)
	}

	return (
		<Select
			value={String(selectedIndex)}
			onValueChange={(value) => onSelect(Number(value))}
		>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{accounts.map((account, index) => (
					<SelectItem key={index} value={String(index)}>
						{account.gameName}#{account.tagLine}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
})
