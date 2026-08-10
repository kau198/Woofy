import { BookOpen, Check, Coffee, Droplets, HeartPulse, Moon, MoreHorizontal, Plus, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useWoofy } from '../contexts/WoofyContext'
import type { Habit } from '../types'

const week = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

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
    <div className="habits-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">CUIDE DE VOCÊ</span><h1>Meus hábitos</h1><p>Consistência gentil vale mais do que perfeição.</p></div><button className="button button-primary" onClick={() => setModalOpen(true)}><Plus /> Novo hábito</button></div>
      <section className="habit-hero-card"><div><span><Sparkles /> Lembrete do {pet.name}</span><h2>Pequenos cuidados também contam.</h2><p>Se hoje não der para fazer tudo, escolha só um hábito que deixe seu dia um pouquinho melhor.</p></div><div className="habit-hero-pet">🐕</div></section>
      <div className="habit-table-card">
        <div className="habit-table-head"><span>HÁBITO</span><span>HOJE</span><span>ÚLTIMOS 7 DIAS</span><span /></div>
        {habits.map((habit, habitIndex) => {
          const Icon = habit.icon === 'water' ? Droplets : habit.icon === 'book' ? BookOpen : habit.icon === 'sleep' ? Moon : Coffee
          return <div className="habit-table-row" key={habit.id}><div className="habit-info"><span className={`habit-icon habit-${habit.color}`}><Icon /></span><span><strong>{habit.name}</strong><small>Todos os dias • {habit.time}</small></span></div><button className={`big-habit-check ${habit.completed ? 'completed' : ''}`} onClick={() => toggleHabit(habit.id)}>{habit.completed ? <Check /> : 'Marcar'}</button><div className="habit-week">{week.map((day, index) => <span key={day}><i className={(index + habitIndex) % 3 !== 0 ? 'done' : index === 3 ? 'today' : ''}>{(index + habitIndex) % 3 !== 0 && <Check />}</i><small>{day}</small></span>)}</div><button className="icon-button"><MoreHorizontal /></button></div>
        })}
      </div>
      <div className="gentle-note"><HeartPulse /><div><strong>Sem culpa, sem sequências perdidas.</strong><p>Um dia fora do plano não apaga tudo que você já cuidou. Amanhã é uma nova chance.</p></div></div>
      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}><form className="task-modal" onSubmit={addHabit} onMouseDown={(event) => event.stopPropagation()}><div className="modal-heading"><div><span>NOVO HÁBITO</span><h2>Qual cuidado vamos praticar?</h2></div><button type="button" onClick={() => setModalOpen(false)} aria-label="Fechar"><X /></button></div><label>Nome<input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Caminhar por 15 minutos" /></label><div className="form-grid"><label>Tipo<select value={icon} onChange={(event) => setIcon(event.target.value as typeof icon)}><option value="water">Hidratação</option><option value="book">Leitura</option><option value="coffee">Pausa</option><option value="sleep">Sono</option></select></label><label>Meta ou horário<input required value={time} onChange={(event) => setTime(event.target.value)} placeholder="Ex.: 20 min" /></label></div><div className="modal-footer"><button className="button button-ghost" type="button" onClick={() => setModalOpen(false)}>Cancelar</button><button className="button button-primary" type="submit">Criar hábito</button></div></form></div>}
    </div>
  )
}
