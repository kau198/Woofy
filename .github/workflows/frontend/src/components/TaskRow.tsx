import { Check, ChevronDown, Clock3, MoreHorizontal } from 'lucide-react'
import type { Task } from '../types'

const priorityClass = { Alta: 'high', Média: 'medium', Baixa: 'low' }

export function TaskRow({ task, onToggle, compact = false }: { task: Task; onToggle: () => void; compact?: boolean }) {
  return (
    <article className={`task-row ${task.completed ? 'is-completed' : ''} ${compact ? 'is-compact' : ''}`}>
      <button className="task-checkbox" onClick={onToggle} aria-label={task.completed ? 'Marcar tarefa como pendente' : 'Concluir tarefa'}>{task.completed && <Check size={14} />}</button>
      <div className="task-row-content">
        <div className="task-row-title"><strong>{task.title}</strong>{task.subtasks && <span><ChevronDown size={13} /> {task.subtasks.filter((item) => item.completed).length}/{task.subtasks.length}</span>}</div>
        <div className="task-row-meta"><span className={`category-dot category-${task.category.toLowerCase()}`} /> {task.category}{task.time && <><Clock3 size={13} /> {task.time}</>} {!compact && <span className={`priority priority-${priorityClass[task.priority]}`}>{task.priority}</span>}</div>
      </div>
      {!compact && <button className="icon-button" aria-label="Mais opções"><MoreHorizontal /></button>}
    </article>
  )
}
