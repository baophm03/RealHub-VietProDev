import { AxiosError, AxiosRequestConfig } from 'axios'
import { apiClient } from '../config/custom-client'

type CustomClientOptions = RequestInit

const isHeadersInstance = (headers: unknown): headers is Headers => {
  return typeof Headers !== 'undefined' && headers instanceof Headers
}

const normalizeOptions = (options?: CustomClientOptions): AxiosRequestConfig => {
  if (!options) {
    return {}
  }

  const normalizedHeaders = isHeadersInstance(options.headers)
    ? (() => {
      const headers: Record<string, string> = {}
      options.headers.forEach((value, key) => {
        headers[key] = value
      })
      return headers
    })()
    : Array.isArray(options.headers)
      ? Object.fromEntries(options.headers)
      : options.headers

  const requestInitBody = options.body
  const normalizedSignal = options.signal ?? undefined

  return {
    ...options,
    headers: normalizedHeaders as AxiosRequestConfig['headers'],
    ...(normalizedSignal !== undefined ? { signal: normalizedSignal } : { signal: undefined }),
    ...(requestInitBody !== undefined ? { data: requestInitBody } : {})
  }
}

const useCustomClient = <T>(urlOrConfig: string | AxiosRequestConfig, options?: CustomClientOptions): Promise<T> => {
  const abortController = new AbortController()

  const mergedConfig: AxiosRequestConfig = typeof urlOrConfig === 'string'
    ? {
      url: urlOrConfig,
      ...normalizeOptions(options)
    }
    : {
      ...urlOrConfig,
      ...normalizeOptions(options)
    }

  if (!mergedConfig.signal) {
    mergedConfig.signal = abortController.signal
  }

  const promise = apiClient(mergedConfig).then(({ data, status }) => {
    if (data === undefined || data === null) {
      return { statusCode: status } as T
    }

    return { ...data, statusCode: status }
  })

  // @ts-expect-error expose cancel for consumers that still expect it
  promise.cancel = () => abortController.abort()

  return promise
}

export { useCustomClient }

export type ErrorType<Error> = AxiosError<Error>

export type BodyType<BodyData> = BodyData
