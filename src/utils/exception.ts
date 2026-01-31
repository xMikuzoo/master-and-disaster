import { AxiosError } from "axios"
import { toast } from "sonner"
import { UI_TEXTS } from "@/constants/ui-texts"

export function exceptionHelper() {
	function showExceptionMessage(error: AxiosError, defaultMessage: string) {
		if (!error.response) {
			toast.error(UI_TEXTS.networkError, {
				description: UI_TEXTS.unableToConnect,
			})
			return
		}
		toast.error(error.status?.toString() ?? "Error", {
			description: error.message ?? defaultMessage,
		})
	}
	return {
		showExceptionMessage,
	}
}
