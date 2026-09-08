import { Bell, Check, Globe2, HardDrive, Moon, Palette, Save, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { apiRequest, runAction } from '../services/api'
import { useState } from 'react'
import { useWoofy } from '../contexts/WoofyContext'

interface NotificationPreferences {
  tasks: boolean
  habits: boolean
  companion: boolean
}

export function SettingsPage({ profile = false }: { profile?: boolean }) {
  const { userName, userEmail, pet, darkMode, saveProfile, notifications } = useWoofy()
  const [name, setName] = useState(userName)
  const [saved, setSaved] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const exportData = async () => {
    const data = await apiRequest('/account/export')
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = 'woofy-meus-dados.json'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const deleteAccount = async () => {
    if (deleteConfirmation !== 'EXCLUIR') return
    await apiRequest('/account', { method: 'DELETE' })
    window.location.assign(import.meta.env.BASE_URL)
  }
  const save = async () => { await saveProfile({ name }); setSaved(true); window.setTimeout(() => setSaved(false), 1500) }
  const toggleNotification = (key: keyof NotificationPreferences) => runAction(saveProfile({ [`notify_${key}`]: !notifications[key] }))

  if (profile) return (
    <div className="settings-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">SUA CONTA</span><h1>Meu perfil</h1><p>Edite as informações sincronizadas com sua conta.</p></div><button className="button button-primary" onClick={() => runAction(save())}>{saved ? <Check /> : <Save />} {saved ? 'Salvo' : 'Salvar alterações'}</button></div>
      <div className="settings-layout">
        <aside className="profile-card"><span className="large-avatar">{name.charAt(0) || 'W'}</span><h2>{name}</h2><p>{userEmail}</p><span className="member-badge">Companheiro desde {pet.adoptionDate}</span></aside>
        <section className="settings-card">
          <div className="settings-card-heading"><UserRound /><div><h2>Informações pessoais</h2><p>Este nome aparece nas conversas e saudações.</p></div></div>
          <div className="settings-form"><label>Nome<input value={name} onChange={(event) => setName(event.target.value)} /></label></div>
          <div className="local-profile-note"><HardDrive /><p><strong>Conta sincronizada.</strong> Suas alterações ficam disponíveis quando você entrar novamente.</p></div>
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
          <div className="theme-options"><button type="button" className={!darkMode ? 'selected' : ''} aria-pressed={!darkMode} onClick={() => runAction(saveProfile({ dark_mode: false }))}><span className="theme-preview light-preview"><Sun /></span><strong>Tema claro</strong>{!darkMode && <Check />}</button><button type="button" className={darkMode ? 'selected' : ''} aria-pressed={darkMode} onClick={() => runAction(saveProfile({ dark_mode: true }))}><span className="theme-preview dark-preview"><Moon /></span><strong>Tema escuro</strong>{darkMode && <Check />}</button></div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><Bell /><div><h2>Notificações</h2><p>Lembretes enquanto o aplicativo estiver aberto. As preferências ficam salvas na sua conta.</p></div></div>
          <NotificationToggle title="Lembretes de tarefas" description="Receba um aviso próximo ao horário." enabled={notifications.tasks} onToggle={() => toggleNotification('tasks')} />
          <NotificationToggle title="Hábitos do dia" description="Um lembrete leve para seus hábitos." enabled={notifications.habits} onToggle={() => toggleNotification('habits')} />
          <NotificationToggle title="Mensagens do pet" description="Saudações e incentivos ocasionais." enabled={notifications.companion} onToggle={() => toggleNotification('companion')} />
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><Globe2 /><div><h2>Idioma e região</h2><p>Preferências de linguagem e horário.</p></div></div>
          <div className="settings-form form-grid"><label>Idioma<select defaultValue="pt-BR"><option value="pt-BR">Português (Brasil)</option></select></label><label>Fuso horário<select defaultValue="sp"><option value="sp">Brasília (GMT-3)</option></select></label></div>
        </section>

        <section className="settings-card privacy-card">
          <div className="settings-card-heading"><ShieldCheck /><div><h2>Privacidade e dados</h2><p>Seus dados são guardados na sua conta e protegidos pela API.</p></div></div>
          <div className="local-profile-note"><HardDrive /><p>Exporte uma cópia ou exclua permanentemente sua conta e os dados associados.</p></div>
          <button className="button button-ghost" onClick={() => runAction(exportData())}>Baixar meus dados</button>
          <details className="delete-account"><summary>Excluir minha conta</summary><p>Esta ação é permanente. Digite EXCLUIR para confirmar.</p><input aria-label="Confirmação da exclusão" value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} /><button className="button button-ghost" disabled={deleteConfirmation !== 'EXCLUIR'} onClick={() => runAction(deleteAccount())}>Excluir definitivamente</button></details>
        </section>
      </div>
    </div>
  )
}

function NotificationToggle({ title, description, enabled, onToggle }: { title: string; description: string; enabled: boolean; onToggle: () => void }) {
  return <div className="toggle-row"><span><strong>{title}</strong><small>{description}</small></span><button type="button" className={`toggle ${enabled ? 'on' : ''}`} aria-pressed={enabled} onClick={onToggle}><i /></button></div>
}
