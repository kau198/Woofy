import { ArrowRight, CalendarDays, Check, Clock3, Coffee, Droplets, Flame, Heart, Lightbulb, ListChecks, MessageCircle, PawPrint, Play, Plus, Trophy } from 'lucide-react'
import { m } from 'motion/react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { TaskRow } from '../components/TaskRow'
import { useWoofy } from '../contexts/WoofyContext'

export function DashboardPage() {
  const { userName, pet, tasks, toggleTask, habits, toggleHabit, paws } = useWoofy()
  const pending = tasks.filter((task) => !task.completed)
  const completeCount = tasks.filter((task) => task.completed).length
  const completedHabits = habits.filter((habit) => habit.completed).length
  const level = Math.floor(paws / 100) + 1
  const levelProgress = paws % 100
  const taskCompletion = tasks.length ? Math.round((completeCount / tasks.length) * 100) : 0
  const habitCompletion = habits.length ? Math.round((completedHabits / habits.length) * 100) : 0
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date()).toUpperCase()
  const categories = ['Pessoal', 'Estudos', 'Trabalho', 'Saúde', 'Casa', 'Outros'] as const
  const categoryCounts = categories.map((category) => ({ category, count: tasks.filter((task) => task.category === category).length }))
  const largestCategory = Math.max(1, ...categoryCounts.map(({ count }) => count))

  return (
    <m.div className="dashboard-page page-enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
      <m.section className="dashboard-welcome" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}>
        <div className="welcome-copy">
          <span className="day-label"><CalendarDays size={15} /> MISSÃO DIÁRIA · {weekday}</span>
          <h1>Vamos subir de nível, {userName}?</h1>
          <p>Faltam {pending.length} missões para fechar o dia. Comece pela menor e ganhe ritmo.</p>
          <div className="welcome-actions"><Link className="button button-primary" to="/app/tarefas"><Plus /> Nova tarefa</Link><Link className="button button-soft" to="/app/foco"><Play fill="currentColor" /> Iniciar foco</Link></div>
        </div>
        <m.div className="welcome-pet" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.42, delay: 0.12 }}>
          <div className="pet-bubble"><MessageCircle size={15} aria-hidden="true" /><p>Estou com você!<br /><strong>Uma coisa de cada vez.</strong></p></div>
          <Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="lg" state="talking" />
        </m.div>
      </m.section>

      <section className="dashboard-game-strip">
        <m.article className="level-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}><span>NÍVEL {level}</span><div><strong>Explorador de rotinas</strong><small>{100 - levelProgress} XP para o próximo nível</small><i><m.b initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} transition={{ duration: 0.55, delay: 0.16 }} /></i></div><Trophy /></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}><Flame fill="currentColor" /><span><strong>{completedHabits} de {habits.length}</strong><small>hábitos marcados hoje</small></span></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}><ListChecks aria-hidden="true" /><span><strong>{pending.length}</strong><small>missões em aberto</small></span></m.article>
        <Link to="/app/conversar"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="sm" state="listening" accessory="none" /><span><strong>Conversar com {pet.name}</strong><small>Fale sobre o que quiser</small></span><ArrowRight /></Link>
      </section>

      <section className="dashboard-stats">
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}><span className="stat-icon stat-amber"><Check /></span><div><small>Tarefas concluídas</small><strong>{completeCount}<i> de {tasks.length}</i></strong></div><span className="mini-progress"><m.i initial={{ width: 0 }} animate={{ width: `${taskCompletion}%` }} transition={{ duration: 0.5, delay: 0.16 }} /></span></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}><span className="stat-icon stat-rose"><Flame /></span><div><small>Hábitos de hoje</small><strong>{completedHabits}<i> de {habits.length}</i></strong></div><span className="mini-progress rose"><m.i initial={{ width: 0 }} animate={{ width: `${habitCompletion}%` }} transition={{ duration: 0.5, delay: 0.2 }} /></span></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}><span className="stat-icon stat-mint"><Clock3 /></span><div><small>Próxima sessão</small><strong>25<i> min</i></strong></div><Link to="/app/foco">Iniciar foco <ArrowRight /></Link></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><span className="stat-icon stat-gold"><PawPrint fill="currentColor" /></span><div><small>Saldo de patinhas</small><strong>{paws}<i> patinhas</i></strong></div><Link to="/app/acessorios">Ver recompensas <ArrowRight /></Link></m.article>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card today-card">
          <div className="card-heading"><div><span>PARA HOJE</span><h2>Suas tarefas</h2></div><Link to="/app/tarefas">Ver todas <ArrowRight /></Link></div>
          <div className="today-list">{tasks.filter((task) => task.date === 'Hoje').slice(0, 4).map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} compact />)}</div>
          <Link className="add-inline" to="/app/tarefas"><Plus /> Adicionar tarefa</Link>
        </section>

        <section className="dashboard-card habits-card">
          <div className="card-heading"><div><span>PEQUENOS CUIDADOS</span><h2>Hábitos de hoje</h2></div><Link to="/app/habitos">Ver todos <ArrowRight /></Link></div>
          <div className="habit-list">
            {habits.map((habit) => {
              const Icon = habit.icon === 'water' ? Droplets : habit.icon === 'book' ? Lightbulb : habit.icon === 'sleep' ? Clock3 : Coffee
              return <m.button key={habit.id} className={`habit-row ${habit.completed ? 'is-completed' : ''}`} onClick={() => toggleHabit(habit.id)} aria-pressed={habit.completed} whileTap={{ scale: 0.985 }}><span className={`habit-icon habit-${habit.color}`}><Icon /></span><span><strong>{habit.name}</strong><small>{habit.time}</small></span><i>{habit.completed && <Check />}</i></m.button>
            })}
          </div>
          <p className="habit-note"><Heart size={13} aria-hidden="true" /> Sem sequências para perder. Cada dia é um novo começo.</p>
        </section>

        <section className="dashboard-card focus-card">
          <div className="focus-visual"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="md" state="studying" accessory="none" /></div>
          <div><span className="section-kicker">MOMENTO DE CONCENTRAR</span><h2>Vamos focar juntos?</h2><p>Escolha um tempo, silencie as distrações e deixe {pet.name} fazer companhia.</p><Link className="button button-dark" to="/app/foco"><Play fill="currentColor" /> Iniciar sessão de 25 min</Link></div>
        </section>

        <section className="dashboard-card week-card">
          <div className="card-heading"><div><span>SUA LISTA</span><h2>Volume por categoria</h2></div><span className="week-badge">{taskCompletion}% <small>concluído</small></span></div>
          <div className="week-chart">{categoryCounts.map(({ category, count }, index) => <span key={category} title={`${category}: ${count}`}><m.i initial={{ height: 0 }} animate={{ height: count ? `${Math.max(14, (count / largestCategory) * 100)}%` : '3px' }} transition={{ duration: 0.42, delay: 0.08 + index * 0.04 }} className={count === largestCategory ? 'active' : ''} /><small>{category.slice(0, 2)}</small></span>)}</div>
          <div className="week-summary"><span><Trophy /> <strong>{tasks.length}</strong> tarefas</span><span><Flame /> <strong>{completedHabits}</strong> hábitos hoje</span><span><PawPrint /> <strong>{paws}</strong> patinhas</span></div>
        </section>
      </div>
    </m.div>
  )
}
