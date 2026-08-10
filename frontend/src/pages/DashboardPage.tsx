import { ArrowRight, CalendarDays, Check, Clock3, Coffee, Droplets, Flame, Lightbulb, PawPrint, Play, Plus, Sparkles, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { TaskRow } from '../components/TaskRow'
import { useWoofy } from '../contexts/WoofyContext'

export function DashboardPage() {
  const { userName, pet, tasks, toggleTask, habits, toggleHabit, paws } = useWoofy()
  const pending = tasks.filter((task) => !task.completed)
  const completeCount = tasks.filter((task) => task.completed).length
  const level = Math.floor(paws / 100) + 1
  const levelProgress = paws % 100

  return (
    <div className="dashboard-page page-enter">
      <section className="dashboard-welcome">
        <div className="welcome-copy">
          <span className="day-label"><CalendarDays size={15} /> MISSÃO DIÁRIA · QUINTA-FEIRA</span>
          <h1>Vamos subir de nível, {userName}? <span>✦</span></h1>
          <p>Faltam {pending.length} missões para fechar o dia. Comece pela menor e ganhe ritmo.</p>
          <div className="welcome-actions"><Link className="button button-primary" to="/app/tarefas"><Plus /> Nova tarefa</Link><Link className="button button-soft" to="/app/foco"><Play fill="currentColor" /> Iniciar foco</Link></div>
        </div>
        <div className="welcome-pet">
          <div className="pet-bubble"><Sparkles size={15} /><p>Estou com você!<br /><strong>Uma coisa de cada vez.</strong></p></div>
          <Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="lg" state="talking" />
        </div>
      </section>

      <section className="dashboard-game-strip">
        <article className="level-card"><span>NÍVEL {level}</span><div><strong>Explorador de rotinas</strong><small>{100 - levelProgress} XP para o próximo nível</small><i><b style={{ width: `${levelProgress}%` }} /></i></div><Trophy /></article>
        <article><Flame fill="currentColor" /><span><strong>3 dias</strong><small>sequência gentil</small></span></article>
        <article><Sparkles fill="currentColor" /><span><strong>2 bônus</strong><small>prontos para coletar</small></span></article>
        <Link to="/app/conversar"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="sm" state="listening" accessory="none" /><span><strong>{pet.name} está online</strong><small>Fale sobre o que quiser</small></span><ArrowRight /></Link>
      </section>

      <section className="dashboard-stats">
        <article><span className="stat-icon stat-amber"><Check /></span><div><small>Tarefas concluídas</small><strong>{completeCount}<i> de {tasks.length}</i></strong></div><span className="mini-progress"><i style={{ width: `${(completeCount / tasks.length) * 100}%` }} /></span></article>
        <article><span className="stat-icon stat-rose"><Flame /></span><div><small>Hábitos de hoje</small><strong>{habits.filter((habit) => habit.completed).length}<i> de {habits.length}</i></strong></div><span className="mini-progress rose"><i style={{ width: `${(habits.filter((habit) => habit.completed).length / habits.length) * 100}%` }} /></span></article>
        <article><span className="stat-icon stat-mint"><Clock3 /></span><div><small>Foco esta semana</small><strong>3h 20<i> min</i></strong></div><span className="stat-change">↑ 35 min esta semana</span></article>
        <article><span className="stat-icon stat-gold"><PawPrint fill="currentColor" /></span><div><small>Saldo de patinhas</small><strong>{paws}<i> patinhas</i></strong></div><Link to="/app/acessorios">Ver recompensas <ArrowRight /></Link></article>
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
              return <button key={habit.id} className={`habit-row ${habit.completed ? 'is-completed' : ''}`} onClick={() => toggleHabit(habit.id)}><span className={`habit-icon habit-${habit.color}`}><Icon /></span><span><strong>{habit.name}</strong><small>{habit.time}</small></span><i>{habit.completed && <Check />}</i></button>
            })}
          </div>
          <p className="habit-note"><span>💛</span> Sem sequências para perder. Cada dia é um novo começo.</p>
        </section>

        <section className="dashboard-card focus-card">
          <div className="focus-visual"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="md" state="studying" accessory="none" /></div>
          <div><span className="section-kicker">MOMENTO DE CONCENTRAR</span><h2>Vamos focar juntos?</h2><p>Escolha um tempo, silencie as distrações e deixe {pet.name} fazer companhia.</p><Link className="button button-dark" to="/app/foco"><Play fill="currentColor" /> Iniciar sessão de 25 min</Link></div>
        </section>

        <section className="dashboard-card week-card">
          <div className="card-heading"><div><span>SEU RITMO</span><h2>Esta semana</h2></div><span className="week-badge">+12% <small>vs. anterior</small></span></div>
          <div className="week-chart">{[36, 58, 42, 76, 63, 22, 10].map((height, index) => <span key={index}><i style={{ height: `${height}%` }} className={index === 3 ? 'active' : ''} /><small>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][index]}</small></span>)}</div>
          <div className="week-summary"><span><Trophy /> <strong>18</strong> tarefas</span><span><Clock3 /> <strong>8</strong> focos</span><span><PawPrint /> <strong>95</strong> patinhas</span></div>
        </section>
      </div>
    </div>
  )
}
