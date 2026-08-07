import { BookOpen, Check, Coffee, Droplets, HeartPulse, Moon, MoreHorizontal, Plus, Sparkles } from 'lucide-react'
import { useWoofy } from '../contexts/WoofyContext'

const week = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export function HabitsPage() {
  const { habits, toggleHabit, pet } = useWoofy()
  return (
    <div className="habits-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">CUIDE DE VOCÊ</span><h1>Meus hábitos</h1><p>Consistência gentil vale mais do que perfeição.</p></div><button className="button button-primary"><Plus /> Novo hábito</button></div>
      <section className="habit-hero-card"><div><span><Sparkles /> Lembrete do {pet.name}</span><h2>Pequenos cuidados também contam.</h2><p>Se hoje não der para fazer tudo, escolha só um hábito que deixe seu dia um pouquinho melhor.</p></div><div className="habit-hero-pet">🐕</div></section>
      <div className="habit-table-card">
        <div className="habit-table-head"><span>HÁBITO</span><span>HOJE</span><span>ÚLTIMOS 7 DIAS</span><span /></div>
        {habits.map((habit, habitIndex) => {
          const Icon = habit.icon === 'water' ? Droplets : habit.icon === 'book' ? BookOpen : Coffee
          return <div className="habit-table-row" key={habit.id}><div className="habit-info"><span className={`habit-icon habit-${habit.color}`}><Icon /></span><span><strong>{habit.name}</strong><small>Todos os dias • {habit.time}</small></span></div><button className={`big-habit-check ${habit.completed ? 'completed' : ''}`} onClick={() => toggleHabit(habit.id)}>{habit.completed ? <Check /> : 'Marcar'}</button><div className="habit-week">{week.map((day, index) => <span key={day}><i className={(index + habitIndex) % 3 !== 0 ? 'done' : index === 3 ? 'today' : ''}>{(index + habitIndex) % 3 !== 0 && <Check />}</i><small>{day}</small></span>)}</div><button className="icon-button"><MoreHorizontal /></button></div>
        })}
        <div className="habit-table-row"><div className="habit-info"><span className="habit-icon habit-lavender"><Moon /></span><span><strong>Dormir antes das 23h</strong><small>Seg a sex • 22:45</small></span></div><button className="big-habit-check">Marcar</button><div className="habit-week">{week.map((day, index) => <span key={day}><i className={index < 3 ? 'done' : ''}>{index < 3 && <Check />}</i><small>{day}</small></span>)}</div><button className="icon-button"><MoreHorizontal /></button></div>
      </div>
      <div className="gentle-note"><HeartPulse /><div><strong>Sem culpa, sem sequências perdidas.</strong><p>Um dia fora do plano não apaga tudo que você já cuidou. Amanhã é uma nova chance.</p></div></div>
    </div>
  )
}
