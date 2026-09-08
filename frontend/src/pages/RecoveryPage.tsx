import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { apiRequest } from '../services/api'

export function RecoveryPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const result = await apiRequest<{ message: string }>(token ? '/auth/reset-password' : '/auth/forgot-password', {
        method: 'POST', body: JSON.stringify(token ? { token, password } : { email }),
      }, true)
      setMessage(result.message)
    } catch (reason) { setError((reason as Error).message) }
    finally { setBusy(false) }
  }
  return <main id="main-content" className="recovery-page"><BrandMark /><form className="task-modal" onSubmit={submit}>
    <h1>{token ? 'Crie uma nova senha' : 'Recupere seu acesso'}</h1>
    <p>{token ? 'Use pelo menos 8 caracteres.' : 'Enviaremos um link para o e-mail da sua conta.'}</p>
    {message ? <p role="status">{message}</p> : <>{token ? <label>Nova senha<input required type="password" minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label> : <label>E-mail<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
    {error && <p role="alert">{error}</p>}<button className="button button-primary" disabled={busy}>{busy ? 'Aguarde...' : token ? 'Salvar senha' : 'Enviar link'}</button></>}
    <Link to="/entrar">Voltar para entrar</Link></form></main>
}
