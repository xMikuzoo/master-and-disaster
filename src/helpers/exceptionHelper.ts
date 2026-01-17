import { AxiosError } from "axios";

export function exceptionHelper() {
  function showExceptionMessage(
    error: AxiosError,
    message: string,
    additionalInternalMessage?: string,
  ) {
    if (!error.response) {
      return;
    }

    console.log(
      "Unknown error format:",
      error.response.data,
      message,
      additionalInternalMessage,
    );
  }

  return {
    showExceptionMessage,
  };
}
