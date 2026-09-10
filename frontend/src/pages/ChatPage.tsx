import {
  ArrowUp,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Globe2,
  Languages,
  ListChecks,
  MessageCircle,
  Mic,
  Paperclip,
  Plus,
  SlidersHorizontal,
  Tag,
  Unlock,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'
import { apiRequest, ApiError, runAction } from '../services/api'
import { createRecognition } from '../services/voice'
import type { TaskCategory, TaskPriority } from '../types'

type ChatMode = 'livre' | 'explorar' | 'planejar' | 'estudar' | 'idiomas'
type DetailLevel = 'curto' | 'equilibrado' | 'detalhado'

interface ChatMessage {
  id: number
  sender: 'user' | 'pet'
  text: string
  accepted?: boolean
  suggestions?: Array<{ title: string; category: TaskCategory; priority: TaskPriority; date: string }>
}

const modes: Array<{ id: ChatMode; label: string; icon: typeof MessageCircle }> = [
  { id: 'livre', label: 'Conversa livre', icon: MessageCircle },
  { id: 'explorar', label: 'Explorar assuntos', icon: Globe2 },
  { id: 'planejar', label: 'Planejar', icon: CalendarDays },
  { id: 'estudar', label: 'Estudar', icon: BookOpen },
  { id: 'idiomas', label: 'Praticar idioma', icon: Languages },
]

export function ChatPage() {
  const { pet, userName, interests, refreshData } = useWoofy()
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState<number | null>(null)
  const [conversation, setConversation] = useState('default')
  const [conversations, setConversations] = useState<Array<{ id: string; title: string }>>([])
  const [attachmentText, setAttachmentText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const voice = useRef<ReturnType<typeof createRecognition>>(null)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<ChatMode>('livre')
  const [detail, setDetail] = useState<DetailLevel>('equilibrado')
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [useRoutine, setUseRoutine] = useState(true)
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const [attachment, setAttachment] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    let active = true
    runAction(apiRequest<ChatMessage[]>(`/chat/messages?conversation=${conversation}`).then((history) => {
      if (active) setMessages(history.length ? history : [{ id: -1, sender: 'pet', text: `Oi, ${userName}! Sobre o que você quer conversar?` }])
    }))
    runAction(apiRequest<Array<{ id: string; title: string }>>('/chat/conversations').then(setConversations))
    return () => { active = false }
  }, [userName, conversation])

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages, typing])

  useEffect(() => () => voice.current?.stop(), [])

  const dictate = () => {
    if (listening) { voice.current?.stop(); return }
    voice.current = createRecognition(
      (text) => setInput((current) => current ? current + ' ' + text : text),
      () => setListening(false),
      () => { setListening(false); setError('Não foi possível usar o microfone. Confira a permissão do navegador.') },
    )
    if (!voice.current) { setError('Ditado não disponível neste navegador. Você pode digitar sua mensagem.'); return }
    try { voice.current.start(); setListening(true) } catch { setError('Microfone indisponível.') }
  }
  const attach = async (file?: File) => {
    if (!file) return
    if (!/\.(txt|md)$/i.test(file.name) || file.size > 12000) {
      setError('Escolha um arquivo .txt ou .md de até 12 KB.'); return
    }
    const text = await file.text()
    setAttachment(file.name); setAttachmentText(text); setError('')
  }

  const send = async (text = input) => {
    const cleanText = text.trim()
    if (!cleanText || typing) return
    const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: cleanText }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setError('')
    setTyping(true)
    try {
      const reply = await apiRequest<ChatMessage>('/chat/messages', { method: 'POST', body: JSON.stringify({ message: cleanText, mode, detail, use_routine: useRoutine, conversation, attachment: attachmentText }) })
      setMessages((current) => [...current, reply])
      setAttachment(''); setAttachmentText('')
      runAction(apiRequest<Array<{ id: string; title: string }>>('/chat/conversations').then(setConversations))
    } catch (reason) {
      setMessages((current) => current.filter((message) => message.id !== userMessage.id))
      setInput(cleanText)
      setError(reason instanceof ApiError ? reason.message : 'Não foi possível enviar a mensagem agora.')
    } finally {
      setTyping(false)
    }
  }

  const addSuggestions = async (message: ChatMessage) => {
    if (adding !== null) return
    setAdding(message.id)
    try {
      await apiRequest(`/chat/messages/${message.id}/accept`, { method: 'POST', body: JSON.stringify({ tasks: message.suggestions }) })
      await refreshData()
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, accepted: true } : item))
    } finally { setAdding(null) }
  }

  const startNewConversation = () => {
    setMessages([]); setConversation(crypto.randomUUID()); setMode('livre'); setAttachment(''); setAttachmentText(''); setError('')
  }

  const selectConversation = (id: string) => {
    if (id === conversation) return
    setMessages([])
    setConversation(id)
  }

  return (
    <div className="chat-page chat-page-v2 page-enter">
      <aside className="chat-sidebar">
        <button className="button button-primary button-block" onClick={startNewConversation} disabled={typing}><Plus /> Nova conversa</button>
        <span className="chat-side-label">CONVERSA ATUAL</span>
        {conversations.map((item) => <button key={item.id} disabled={typing} className={`chat-history-item ${conversation === item.id ? 'active' : ''}`} onClick={() => selectConversation(item.id)}><span><MessageCircle /></span><div><strong>{item.title}</strong></div></button>)}
        <div className="chat-safe-note"><Brain /><p>Você controla o contexto. {pet.name} nunca cria ou altera nada sem pedir.</p></div>
      </aside>

      <section className="chat-main">
        <header className="chat-header chat-header-v2">
          <div className="chat-header-pet"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="sm" state={typing ? 'talking' : 'listening'} accessory="none" /></div>
          <div><span>Conversando com</span><h1>{pet.name}</h1><small><i /> Seu companheiro virtual</small></div>
          <div className="chat-header-tools">
            <label className="mode-select"><span>{modes.find((item) => item.id === mode)?.label}</span><ChevronDown /><select value={mode} onChange={(event) => setMode(event.target.value as ChatMode)}>{modes.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
            <button type="button" onClick={() => setPreferencesOpen(true)} aria-label="Preferências da conversa"><SlidersHorizontal /></button>
          </div>
        </header>

        <div className="chat-messages" ref={scrollRef} role="log" aria-label="Mensagens da conversa">
          {messages.length === 1 && (
            <div className="chat-welcome">
              <div className="chat-welcome-pet"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="lg" state="happy" /></div>
              <span>ESPAÇO LIVRE</span>
              <h2>Converse sobre o que quiser.</h2>
              <p>Não precisa escolher uma função. Comece por um interesse ou escreva naturalmente e {pet.name} acompanha você.</p>
              <div className="interest-shortcuts">{interests.slice(0, 6).map((interest) => <button type="button" key={interest} onClick={() => void send(`Quero conversar sobre ${interest}`)}><Tag aria-hidden="true" /> {interest}</button>)}</div>
            </div>
          )}
          <div className="chat-day-divider"><span>Hoje</span></div>
          {messages.map((message) => (
            <div className={`chat-message-row ${message.sender}`} key={message.id}>
              {message.sender === 'pet' && <span className="chat-message-avatar"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="sm" accessory="none" /></span>}
              <div>
                <div className="chat-message-bubble">{message.text}</div>
                {!!message.suggestions?.length && (
                  <div className="chat-task-suggestion">
                    <span className="suggestion-label"><ListChecks /> RASCUNHO EDITÁVEL</span>
                    {message.suggestions.map((item, index) => <span className="suggested-task" key={`${message.id}-${index}`}><i>{index + 1}</i><input aria-label={`Título da sugestão ${index + 1}`} maxLength={180} disabled={message.accepted} value={item.title} onChange={(event) => setMessages((current) => current.map((row) => row.id === message.id ? { ...row, suggestions: row.suggestions?.map((task, taskIndex) => taskIndex === index ? { ...task, title: event.target.value } : task) } : row))} /><small>{item.date}</small></span>)}
                    <div className="suggestion-actions"><button type="button" className="suggestion-edit" onClick={() => setInput('Quero ajustar o plano: ')}>Continuar ajustando</button><button type="button" onClick={() => runAction(addSuggestions(message))} disabled={message.accepted || adding !== null || message.suggestions.some((item) => !item.title.trim())}>{message.accepted ? <Check /> : <Plus />} {message.accepted ? 'Adicionadas' : 'Adicionar tarefas'}</button></div>
                    <small>Nada será salvo sem a sua confirmação.</small>
                  </div>
                )}
                {message.sender === 'pet' && <div className="message-actions"><button type="button" aria-label="Copiar resposta" title="Copiar resposta" onClick={() => void navigator.clipboard?.writeText(message.text)}><Copy /></button></div>}
              </div>
            </div>
          ))}
          {typing && <div className="chat-message-row pet"><span className="chat-message-avatar"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="sm" state="talking" accessory="none" /></span><div className="typing-indicator"><i /><i /><i /></div></div>}
        </div>

        <div className="chat-composer-wrap chat-composer-v2">
          <div className="conversation-modes">
            {modes.map(({ id, label, icon: Icon }) => <button className={mode === id ? 'active' : ''} key={id} onClick={() => setMode(id)}><Icon /> {label}</button>)}
          </div>
          {attachment && <div className="attached-file"><Paperclip /><span>{attachment}</span><button onClick={() => { setAttachment(''); setAttachmentText('') }}><X /></button></div>}
          <div className="chat-composer">
            <textarea maxLength={4000} rows={2} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send() } }} placeholder={`Fale livremente com ${pet.name}...`} />
            <div className="composer-actions">
              <input ref={fileInput} hidden type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event) => runAction(attach(event.target.files?.[0]))} />
              <button className="composer-tool" onClick={() => fileInput.current?.click()} aria-label="Anexar arquivo"><Paperclip /></button>
              <button className={`composer-tool ${listening ? 'is-listening' : ''}`} onClick={dictate} aria-label="Usar voz"><Mic /></button>
              <span />
              <button className="composer-send" onClick={() => void send()} disabled={!input.trim() || typing} aria-label="Enviar mensagem"><ArrowUp /></button>
            </div>
          </div>
          {error ? <p className="chat-error" role="alert"><Clock3 /> {error}</p> : <p><Clock3 /> As respostas usam apenas o contexto que você autorizou acima.</p>}
        </div>
      </section>

      <aside className={`chat-preferences ${preferencesOpen ? 'is-open' : ''}`}>
        <div className="preferences-heading"><div><span>PREFERÊNCIAS</span><h2>Sua conversa, seu jeito</h2></div><button onClick={() => setPreferencesOpen(false)}><X /></button></div>
        <div className="preference-section"><strong>Tipo de conversa</strong><div className="preference-mode-grid">{modes.map(({ id, label, icon: Icon }) => <button className={mode === id ? 'active' : ''} key={id} onClick={() => setMode(id)}><Icon /><span>{label}</span>{mode === id && <Check />}</button>)}</div></div>
        <div className="preference-section"><strong>Detalhamento das respostas</strong><div className="detail-control">{(['curto', 'equilibrado', 'detalhado'] as DetailLevel[]).map((item) => <button className={detail === item ? 'active' : ''} key={item} onClick={() => setDetail(item)}>{item}</button>)}</div></div>
        <div className="preference-section"><strong>Assuntos que você curte</strong><div className="preference-interests">{interests.map((interest) => <span key={interest}><Tag aria-hidden="true" /> {interest}</span>)}</div></div>
        <div className="preference-section"><strong>Contexto permitido</strong><label className="preference-toggle"><span><CalendarDays /><span><b>Usar minha rotina</b><small>Tarefas, hábitos e horários ajudam a personalizar respostas.</small></span></span><button className={`toggle ${useRoutine ? 'on' : ''}`} onClick={() => setUseRoutine((value) => !value)}><i /></button></label><label className="preference-toggle"><span><Globe2 /><span><b>Alternar idiomas livremente</b><small>{pet.name} acompanha o idioma da sua mensagem.</small></span></span><span aria-label="Ativo">Ativo</span></label></div>
        <div className="freedom-note"><Unlock aria-hidden="true" /><p><strong>Você não está preso a um modo.</strong> As opções só ajudam a calibrar a resposta. Escreva o que quiser a qualquer momento.</p></div>
      </aside>
      {preferencesOpen && <button className="preferences-overlay" onClick={() => setPreferencesOpen(false)} aria-label="Fechar preferências" />}
    </div>
  )
}
