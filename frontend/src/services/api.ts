const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

interface ApiErrorPayload {
  detail?: string
  message?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = window.localStorage.getItem('woofy_access_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as ApiErrorPayload
    throw new ApiError(payload.detail ?? payload.message ?? 'Não foi possível concluir a solicitação.', response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
