const API_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status }
}

export function notifyError(message: string) {
  window.dispatchEvent(new CustomEvent('woofy-error', { detail: message }))
}

// Event handlers consume rejections after the API has shown an actionable error.
export function runAction(action: Promise<unknown>) { void action.catch(() => {}) }

export async function apiRequest<T>(path: string, options: RequestInit = {}, quiet = false): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options, credentials: 'include', signal: options.signal ?? AbortSignal.timeout(100000),
      headers: { 'Content-Type': 'application/json', 'X-Woofy-Client': 'woofy', ...options.headers },
    })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})) as { detail?: string | Array<{ msg: string }> }
      const detail = typeof payload.detail === 'string' ? payload.detail : payload.detail?.map((item) => item.msg).join(' ')
      if (response.status === 401 && !path.startsWith('/auth')) window.dispatchEvent(new Event('woofy-session-expired'))
      throw new ApiError(detail || 'Não foi possível concluir a solicitação.', response.status)
    }
    return response.status === 204 ? undefined as T : response.json() as Promise<T>
  } catch (reason) {
    const error = reason instanceof ApiError ? reason : new ApiError('Não foi possível conectar ao Woofy. Tente novamente.', 0)
    if (!quiet) notifyError(error.message)
    throw error
  }
}
