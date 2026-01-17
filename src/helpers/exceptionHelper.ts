import { AxiosError } from "axios";
import { toast } from "sonner";

export function exceptionHelper() {
  function showExceptionMessage(error: AxiosError, defaultMessage: string) {
    if (!error.response) {
      return;
    }
    toast.error(error.status, {
      description: error.message ?? defaultMessage,
    });
  }
  return {
    showExceptionMessage,
  };
}
