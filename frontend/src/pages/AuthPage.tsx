import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
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
    <main className="auth-page">
      <section className="auth-visual-panel">
        <Link className="auth-back" to="/"><ArrowLeft size={18} /> Voltar para o início</Link>
        <div className="auth-visual-content">
          <span className="auth-kicker">UM AMIGO PARA A VIDA REAL</span>
          <h1>{isRegister ? 'Seu novo companheiro está quase aqui.' : 'Que bom ter você de volta.'}</h1>
          <p>{isRegister ? 'Crie sua conta e adote um Golden Retriever que vai acompanhar cada pequeno passo.' : 'Seu companheiro guardou seu cantinho e está pronto para continuar de onde vocês pararam.'}</p>
          <div className="auth-mascot-stage"><Mascot size="xl" state={isRegister ? 'happy' : 'normal'} /><div className="auth-bubble">{isRegister ? 'Estou esperando por você! 🐾' : 'Senti sua falta! Vamos juntos?'}</div></div>
        </div>
        <p className="auth-quote">“O Woofy incentiva, mas nunca julga.”</p>
      </section>
      <section className="auth-form-panel">
        <div className="auth-mobile-brand"><BrandMark /></div>
        <div className="auth-form-wrap">
          <div className="auth-form-heading">
            <span className="auth-paw"><span>🐾</span></span>
            <h2>{isRegister ? 'Crie sua conta' : 'Entre na sua conta'}</h2>
            <p>{isRegister ? 'Leva menos de dois minutos.' : 'Seu companheiro está esperando.'}</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && <label>Seu nome<div className="input-wrap"><UserRound size={19} /><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" /></div></label>}
            <label>E-mail<div className="input-wrap"><Mail size={19} /><input required type="email" placeholder="voce@exemplo.com" /></div></label>
            <label>Senha<div className="input-wrap"><LockKeyhole size={19} /><input required type={showPassword ? 'text' : 'password'} placeholder={isRegister ? 'Mínimo de 8 caracteres' : 'Sua senha'} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar ou ocultar senha">{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
            {isRegister && <label>Confirme sua senha<div className="input-wrap"><LockKeyhole size={19} /><input required type={showPassword ? 'text' : 'password'} placeholder="Digite a senha novamente" /></div></label>}
            {!isRegister && <div className="form-meta"><label className="checkbox-label"><input type="checkbox" /> Lembrar de mim</label><a href="#recuperar">Esqueci minha senha</a></div>}
            {isRegister && <div className="password-hint"><CheckCircle2 size={15} /> Use pelo menos 8 caracteres</div>}
            <button className="button button-primary button-block" type="submit">{isRegister ? 'Criar conta e conhecer meu pet' : 'Entrar'} <ArrowRight size={18} /></button>
          </form>
          <div className="divider"><span>ou continue com</span></div>
          <button className="google-button" type="button"><span>G</span> Google <small>em breve</small></button>
          <p className="auth-switch">{isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <Link to={isRegister ? '/entrar' : '/criar-conta'}>{isRegister ? 'Entrar' : 'Criar conta'}</Link></p>
          {isRegister && <p className="auth-terms">Ao continuar, você concorda com nossos <Link to="/termos">Termos de Uso</Link> e <Link to="/privacidade">Política de Privacidade</Link>.</p>}
        </div>
      </section>
    </main>
  )
}
