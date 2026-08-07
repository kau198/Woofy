import { CalendarDays, CheckSquare2, ChevronDown, Filter, ListFilter, Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TaskRow } from '../components/TaskRow'
import { useWoofy } from '../contexts/WoofyContext'
import type { Task, TaskCategory, TaskPriority } from '../types'

export function TasksPage() {
  const { tasks, setTasks, toggleTask } = useWoofy()
  const [filter, setFilter] = useState<'Todas' | 'Pendentes' | 'Concluídas'>('Todas')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TaskCategory>('Pessoal')
  const [priority, setPriority] = useState<TaskPriority>('Média')

  const filtered = useMemo(() => tasks.filter((task) => {
    const statusMatches = filter === 'Todas' || (filter === 'Pendentes' ? !task.completed : task.completed)
    return statusMatches && task.title.toLowerCase().includes(query.toLowerCase())
  }), [tasks, filter, query])

  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newTask: Task = { id: Date.now(), title, category, priority, date: 'Hoje', completed: false }
    setTasks((current) => [newTask, ...current])
    setTitle('')
    setModalOpen(false)
  }

  return (
    <div className="tasks-page page-enter">
      <div className="page-heading-row">
        <div><span className="page-kicker">ORGANIZE SEU DIA</span><h1>Minhas tarefas</h1><p>Um passo de cada vez. Você não precisa resolver tudo agora.</p></div>
        <button className="button button-primary" onClick={() => setModalOpen(true)}><Plus /> Nova tarefa</button>
      </div>

      <section className="tasks-toolbar">
        <div className="filter-tabs">{(['Todas', 'Pendentes', 'Concluídas'] as const).map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}<span>{item === 'Todas' ? tasks.length : item === 'Pendentes' ? tasks.filter((task) => !task.completed).length : tasks.filter((task) => task.completed).length}</span></button>)}</div>
        <div className="toolbar-actions"><label className="search-field"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tarefa" /></label><button className="toolbar-button"><Filter /> Filtros</button><button className="toolbar-button"><ListFilter /> Ordenar <ChevronDown /></button></div>
      </section>

      <div className="tasks-layout">
        <section className="task-list-panel">
          <div className="task-group-heading"><span><CalendarDays /> Hoje</span><small>{tasks.filter((task) => task.date === 'Hoje' && !task.completed).length} pendentes</small></div>
          <div className="full-task-list">{filtered.filter((task) => task.date === 'Hoje').map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}</div>
          <div className="task-group-heading tomorrow"><span><CalendarDays /> Amanhã</span><small>{tasks.filter((task) => task.date === 'Amanhã').length} tarefa</small></div>
          <div className="full-task-list">{filtered.filter((task) => task.date === 'Amanhã').map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}</div>
          {filtered.length === 0 && <div className="empty-state"><CheckSquare2 /><h3>Nada por aqui</h3><p>Que tal respirar um pouco ou adicionar uma tarefa pequena?</p></div>}
        </section>
        <aside className="task-side-summary">
          <div className="summary-ring" style={{ '--progress': `${Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)}%` } as React.CSSProperties}><span><strong>{tasks.filter((task) => task.completed).length}</strong><small>de {tasks.length}</small></span></div>
          <h3>Seu dia está andando!</h3><p>Cada tarefa concluída rende 10 patinhas.</p><div className="side-divider" /><span className="paws-earned">🐾 <strong>+{tasks.filter((task) => task.completed).length * 10}</strong> hoje</span>
        </aside>
      </div>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}><form className="task-modal" onSubmit={addTask} onMouseDown={(event) => event.stopPropagation()}><div className="modal-heading"><div><span>NOVA TAREFA</span><h2>O que vamos fazer?</h2></div><button type="button" onClick={() => setModalOpen(false)}><X /></button></div><label>Título<input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Revisar anotações" /></label><label>Descrição <small>opcional</small><textarea rows={3} placeholder="Adicione alguns detalhes" /></label><div className="form-grid"><label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)}>{['Pessoal', 'Estudos', 'Trabalho', 'Saúde', 'Casa', 'Outros'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Prioridade<select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{['Baixa', 'Média', 'Alta'].map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="modal-footer"><button className="button button-ghost" type="button" onClick={() => setModalOpen(false)}>Cancelar</button><button className="button button-primary" type="submit">Criar tarefa</button></div></form></div>}
    </div>
  )
}
