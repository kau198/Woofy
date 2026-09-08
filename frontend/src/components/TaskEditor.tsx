import { useState } from 'react'
import { X } from 'lucide-react'
import { apiRequest, runAction } from '../services/api'
import { useWoofy } from '../contexts/WoofyContext'
import type { Task } from '../types'

export function TaskEditor({ task, close }: { task: Task; close: () => void }) {
  const { refreshData } = useWoofy()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [date, setDate] = useState(task.dueDate ?? '')
  const [time, setTime] = useState(task.time ?? '')
  const [category, setCategory] = useState(task.category)
  const [priority, setPriority] = useState(task.priority)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true)
    try {
      await apiRequest(`/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ title, description, date: date || 'Hoje', time: time || null, category, priority }) })
      await refreshData(); close()
    } finally { setBusy(false) }
  }
  const remove = async () => {
    setBusy(true)
    try { await apiRequest(`/tasks/${task.id}`, { method: 'DELETE' }); await refreshData(); close() }
    finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onMouseDown={close}><form className="task-modal" role="dialog" aria-modal="true" aria-label="Editar tarefa" onMouseDown={(event) => event.stopPropagation()} onSubmit={(event) => runAction(save(event))}>
    <div className="modal-heading"><h2>Editar tarefa</h2><button type="button" onClick={close} aria-label="Fechar"><X /></button></div>
    <label>Título<input required maxLength={180} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
    <label>Descrição<textarea maxLength={2000} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
    <div className="form-grid"><label>Data<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Horário<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label></div>
    <div className="form-grid"><label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value as Task['category'])}>{['Pessoal', 'Estudos', 'Trabalho', 'Saúde', 'Casa', 'Outros'].map((value) => <option key={value}>{value}</option>)}</select></label><label>Prioridade<select value={priority} onChange={(event) => setPriority(event.target.value as Task['priority'])}>{['Baixa', 'Média', 'Alta'].map((value) => <option key={value}>{value}</option>)}</select></label></div>
    {confirmDelete && <p role="alert">Excluir esta tarefa e todas as suas etapas?</p>}
    <div className="modal-footer"><button type="button" className="button button-ghost" disabled={busy} onClick={() => confirmDelete ? runAction(remove()) : setConfirmDelete(true)}>{confirmDelete ? 'Confirmar exclusão' : 'Excluir'}</button><button className="button button-primary" disabled={busy}>{busy ? 'Salvando...' : 'Salvar'}</button></div>
  </form></div>
}
