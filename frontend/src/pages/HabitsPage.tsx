import { BookOpen, CalendarDays, Check, Coffee, Droplets, HeartPulse, MessageCircle, Moon, MoreHorizontal, Plus, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'
import type { Habit } from '../types'

export function HabitsPage() {
  const { habits, setHabits, toggleHabit, pet } = useWoofy()
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [time, setTime] = useState('10 min')
  const [icon, setIcon] = useState<'water' | 'book' | 'coffee' | 'sleep'>('water')
  const addHabit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const habit: Habit = { id: Date.now(), name: name.trim(), icon, time, completed: false, color: icon === 'water' ? 'sky' : icon === 'book' ? 'amber' : icon === 'sleep' ? 'lavender' : 'rose' }
    setHabits((current) => [...current, habit])
    setName('')
    setTime('10 min')
    setIcon('water')
    setModalOpen(false)
  }
  return (
    <m.div className="habits-page page-enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
      <div className="page-heading-row"><div><span className="page-kicker">CUIDE DE VOCÊ</span><h1>Meus hábitos</h1><p>Consistência gentil vale mais do que perfeição.</p></div><m.button className="button button-primary" onClick={() => setModalOpen(true)} whileTap={{ scale: 0.97 }}><Plus aria-hidden="true" /> Novo hábito</m.button></div>
      <m.section className="habit-hero-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.05 }}><div><span><MessageCircle aria-hidden="true" /> Lembrete do {pet.name}</span><h2>Pequenos cuidados também contam.</h2><p>Se hoje não der para fazer tudo, escolha só um hábito que deixe seu dia um pouquinho melhor.</p></div><m.div className="habit-hero-pet" animate={{ y: [0, -4, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="md" state="normal" accessory="none" /></m.div></m.section>
      <div className="habit-table-card">
        <div className="habit-table-head"><span>HÁBITO</span><span>HOJE</span><span>FREQUÊNCIA</span><span /></div>
        {habits.map((habit, habitIndex) => {
          const Icon = habit.icon === 'water' ? Droplets : habit.icon === 'book' ? BookOpen : habit.icon === 'sleep' ? Moon : Coffee
          return <m.div className="habit-table-row" key={habit.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(habitIndex * 0.045, 0.18) }}><div className="habit-info"><span className={`habit-icon habit-${habit.color}`}><Icon aria-hidden="true" /></span><span><strong>{habit.name}</strong><small>Meta de {habit.time}</small></span></div><m.button className={`big-habit-check ${habit.completed ? 'completed' : ''}`} onClick={() => toggleHabit(habit.id)} aria-pressed={habit.completed} whileTap={{ scale: 0.94 }}>{habit.completed ? <Check aria-hidden="true" /> : 'Marcar'}</m.button><div className="habit-frequency"><CalendarDays aria-hidden="true" /><span><strong>Todos os dias</strong><small>Acompanhe a partir de hoje</small></span></div><button className="icon-button" aria-label={`Mais opções para ${habit.name}`}><MoreHorizontal aria-hidden="true" /></button></m.div>
        })}
      </div>
      <div className="gentle-note"><HeartPulse /><div><strong>Sem culpa, sem sequências perdidas.</strong><p>Um dia fora do plano não apaga tudo que você já cuidou. Amanhã é uma nova chance.</p></div></div>
      <AnimatePresence>
        {modalOpen && <m.div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><m.form className="task-modal" onSubmit={addHabit} onMouseDown={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.99 }} transition={{ duration: 0.22 }}><div className="modal-heading"><div><span>NOVO HÁBITO</span><h2>Qual cuidado vamos praticar?</h2></div><button type="button" onClick={() => setModalOpen(false)} aria-label="Fechar"><X /></button></div><label>Nome<input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Caminhar por 15 minutos" /></label><div className="form-grid"><label>Tipo<select value={icon} onChange={(event) => setIcon(event.target.value as typeof icon)}><option value="water">Hidratação</option><option value="book">Leitura</option><option value="coffee">Pausa</option><option value="sleep">Sono</option></select></label><label>Meta ou horário<input required value={time} onChange={(event) => setTime(event.target.value)} placeholder="Ex.: 20 min" /></label></div><div className="modal-footer"><button className="button button-ghost" type="button" onClick={() => setModalOpen(false)}>Cancelar</button><m.button className="button button-primary" type="submit" whileTap={{ scale: 0.97 }}>Criar hábito</m.button></div></m.form></m.div>}
      </AnimatePresence>
    </m.div>
  )
}
