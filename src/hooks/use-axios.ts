import { exceptionHelper } from "@/utils"
import axios, { AxiosError, type AxiosResponse } from "axios"
import { toast } from "sonner"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text"

interface AxiosRequestOptions<TData> {
	url: string
	method: HttpMethod
	data?: TData
	signal?: AbortSignal
	defaultErrorMessage: string
	params?: URLSearchParams
	responseType?: ResponseType
	successMessage?: string
	/** If true, don't show toast on error */
	silent?: boolean
}

export interface AxiosRequestResult<TResponse> {
	data: TResponse | null
	error: AxiosError | null
	response: AxiosResponse<TResponse> | null
}

function isAxiosError(error: unknown): error is AxiosError {
	return axios.isAxiosError(error)
}

export async function axiosRequest<TResponse, TData = void>(
	options: AxiosRequestOptions<TData>
): Promise<AxiosResponse<TResponse> | null> {
	try {
		const headers: Record<string, string> = {}
		const result = await axios<TResponse>(options.url, {
			method: options.method,
			data: options.data,
			signal: options.signal,
			params: options.params,
			responseType: options.responseType,
			headers: headers,
		})
		if (options.successMessage) {
			toast.success("Success", { description: options.successMessage })
		}
		return result
	} catch (err) {
		if (!options.silent) {
			const error = isAxiosError(err) ? err : new AxiosError(String(err))
			exceptionHelper().showExceptionMessage(
				error,
				options.defaultErrorMessage
			)
		}
	}
	return null
}

/**
 * Enhanced version that returns both data and error for better error handling
 */
export async function axiosRequestWithError<TResponse, TData = void>(
	options: AxiosRequestOptions<TData>
): Promise<AxiosRequestResult<TResponse>> {
	try {
		const headers: Record<string, string> = {}
		const result = await axios<TResponse>(options.url, {
			method: options.method,
			data: options.data,
			signal: options.signal,
			params: options.params,
			responseType: options.responseType,
			headers: headers,
		})
		if (options.successMessage) {
			toast.success("Success", { description: options.successMessage })
		}
		return { data: result.data, error: null, response: result }
	} catch (err) {
		const error = isAxiosError(err) ? err : new AxiosError(String(err))
		if (!options.silent) {
			exceptionHelper().showExceptionMessage(
				error,
				options.defaultErrorMessage
			)
		}
		return { data: null, error, response: null }
	}
}
