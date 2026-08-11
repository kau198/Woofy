import { CalendarCheck2, Check, CheckSquare2, CircleDashed, ListTodo, MessageCircle, PawPrint, Trophy } from 'lucide-react'
import { m } from 'motion/react'
import { useWoofy } from '../contexts/WoofyContext'

const categories = ['Pessoal', 'Estudos', 'Trabalho', 'Saúde', 'Casa', 'Outros'] as const

export function ProgressPage() {
  const { tasks, habits, paws, transactions, pet } = useWoofy()
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks
  const completedHabits = habits.filter((habit) => habit.completed).length
  const completion = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const categoryData = categories.map((category) => ({
    category,
    count: tasks.filter((task) => task.category === category).length,
  }))
  const largestCategory = Math.max(1, ...categoryData.map(({ count }) => count))

  return (
    <m.div className="progress-page page-enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
      <div className="page-heading-row">
        <div><span className="page-kicker">SEU RETRATO AGORA</span><h1>Seu progresso</h1><p>Números reais do que já está salvo na sua rotina.</p></div>
        <span className="report-stamp">RESUMO ATUAL</span>
      </div>

      <m.section className="progress-highlight" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.04 }}>
        <div>
          <span><MessageCircle aria-hidden="true" /> MENSAGEM DO {pet.name.toUpperCase()}</span>
          <h2>{tasks.length ? `Você concluiu ${completedTasks} de ${tasks.length} tarefas da sua lista.` : 'Sua lista está pronta para o primeiro passo.'}</h2>
          <p>{habits.length ? `${completedHabits} de ${habits.length} hábitos já foram marcados hoje.` : 'Quando você criar um hábito, o acompanhamento começa por aqui.'}</p>
        </div>
        <m.div className="progress-trophy" initial={{ opacity: 0, rotate: -6, scale: 0.92 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 190, damping: 17, delay: 0.16 }}>
          <Trophy aria-hidden="true" /><span>{tasks.length ? `${completion}% da lista` : 'Comece pequeno'}</span>
        </m.div>
      </m.section>

      <div className="progress-stat-grid">
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}><span className="stat-icon stat-amber"><CheckSquare2 /></span><small>Tarefas concluídas</small><strong>{completedTasks}</strong><span className="positive">{completion}% da lista</span></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}><span className="stat-icon stat-rose"><ListTodo /></span><small>Tarefas pendentes</small><strong>{pendingTasks}</strong><span className="positive">{pendingTasks ? 'a fazer' : 'lista em dia'}</span></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}><span className="stat-icon stat-mint"><CalendarCheck2 /></span><small>Hábitos de hoje</small><strong>{completedHabits}</strong><span className="positive">de {habits.length} cadastrados</span></m.article>
        <m.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}><span className="stat-icon stat-gold"><PawPrint /></span><small>Saldo de patinhas</small><strong>{paws}</strong><span className="positive">{transactions.length} registros</span></m.article>
      </div>

      <div className="progress-content-grid">
        <section className="chart-card category-report">
          <div className="card-heading"><div><span>DISTRIBUIÇÃO REAL</span><h2>Tarefas por categoria</h2></div><span className="chart-legend"><i /> Itens salvos</span></div>
          <div className="bar-chart">
            <div className="y-axis"><span>{largestCategory}</span><span>{Math.ceil(largestCategory / 2)}</span><span>0</span></div>
            {categoryData.map(({ category, count }, index) => <div className="chart-bar" key={category} title={`${category}: ${count}`}><m.span initial={{ height: 0 }} animate={{ height: count ? `${Math.max(12, (count / largestCategory) * 100)}%` : '3px' }} transition={{ duration: 0.48, delay: 0.08 + index * 0.045, ease: [0.22, 1, 0.36, 1] }} className={count === largestCategory ? 'best' : ''}>{count > 0 && <i>{count}</i>}</m.span><small>{category.slice(0, 3)}</small></div>)}
          </div>
        </section>

        <section className="chart-card categories-card">
          <div className="card-heading"><div><span>STATUS DA LISTA</span><h2>Concluídas e pendentes</h2></div></div>
          <div className="donut-wrap"><div className="donut task-status-donut" style={{ '--completion': `${completion * 3.6}deg` } as React.CSSProperties}><span><strong>{tasks.length}</strong><small>tarefas</small></span></div><div className="donut-legend"><span><i className="complete" /> Concluídas <strong>{completedTasks}</strong></span><span><i className="pending" /> Pendentes <strong>{pendingTasks}</strong></span></div></div>
        </section>

        <section className="chart-card habits-report">
          <div className="card-heading"><div><span>HOJE</span><h2>Hábitos cadastrados</h2></div></div>
          <div className="progress-habit-list">
            {habits.length === 0 && <p className="report-empty">Nenhum hábito cadastrado ainda.</p>}
            {habits.map((habit, index) => <m.div className="progress-habit-row" key={habit.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.04 }}><span>{habit.completed ? <Check /> : <CircleDashed />}</span><div><strong>{habit.name}</strong><small>{habit.time}</small></div><b>{habit.completed ? 'Feito' : 'Pendente'}</b></m.div>)}
          </div>
        </section>

        <section className="chart-card rewards-history">
          <div className="card-heading"><div><span>RECOMPENSAS</span><h2>Patinhas recentes</h2></div></div>
          {transactions.length === 0 && <p className="report-empty">Suas primeiras recompensas aparecerão aqui.</p>}
          {transactions.slice(0, 4).map((transaction, index) => <m.div className="transaction-row" key={transaction.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + index * 0.05 }}><span><PawPrint fill="currentColor" /></span><div><strong>{transaction.description}</strong><small>{transaction.date}</small></div><b>+{transaction.amount}</b></m.div>)}
        </section>
      </div>
    </m.div>
  )
}
