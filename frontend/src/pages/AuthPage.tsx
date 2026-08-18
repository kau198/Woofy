import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, PawPrint, UserRound } from 'lucide-react'
import { m } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const { setUserName } = useWoofy()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const isRegister = mode === 'register'

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name.trim()) setUserName(name.trim().split(' ')[0])
    navigate(isRegister ? '/adocao' : '/app')
  }

  return (
    <m.main id="main-content" className="auth-page" tabIndex={-1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.32 }}>
      <m.section className="auth-visual-panel" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
        <Link className="auth-back" to="/"><ArrowLeft size={18} /> Voltar para o início</Link>
        <div className="auth-visual-content">
          <span className="auth-kicker">UM AMIGO PARA A VIDA REAL</span>
          <h1>{isRegister ? 'Seu novo companheiro está quase aqui.' : 'Que bom ter você de volta.'}</h1>
          <p>{isRegister ? 'Crie sua conta e adote um Golden Retriever que vai acompanhar cada pequeno passo.' : 'Seu companheiro guardou seu cantinho e está pronto para continuar de onde vocês pararam.'}</p>
          <div className="auth-mascot-stage"><Mascot size="xl" state={isRegister ? 'happy' : 'normal'} /><m.div className="auth-bubble" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.32 }}>{isRegister ? 'Estou esperando por você.' : 'Senti sua falta! Vamos juntos?'}</m.div></div>
        </div>
        <p className="auth-quote">“O Woofy incentiva, mas nunca julga.”</p>
      </m.section>
      <m.section className="auth-form-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
        <div className="auth-mobile-brand"><BrandMark /></div>
        <div className="auth-form-wrap">
          <div className="auth-form-heading">
            <m.span className="auth-paw" initial={{ scale: 0.88, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}><PawPrint aria-hidden="true" /></m.span>
            <h2>{isRegister ? 'Crie sua conta' : 'Entre na sua conta'}</h2>
            <p>{isRegister ? 'Leva menos de dois minutos.' : 'Seu companheiro está esperando.'}</p>
          </div>
          <m.form className="auth-form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16, duration: 0.32 }}>
            {isRegister && <label>Seu nome<div className="input-wrap"><UserRound size={19} /><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" /></div></label>}
            <label>E-mail<div className="input-wrap"><Mail size={19} /><input required type="email" placeholder="voce@exemplo.com" /></div></label>
            <label>Senha<div className="input-wrap"><LockKeyhole size={19} /><input required type={showPassword ? 'text' : 'password'} placeholder={isRegister ? 'Mínimo de 8 caracteres' : 'Sua senha'} /><m.button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} whileTap={{ scale: 0.9 }}>{showPassword ? <EyeOff /> : <Eye />}</m.button></div></label>
            {isRegister && <label>Confirme sua senha<div className="input-wrap"><LockKeyhole size={19} /><input required type={showPassword ? 'text' : 'password'} placeholder="Digite a senha novamente" /></div></label>}
            {!isRegister && <div className="form-meta"><label className="checkbox-label"><input type="checkbox" /> Lembrar de mim</label><a href="#recuperar">Esqueci minha senha</a></div>}
            {isRegister && <div className="password-hint"><CheckCircle2 size={15} /> Use pelo menos 8 caracteres</div>}
            <m.button className="button button-primary button-block" type="submit" whileTap={{ scale: 0.98 }}>{isRegister ? 'Criar conta e conhecer meu pet' : 'Entrar'} <ArrowRight size={18} /></m.button>
          </m.form>
          <div className="divider"><span>ou continue com</span></div>
          <button className="google-button" type="button" disabled><GoogleMark /> Google <small>em breve</small></button>
          <p className="auth-switch">{isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <Link to={isRegister ? '/entrar' : '/criar-conta'}>{isRegister ? 'Entrar' : 'Criar conta'}</Link></p>
          {isRegister && <p className="auth-terms">Ao continuar, você concorda com nossos <Link to="/termos">Termos de Uso</Link> e <Link to="/privacidade">Política de Privacidade</Link>.</p>}
        </div>
      </m.section>
    </m.main>
  )
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.31v2.77h3.56c2.09-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#fbbc05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.08H2.18A11 11 0 0 0 1 12c0 1.77.42 3.44 1.18 4.93l3.66-2.84Z" />
      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.58 10.58 0 0 0 12 1a11 11 0 0 0-9.82 6.07L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  )
}
