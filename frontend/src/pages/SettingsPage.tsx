import { Bell, Check, Globe2, HardDrive, Moon, Palette, Save, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useWoofy } from '../contexts/WoofyContext'

interface NotificationPreferences {
  tasks: boolean
  habits: boolean
  companion: boolean
}

export function SettingsPage({ profile = false }: { profile?: boolean }) {
  const { userName, setUserName, pet, darkMode, setDarkMode } = useWoofy()
  const [name, setName] = useState(userName)
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState<NotificationPreferences>({ tasks: true, habits: true, companion: true })
  const save = () => { setUserName(name); setSaved(true); window.setTimeout(() => setSaved(false), 1500) }
  const toggleNotification = (key: keyof NotificationPreferences) => setNotifications((current) => ({ ...current, [key]: !current[key] }))

  if (profile) return (
    <div className="settings-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">SUA CONTA</span><h1>Meu perfil</h1><p>Edite as informações que realmente estão salvas neste navegador.</p></div><button className="button button-primary" onClick={save}>{saved ? <Check /> : <Save />} {saved ? 'Salvo' : 'Salvar alterações'}</button></div>
      <div className="settings-layout">
        <aside className="profile-card"><span className="large-avatar">{name.charAt(0) || 'W'}</span><h2>{name}</h2><p>Perfil local</p><span className="member-badge">Companheiro desde {pet.adoptionDate}</span></aside>
        <section className="settings-card">
          <div className="settings-card-heading"><UserRound /><div><h2>Informações pessoais</h2><p>Este nome aparece nas conversas e saudações.</p></div></div>
          <div className="settings-form"><label>Nome<input value={name} onChange={(event) => setName(event.target.value)} /></label></div>
          <div className="local-profile-note"><HardDrive /><p><strong>Salvo localmente.</strong> Esta demonstração ainda não cria uma conta online nem solicita e-mail ou senha.</p></div>
        </section>
      </div>
    </div>
  )

  return (
    <div className="settings-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">DO SEU JEITO</span><h1>Configurações</h1><p>Ajuste o Woofy para combinar com sua rotina.</p></div></div>
      <div className="settings-sections">
        <section className="settings-card">
          <div className="settings-card-heading"><Palette /><div><h2>Aparência</h2><p>Escolha como você prefere ver o aplicativo.</p></div></div>
          <div className="theme-options"><button type="button" className={!darkMode ? 'selected' : ''} aria-pressed={!darkMode} onClick={() => setDarkMode(false)}><span className="theme-preview light-preview"><Sun /></span><strong>Tema claro</strong>{!darkMode && <Check />}</button><button type="button" className={darkMode ? 'selected' : ''} aria-pressed={darkMode} onClick={() => setDarkMode(true)}><span className="theme-preview dark-preview"><Moon /></span><strong>Tema escuro</strong>{darkMode && <Check />}</button></div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><Bell /><div><h2>Notificações</h2><p>Escolha quais lembretes ficam ativos nesta sessão.</p></div></div>
          <NotificationToggle title="Lembretes de tarefas" description="Receba um aviso próximo ao horário." enabled={notifications.tasks} onToggle={() => toggleNotification('tasks')} />
          <NotificationToggle title="Hábitos do dia" description="Um lembrete leve para seus hábitos." enabled={notifications.habits} onToggle={() => toggleNotification('habits')} />
          <NotificationToggle title="Mensagens do pet" description="Saudações e incentivos ocasionais." enabled={notifications.companion} onToggle={() => toggleNotification('companion')} />
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><Globe2 /><div><h2>Idioma e região</h2><p>Preferências de linguagem e horário.</p></div></div>
          <div className="settings-form form-grid"><label>Idioma<select defaultValue="pt-BR"><option value="pt-BR">Português (Brasil)</option></select></label><label>Fuso horário<select defaultValue="sp"><option value="sp">Brasília (GMT-3)</option></select></label></div>
        </section>

        <section className="settings-card privacy-card">
          <div className="settings-card-heading"><ShieldCheck /><div><h2>Privacidade e dados</h2><p>O estado da demonstração permanece no armazenamento local deste navegador.</p></div></div>
          <div className="local-profile-note"><HardDrive /><p><strong>Sem sincronização externa.</strong> Limpar os dados do site no navegador remove este perfil de demonstração.</p></div>
        </section>
      </div>
    </div>
  )
}

function NotificationToggle({ title, description, enabled, onToggle }: { title: string; description: string; enabled: boolean; onToggle: () => void }) {
  return <div className="toggle-row"><span><strong>{title}</strong><small>{description}</small></span><button type="button" className={`toggle ${enabled ? 'on' : ''}`} aria-pressed={enabled} onClick={onToggle}><i /></button></div>
}
