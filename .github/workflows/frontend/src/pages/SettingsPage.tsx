import { Bell, Check, ChevronRight, Globe2, LockKeyhole, Moon, Palette, Save, ShieldCheck, Sun, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useWoofy } from '../contexts/WoofyContext'

export function SettingsPage({ profile = false }: { profile?: boolean }) {
  const { userName, setUserName, darkMode, setDarkMode } = useWoofy()
  const [name, setName] = useState(userName)
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const save = () => { setUserName(name); setSaved(true); window.setTimeout(() => setSaved(false), 1500) }

  if (profile) return (
    <div className="settings-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">SUA CONTA</span><h1>Meu perfil</h1><p>Mantenha seus dados atualizados e seguros.</p></div><button className="button button-primary" onClick={save}>{saved ? <Check /> : <Save />} {saved ? 'Salvo' : 'Salvar alterações'}</button></div>
      <div className="settings-layout"><aside className="profile-card"><span className="large-avatar">{name.charAt(0) || 'K'}</span><h2>{name}</h2><p>kaua@exemplo.com</p><span className="member-badge">Companheiro desde ago. 2026</span><button>Alterar foto</button></aside><section className="settings-card"><div className="settings-card-heading"><UserRound /><div><h2>Informações pessoais</h2><p>Dados usados para personalizar sua experiência.</p></div></div><div className="settings-form"><label>Nome completo<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>E-mail<input type="email" defaultValue="kaua@exemplo.com" /></label><div className="form-grid"><label>Horário de início<input type="time" defaultValue="08:00" /></label><label>Horário de término<input type="time" defaultValue="22:00" /></label></div></div><div className="settings-card-heading security-heading"><LockKeyhole /><div><h2>Segurança</h2><p>Proteja o acesso à sua conta.</p></div></div><button className="settings-link-row"><span><strong>Alterar senha</strong><small>Última alteração há 2 meses</small></span><ChevronRight /></button></section></div>
    </div>
  )

  return (
    <div className="settings-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">DO SEU JEITO</span><h1>Configurações</h1><p>Ajuste o Woofy para combinar com sua rotina.</p></div></div>
      <div className="settings-sections">
        <section className="settings-card"><div className="settings-card-heading"><Palette /><div><h2>Aparência</h2><p>Escolha como você prefere ver o aplicativo.</p></div></div><div className="theme-options"><button className={!darkMode ? 'selected' : ''} onClick={() => setDarkMode(false)}><span className="theme-preview light-preview"><Sun /></span><strong>Tema claro</strong>{!darkMode && <Check />}</button><button className={darkMode ? 'selected' : ''} onClick={() => setDarkMode(true)}><span className="theme-preview dark-preview"><Moon /></span><strong>Tema escuro</strong>{darkMode && <Check />}</button></div></section>
        <section className="settings-card"><div className="settings-card-heading"><Bell /><div><h2>Notificações</h2><p>Lembretes gentis, nos horários que funcionam para você.</p></div></div><div className="toggle-row"><span><strong>Lembretes de tarefas</strong><small>Receba um aviso próximo ao horário.</small></span><button className={`toggle ${notifications ? 'on' : ''}`} onClick={() => setNotifications((value) => !value)}><i /></button></div><div className="toggle-row"><span><strong>Hábitos do dia</strong><small>Um lembrete leve para seus hábitos.</small></span><button className="toggle on"><i /></button></div><div className="toggle-row"><span><strong>Mensagens do pet</strong><small>Saudações e incentivos ocasionais.</small></span><button className="toggle on"><i /></button></div></section>
        <section className="settings-card"><div className="settings-card-heading"><Globe2 /><div><h2>Idioma e região</h2><p>Preferências de linguagem e horário.</p></div></div><div className="settings-form form-grid"><label>Idioma<select defaultValue="pt-BR"><option value="pt-BR">Português (Brasil)</option><option value="en">English</option><option value="es">Español</option></select></label><label>Fuso horário<select defaultValue="sp"><option value="sp">Brasília (GMT-3)</option></select></label></div></section>
        <section className="settings-card privacy-card"><div className="settings-card-heading"><ShieldCheck /><div><h2>Privacidade e dados</h2><p>Você sempre está no controle das suas informações.</p></div></div><button className="settings-link-row"><span><strong>Baixar meus dados</strong><small>Receba uma cópia das suas informações.</small></span><ChevronRight /></button><button className="settings-link-row danger"><span><Trash2 /><span><strong>Excluir minha conta</strong><small>Esta ação exige confirmação.</small></span></span><ChevronRight /></button></section>
      </div>
    </div>
  )
}
