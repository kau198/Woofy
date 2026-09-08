import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useWoofy } from '../contexts/WoofyContext'

export function Reminders() {
  const { tasks, habits, pet, notifications, userEmail } = useWoofy()
  const [message, setMessage] = useState('')
  useEffect(() => {
    const tick = () => {
      if (document.hidden) return
      const now = new Date()
      const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(now)
      const time = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }).format(now)
      const remind = (key: string, text: string) => {
        const storageKey = `woofy-reminder:${userEmail}:${date}:${key}`
        if (sessionStorage.getItem(storageKey)) return false
        sessionStorage.setItem(storageKey, '1'); setMessage(text); return true
      }
      const task = notifications.tasks && tasks.find((item) => !item.completed && item.dueDate === date && item.time === time)
      if (task && remind(`task-${task.id}`, `Está na hora de: ${task.title}`)) return
      if (notifications.habits && time >= '18:00' && habits.some((item) => !item.completed) && remind('habits', 'Ainda há hábitos de hoje para cuidar. Escolha um pequeno passo.')) return
      if (notifications.companion) remind('companion', `${pet.name} está por aqui. Vamos cuidar de uma coisa de cada vez.`)
    }
    const timer = window.setInterval(tick, 30000)
    return () => clearInterval(timer)
  }, [tasks, habits, pet.name, notifications, userEmail])
  return message ? <div className="reminder-toast" role="status"><span>{message}</span><button onClick={() => setMessage('')} aria-label="Fechar lembrete"><X size={18} /></button></div> : null
}
