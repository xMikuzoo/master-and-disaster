import { exceptionHelper } from "@/helpers/exceptionHelper";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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

export async function axiosRequest<TResponse, TData = void>(
  options: AxiosRequestOptions<TData>,
) {
  try {
    const headers: Record<string, string> = {
      "X-Riot-Token": import.meta.env.VITE_RIOT_API_KEY,
    };
    const result = await axios<TResponse>(options.url, {
      method: options.method,
      data: options.data,
      signal: options.signal,
      params: options.params,
      responseType: options.responseType,
      headers: headers,
    });
    if (options.successMessage) {
      toast.success("sukces", { description: options.successMessage });
    }
    return result;
  } catch (err) {
    const error = err as AxiosError;
    exceptionHelper().showExceptionMessage(error, options.defaultErrorMessage);
  }
  return null;
}
