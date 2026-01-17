import { exceptionHelper } from "@/helpers/exceptionHelper";
import axios, { AxiosError } from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text";

interface AxiosRequestOptions<TData> {
  url: string;
  method: HttpMethod;
  data?: TData;
  signal?: AbortSignal;
  defaultErrorMessage: string;
  params?: URLSearchParams;
  responseType?: ResponseType;
  successMessage?: string;
}

export async function useAxios<TResponse, TData = void>(
  options: AxiosRequestOptions<TData>,
) {
  try {
    const headers: Record<string, string> = {};
    const result = await axios<TResponse>(options.url, {
      method: options.method,
      data: options.data,
      signal: options.signal,
      params: options.params,
      responseType: options.responseType,
      headers,
    });
    if (options.successMessage) {
      console.log("Success message:", options.successMessage);
    }
    return result;
  } catch (err) {
    const error = err as AxiosError;
    exceptionHelper().showExceptionMessage(error, options.defaultErrorMessage);
  }
  return null;
}
