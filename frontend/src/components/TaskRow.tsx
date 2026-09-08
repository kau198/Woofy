import { Check, ChevronDown, Clock3, MoreHorizontal } from 'lucide-react'
import type { Task } from '../types'
import { useState } from 'react'
import { TaskEditor } from './TaskEditor'
import { apiRequest, runAction } from '../services/api'
import { useWoofy } from '../contexts/WoofyContext'

const priorityClass = { Alta: 'high', Média: 'medium', Baixa: 'low' }

export function TaskRow({ task, onToggle, compact = false }: { task: Task; onToggle: () => void | Promise<void>; compact?: boolean }) {
  const { refreshData } = useWoofy()
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const toggle = async () => { setBusy(true); try { await onToggle() } finally { setBusy(false) } }
  const addStep = async (event: React.FormEvent) => {
    event.preventDefault()
    await apiRequest(`/tasks/${task.id}/subtasks`, { method: 'POST', body: JSON.stringify({ title }) })
    setTitle(''); await refreshData()
  }
  return (
    <>
    <article className={`task-row ${task.completed ? 'is-completed' : ''} ${compact ? 'is-compact' : ''}`}>
      <button className="task-checkbox" disabled={busy} onClick={() => runAction(toggle())} aria-label={task.completed ? 'Marcar tarefa como pendente' : 'Concluir tarefa'}>{task.completed && <Check size={14} />}</button>
      <div className="task-row-content">
        <div className="task-row-title"><strong>{task.title}</strong>{!compact && <button className="subtask-trigger" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><ChevronDown size={13} /> {task.subtasks?.length ? `${task.subtasks.filter((item) => item.completed).length}/${task.subtasks.length}` : 'Etapas'}</button>}</div>
        <div className="task-row-meta"><span className={`category-dot category-${task.category.toLowerCase()}`} /> {task.category}{task.time && <><Clock3 size={13} /> {task.time}</>} {!compact && <span className={`priority priority-${priorityClass[task.priority]}`}>{task.priority}</span>}</div>
      </div>
      {!compact && <button className="icon-button" onClick={() => setEditing(true)} aria-label={`Editar ${task.title}`}><MoreHorizontal /></button>}
    </article>
    {expanded && <div className="subtask-list">{task.description && <p>{task.description}</p>}{task.subtasks?.map((step) => <div className="subtask-item" key={step.id}><label><input type="checkbox" checked={step.completed} onChange={() => runAction(apiRequest(`/subtasks/${step.id}`, { method: 'PATCH', body: JSON.stringify({ title: step.title, completed: !step.completed }) }).then(refreshData))} />{step.title}</label><button className="icon-button" aria-label={`Excluir etapa ${step.title}`} onClick={() => runAction(apiRequest(`/subtasks/${step.id}`, { method: 'DELETE' }).then(refreshData))}>×</button></div>)}<form onSubmit={(event) => runAction(addStep(event))}><input required maxLength={180} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Adicionar uma etapa" aria-label="Título da etapa" /><button type="submit" className="button button-ghost">Adicionar</button></form></div>}
    {editing && <TaskEditor task={task} close={() => setEditing(false)} />}
    </>
  )
}
