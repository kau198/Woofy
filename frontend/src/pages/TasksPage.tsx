import { CalendarDays, CheckSquare2, ChevronDown, Filter, ListFilter, PawPrint, Plus, Search, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useMemo, useState } from 'react'
import { TaskRow } from '../components/TaskRow'
import { useWoofy } from '../contexts/WoofyContext'
import { runAction } from '../services/api'
import type { TaskCategory, TaskPriority } from '../types'

export function TasksPage() {
  const { tasks, addTask: createTask, toggleTask } = useWoofy()
  const [filter, setFilter] = useState<'Todas' | 'Pendentes' | 'Concluídas'>('Todas')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'Todas' | TaskCategory>('Todas')
  const [order, setOrder] = useState<'recentes' | 'alfabetica' | 'prioridade'>('recentes')
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('Pessoal')
  const [priority, setPriority] = useState<TaskPriority>('Média')

  const filtered = useMemo(() => tasks.filter((task) => {
    const statusMatches = filter === 'Todas' || (filter === 'Pendentes' ? !task.completed : task.completed)
    const categoryMatches = categoryFilter === 'Todas' || task.category === categoryFilter
    const searchable = `${task.title} ${task.description ?? ''} ${task.category}`.toLowerCase()
    return statusMatches && categoryMatches && searchable.includes(query.toLowerCase())
  }).sort((a, b) => {
    if (order === 'alfabetica') return a.title.localeCompare(b.title, 'pt-BR')
    if (order === 'prioridade') return ({ Alta: 0, Média: 1, Baixa: 2 }[a.priority] - { Alta: 0, Média: 1, Baixa: 2 }[b.priority])
    return b.id - a.id
  }), [tasks, filter, query, categoryFilter, order])

  const addTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    try {
    await createTask({ title: title.trim(), description: description.trim() || undefined, category, priority, date: dueDate || 'Hoje', time: dueTime || undefined })
    setTitle('')
    setDescription('')
    setModalOpen(false)
    } finally { setBusy(false) }
  }

  return (
    <m.div className="tasks-page page-enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
      <div className="page-heading-row">
        <div><span className="page-kicker">ORGANIZE SEU DIA</span><h1>Minhas tarefas</h1><p>Um passo de cada vez. Você não precisa resolver tudo agora.</p></div>
        <m.button className="button button-primary" onClick={() => setModalOpen(true)} whileTap={{ scale: 0.97 }}><Plus aria-hidden="true" /> Nova tarefa</m.button>
      </div>

      <m.section className="tasks-toolbar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, delay: 0.04 }}>
        <div className="filter-tabs">{(['Todas', 'Pendentes', 'Concluídas'] as const).map((item) => <m.button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item} aria-pressed={filter === item} whileTap={{ scale: 0.96 }}>{item}<span>{item === 'Todas' ? tasks.length : item === 'Pendentes' ? tasks.filter((task) => !task.completed).length : tasks.filter((task) => task.completed).length}</span></m.button>)}</div>
        <div className="toolbar-actions"><label className="search-field"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tarefa" /></label><label className="toolbar-button toolbar-select"><Filter /><select aria-label="Filtrar por categoria" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)}><option value="Todas">Todas as categorias</option>{['Pessoal', 'Estudos', 'Trabalho', 'Saúde', 'Casa', 'Outros'].map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></label><label className="toolbar-button toolbar-select"><ListFilter /><select aria-label="Ordenar tarefas" value={order} onChange={(event) => setOrder(event.target.value as typeof order)}><option value="recentes">Mais recentes</option><option value="alfabetica">Ordem alfabética</option><option value="prioridade">Por prioridade</option></select><ChevronDown /></label></div>
      </m.section>

      <div className="tasks-layout">
        <section className="task-list-panel">
          <div className="task-group-heading"><span><CalendarDays /> Hoje</span><small>{tasks.filter((task) => task.date === 'Hoje' && !task.completed).length} pendentes</small></div>
          <div className="full-task-list">{filtered.filter((task) => task.date === 'Hoje').map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}</div>
          <div className="task-group-heading tomorrow"><span><CalendarDays /> Amanhã</span><small>{tasks.filter((task) => task.date === 'Amanhã').length} tarefa</small></div>
          <div className="full-task-list">{filtered.filter((task) => task.date === 'Amanhã').map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}</div>
          {filtered.some((task) => !['Hoje', 'Amanhã'].includes(task.date)) && <><div className="task-group-heading"><span><CalendarDays /> Outras datas</span></div>{filtered.filter((task) => !['Hoje', 'Amanhã'].includes(task.date)).map((task) => <div key={task.id}><small className="task-date-label">{task.date.split('-').reverse().join('/')}</small><TaskRow task={task} onToggle={() => toggleTask(task.id)} /></div>)}</>}
          <AnimatePresence>{filtered.length === 0 && <m.div className="empty-state" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}><CheckSquare2 /><h3>Nada por aqui</h3><p>Que tal respirar um pouco ou adicionar uma tarefa pequena?</p></m.div>}</AnimatePresence>
        </section>
        <m.aside className="task-side-summary" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.38, delay: 0.08 }}>
          <div className="summary-ring" style={{ '--progress': `${Math.round((tasks.filter((task) => task.completed).length / Math.max(1, tasks.length)) * 100)}%` } as React.CSSProperties}><span><strong>{tasks.filter((task) => task.completed).length}</strong><small>de {tasks.length}</small></span></div>
          <h3>Seu dia está andando!</h3><p>Cada tarefa concluída rende 10 patinhas.</p><div className="side-divider" /><span className="paws-earned"><PawPrint aria-hidden="true" /> <m.strong key={tasks.filter((task) => task.completed).length} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>+{tasks.filter((task) => task.completed).length * 10}</m.strong> hoje</span>
        </m.aside>
      </div>

      <AnimatePresence>
        {modalOpen && <m.div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><m.form className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" onSubmit={(event) => runAction(addTask(event))} onMouseDown={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.99 }} transition={{ duration: 0.22 }}><div className="modal-heading"><div><span>NOVA TAREFA</span><h2 id="task-modal-title">O que vamos fazer?</h2></div><button type="button" onClick={() => setModalOpen(false)} aria-label="Fechar"><X /></button></div><label>Título<input maxLength={180} required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Revisar anotações" /></label><label>Descrição <small>opcional</small><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Adicione alguns detalhes" /></label><div className="form-grid"><label>Data<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label>Horário<input type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} /></label></div><div className="form-grid"><label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)}>{['Pessoal', 'Estudos', 'Trabalho', 'Saúde', 'Casa', 'Outros'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Prioridade<select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{['Baixa', 'Média', 'Alta'].map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="modal-footer"><button className="button button-ghost" type="button" onClick={() => setModalOpen(false)}>Cancelar</button><m.button className="button button-primary" type="submit" disabled={busy} whileTap={{ scale: 0.97 }}>{busy ? 'Salvando...' : 'Criar tarefa'}</m.button></div></m.form></m.div>}
      </AnimatePresence>
    </m.div>
  )
}
