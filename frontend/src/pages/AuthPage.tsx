import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Pause, Play, UserRound } from 'lucide-react'
import { m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { useWoofy } from '../contexts/WoofyContext'
import { apiRequest, ApiError } from '../services/api'

declare global {
  interface Window {
    google?: { accounts: { id: { initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void; renderButton: (element: HTMLElement, options: Record<string, unknown>) => void } } }
  }
}

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const { login, register, loginWithGoogle } = useWoofy()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const isRegister = mode === 'register'
  const [googleClientId, setGoogleClientId] = useState('')
  useEffect(() => { void apiRequest<{ googleClientId: string }>('/meta', {}, true).then((meta) => setGoogleClientId(meta.googleClientId)).catch(() => {}) }, [])

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return
    const render = () => {
      if (!window.google || !googleButtonRef.current) return
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => {
          setSubmitting(true)
          setError('')
          void loginWithGoogle(credential)
            .then(() => navigate('/app'))
            .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Não foi possível entrar com o Google.'))
            .finally(() => setSubmitting(false))
        },
      })
      window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large', width: 360, text: isRegister ? 'signup_with' : 'signin_with', locale: 'pt-BR' })
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity]')
    if (existing) { render(); existing.addEventListener('load', render); return () => existing.removeEventListener('load', render) }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.dataset.googleIdentity = 'true'
    script.addEventListener('load', render)
    document.head.appendChild(script)
    return () => script.removeEventListener('load', render)
  }, [googleClientId, isRegister, loginWithGoogle, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (isRegister && password !== confirmation) { setError('As senhas não coincidem.'); return }
    setSubmitting(true)
    try {
      if (isRegister) await register(name, email, password)
      else await login(email, password)
      navigate(isRegister ? '/adocao' : '/app')
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : 'Não foi possível entrar agora. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <m.main id="main-content" className="auth-page" tabIndex={-1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.32 }}>
      <div className="auth-video-shell" aria-hidden="true">
        <video
          ref={videoRef}
          className="auth-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={`${import.meta.env.BASE_URL}mascots/doug-real-idle.webp`}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
        >
          <source src={`${import.meta.env.BASE_URL}videos/doug-running.mp4`} type="video/mp4" />
        </video>
        <div className="auth-video-grade" />
      </div>

      <header className="auth-topbar">
        <div className="auth-brand-link"><BrandMark /></div>
        <Link className="auth-back" to="/"><ArrowLeft size={16} /> Voltar</Link>
      </header>

      <m.section className="auth-story" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}>
        <span className="auth-kicker"><i /> ROTINA BOA TEM COMPANHIA</span>
        <h1>{isRegister ? 'Um passo de cada vez. Sempre juntos.' : 'Doug estava esperando por você.'}</h1>
        <p>{isRegister ? 'Crie seu espaço, adote seu companheiro e transforme pequenas metas em dias que dão orgulho.' : 'Continue sua rotina no seu ritmo — sem pressão, sem julgamento e com muita companhia.'}</p>
      </m.section>

      <m.section className="auth-form-panel" aria-label={isRegister ? 'Criar conta' : 'Entrar'} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.48, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
        <div className="auth-form-wrap">
          <div className="auth-form-heading">
            <span className="auth-form-eyebrow">{isRegister ? 'COMECE AGORA' : 'BEM-VINDO DE VOLTA'}</span>
            <h2>{isRegister ? 'Crie sua conta' : 'Entre na sua conta'}</h2>
            <p>{isRegister ? 'Leva menos de dois minutos.' : 'Seu cantinho continua do mesmo jeito.'}</p>
          </div>
          <m.form className="auth-form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16, duration: 0.32 }}>
            {isRegister && <label>Seu nome<div className="input-wrap"><UserRound size={19} /><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" /></div></label>}
            <label>E-mail<div className="input-wrap"><Mail size={19} /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" /></div></label>
            <label>Senha<div className="input-wrap"><LockKeyhole size={19} /><input required minLength={isRegister ? 8 : undefined} autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} placeholder={isRegister ? 'Mínimo de 8 caracteres' : 'Sua senha'} /><m.button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} whileTap={{ scale: 0.9 }}>{showPassword ? <EyeOff /> : <Eye />}</m.button></div></label>
            {isRegister && <label>Confirme sua senha<div className="input-wrap"><LockKeyhole size={19} /><input required minLength={8} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Digite a senha novamente" /></div></label>}
            {!isRegister && <div className="form-meta"><span>Sua sessão fica protegida neste dispositivo.</span><Link to="/recuperar">Esqueci minha senha</Link></div>}
            {isRegister && <div className="password-hint"><CheckCircle2 size={15} /> Use pelo menos 8 caracteres</div>}
            {error && <div className="auth-error" role="alert">{error}</div>}
            <m.button className="button button-primary button-block" type="submit" disabled={submitting} whileTap={{ scale: 0.98 }}>{submitting ? 'Só um instante...' : isRegister ? 'Criar conta e conhecer meu pet' : 'Entrar'} {!submitting && <ArrowRight size={18} />}</m.button>
          </m.form>
          {googleClientId && <><div className="divider"><span>ou continue com</span></div><div className="google-identity-button" ref={googleButtonRef} aria-label="Continuar com Google" /></>}
          <p className="auth-switch">{isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <Link to={isRegister ? '/entrar' : '/criar-conta'}>{isRegister ? 'Entrar' : 'Criar conta'}</Link></p>
          {isRegister && <p className="auth-terms">Ao continuar, você concorda com nossos <Link to="/termos">Termos de Uso</Link> e <Link to="/privacidade">Política de Privacidade</Link>.</p>}
        </div>
      </m.section>

      <span className="auth-film-credit">VÍDEO: YAROSLAV BILGOVSKIY / PEXELS</span>
      <button className="auth-video-control" type="button" onClick={toggleVideo} aria-label={isVideoPlaying ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}>
        {isVideoPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        <span>{isVideoPlaying ? 'Pausar cena' : 'Reproduzir cena'}</span>
      </button>
    </m.main>
  )
}
