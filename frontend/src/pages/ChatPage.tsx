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
  Mic,
  Paperclip,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'

type ChatMode = 'livre' | 'planejar' | 'estudar' | 'idiomas'
type DetailLevel = 'curto' | 'equilibrado' | 'detalhado'

interface ChatMessage {
  id: number
  sender: 'user' | 'pet'
  text: string
  suggestion?: boolean
}

const modes: Array<{ id: ChatMode; label: string; icon: typeof Sparkles }> = [
  { id: 'livre', label: 'Conversa livre', icon: Sparkles },
  { id: 'planejar', label: 'Planejar', icon: CalendarDays },
  { id: 'estudar', label: 'Estudar', icon: BookOpen },
  { id: 'idiomas', label: 'Praticar idioma', icon: Languages },
]

export function ChatPage() {
  const { pet, userName, setTasks } = useWoofy()
  const [input, setInput] = useState('')
  const [added, setAdded] = useState(false)
  const [mode, setMode] = useState<ChatMode>('livre')
  const [detail, setDetail] = useState<DetailLevel>('equilibrado')
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [useRoutine, setUseRoutine] = useState(true)
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const [attachment, setAttachment] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'pet', text: `Oi, ${userName}! Este espaço é seu. Podemos conversar livremente, estudar, praticar um idioma ou transformar uma ideia em plano — você escolhe.` },
  ])

  const buildReply = (text: string) => {
    const normalized = text.toLowerCase()
    if (mode === 'idiomas' || normalized.includes('inglês') || normalized.includes('english')) {
      return { text: `Of course, ${userName}! We can talk naturally in English. I can gently correct you after each message, only when it helps. What would you like to talk about?` }
    }
    if (normalized.includes('cansad') || normalized.includes('sobrecarreg') || normalized.includes('ansios')) {
      return { text: 'Obrigado por me contar. Não precisamos transformar tudo em produtividade. Podemos só organizar o que está pesando, escolher uma coisa pequena ou até decidir que agora é hora de descansar. O que seria mais útil para você?' }
    }
    if (mode === 'estudar' || normalized.includes('prova') || normalized.includes('estudar')) {
      return { text: 'Podemos estudar do jeito que funciona melhor para você: explicação, resumo, perguntas, simulado ou um plano por etapas. Preparei uma sugestão inicial, mas você pode mudar tudo antes de salvar.', suggestion: true }
    }
    if (mode === 'planejar' || normalized.includes('organizar') || normalized.includes('tarefa')) {
      return { text: 'Vamos tirar isso da cabeça e colocar em uma ordem possível. Considerei seu ritmo e deixei espaço para pausas. Esta é só uma proposta — você pode editar, ignorar ou adicionar quando quiser.', suggestion: true }
    }
    return { text: detail === 'curto' ? 'Entendi. Quer que eu ajude a pensar nisso ou prefere apenas conversar?' : `Entendi, ${userName}. Podemos explorar isso sem transformar a conversa em uma lista de tarefas. Se quiser, posso fazer perguntas, explicar um assunto, comparar opções ou apenas acompanhar seu raciocínio. Por onde você quer continuar?` }
  }

  const send = (text = input) => {
    const cleanText = text.trim()
    if (!cleanText || typing) return
    const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: cleanText }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setAdded(false)
    setTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, sender: 'pet', ...buildReply(cleanText) }])
      setTyping(false)
    }, 520)
  }

  const addSuggestions = () => {
    setTasks((current) => [
      { id: Date.now(), title: 'Revisar os conceitos principais', category: 'Estudos', priority: 'Alta', date: 'Hoje', completed: false },
      { id: Date.now() + 1, title: 'Praticar com 5 exercícios', category: 'Estudos', priority: 'Média', date: 'Hoje', completed: false },
      { id: Date.now() + 2, title: 'Fazer uma revisão curta', category: 'Estudos', priority: 'Baixa', date: 'Amanhã', completed: false },
      ...current,
    ])
    setAdded(true)
  }

  const startNewConversation = () => {
    setMessages([{ id: Date.now(), sender: 'pet', text: `Novo cantinho, nova conversa. Sobre o que você quer falar, ${userName}?` }])
    setMode('livre')
    setAttachment('')
  }

  return (
    <div className="chat-page chat-page-v2 page-enter">
      <aside className="chat-sidebar">
        <button className="button button-primary button-block" onClick={startNewConversation}><Plus /> Nova conversa</button>
        <span className="chat-side-label">SUAS CONVERSAS</span>
        <button className="chat-history-item active"><span><Sparkles /></span><div><strong>Conversa livre</strong><small>Agora</small></div></button>
        <button className="chat-history-item"><span><CalendarDays /></span><div><strong>Organizar meu dia</strong><small>Hoje</small></div></button>
        <button className="chat-history-item"><span><BookOpen /></span><div><strong>Plano para a prova</strong><small>Ontem</small></div></button>
        <button className="chat-history-item"><span><Languages /></span><div><strong>Prática de inglês</strong><small>02 ago</small></div></button>
        <div className="chat-safe-note"><Brain /><p>Você controla o contexto. {pet.name} nunca cria ou altera nada sem pedir.</p></div>
      </aside>

      <section className="chat-main">
        <header className="chat-header chat-header-v2">
          <div className="chat-header-pet"><Mascot coat={pet.coat} size="sm" accessory="none" /></div>
          <div><span>Conversando com</span><h1>{pet.name}</h1><small><i /> Online e sem julgamentos</small></div>
          <div className="chat-header-tools">
            <label className="mode-select"><span>{modes.find((item) => item.id === mode)?.label}</span><ChevronDown /><select value={mode} onChange={(event) => setMode(event.target.value as ChatMode)}>{modes.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
            <button type="button" onClick={() => setPreferencesOpen(true)} aria-label="Preferências da conversa"><SlidersHorizontal /></button>
          </div>
        </header>

        <div className="chat-messages">
          {messages.length === 1 && (
            <div className="chat-welcome">
              <div className="chat-welcome-pet"><Mascot coat={pet.coat} size="lg" state="happy" /></div>
              <span>ESPAÇO LIVRE</span>
              <h2>Converse sobre o que quiser.</h2>
              <p>Não precisa escolher uma função. Escreva naturalmente e {pet.name} acompanha você.</p>
            </div>
          )}
          <div className="chat-day-divider"><span>Hoje</span></div>
          {messages.map((message) => (
            <div className={`chat-message-row ${message.sender}`} key={message.id}>
              {message.sender === 'pet' && <span className="chat-message-avatar"><Mascot coat={pet.coat} size="sm" accessory="none" /></span>}
              <div>
                <div className="chat-message-bubble">{message.text}</div>
                {message.suggestion && (
                  <div className="chat-task-suggestion">
                    <span className="suggestion-label"><ListChecks /> RASCUNHO EDITÁVEL</span>
                    {['Revisar os conceitos principais', 'Praticar com 5 exercícios', 'Fazer uma revisão curta'].map((item, index) => <span className="suggested-task" key={item}><i>{index + 1}</i><strong contentEditable suppressContentEditableWarning>{item}</strong><small>{index === 2 ? 'Amanhã' : 'Hoje'}</small></span>)}
                    <div className="suggestion-actions"><button type="button" className="suggestion-edit">Continuar ajustando</button><button type="button" onClick={addSuggestions} disabled={added}>{added ? <Check /> : <Plus />} {added ? 'Adicionadas' : 'Adicionar tarefas'}</button></div>
                    <small>Nada será salvo sem a sua confirmação.</small>
                  </div>
                )}
                {message.sender === 'pet' && <div className="message-actions"><button title="Copiar"><Copy /></button><button title="Gerar outra resposta"><RotateCcw /></button></div>}
              </div>
            </div>
          ))}
          {typing && <div className="chat-message-row pet"><span className="chat-message-avatar"><Mascot coat={pet.coat} size="sm" accessory="none" /></span><div className="typing-indicator"><i /><i /><i /></div></div>}
        </div>

        <div className="chat-composer-wrap chat-composer-v2">
          <div className="conversation-modes">
            {modes.map(({ id, label, icon: Icon }) => <button className={mode === id ? 'active' : ''} key={id} onClick={() => setMode(id)}><Icon /> {label}</button>)}
          </div>
          {attachment && <div className="attached-file"><Paperclip /><span>{attachment}</span><button onClick={() => setAttachment('')}><X /></button></div>}
          <div className="chat-composer">
            <textarea rows={2} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send() } }} placeholder={`Fale livremente com ${pet.name}...`} />
            <div className="composer-actions">
              <input ref={fileInput} hidden type="file" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? '')} />
              <button className="composer-tool" onClick={() => fileInput.current?.click()} aria-label="Anexar arquivo"><Paperclip /></button>
              <button className={`composer-tool ${listening ? 'is-listening' : ''}`} onClick={() => setListening((value) => !value)} aria-label="Usar voz"><Mic /></button>
              <span />
              <button className="composer-send" onClick={() => send()} disabled={!input.trim() || typing} aria-label="Enviar mensagem"><ArrowUp /></button>
            </div>
          </div>
          <p><Clock3 /> Você pode falar sobre qualquer assunto. Confirme informações importantes.</p>
        </div>
      </section>

      <aside className={`chat-preferences ${preferencesOpen ? 'is-open' : ''}`}>
        <div className="preferences-heading"><div><span>PREFERÊNCIAS</span><h2>Sua conversa, seu jeito</h2></div><button onClick={() => setPreferencesOpen(false)}><X /></button></div>
        <div className="preference-section"><strong>Tipo de conversa</strong><div className="preference-mode-grid">{modes.map(({ id, label, icon: Icon }) => <button className={mode === id ? 'active' : ''} key={id} onClick={() => setMode(id)}><Icon /><span>{label}</span>{mode === id && <Check />}</button>)}</div></div>
        <div className="preference-section"><strong>Detalhamento das respostas</strong><div className="detail-control">{(['curto', 'equilibrado', 'detalhado'] as DetailLevel[]).map((item) => <button className={detail === item ? 'active' : ''} key={item} onClick={() => setDetail(item)}>{item}</button>)}</div></div>
        <div className="preference-section"><strong>Contexto permitido</strong><label className="preference-toggle"><span><CalendarDays /><span><b>Usar minha rotina</b><small>Tarefas, hábitos e horários ajudam a personalizar respostas.</small></span></span><button className={`toggle ${useRoutine ? 'on' : ''}`} onClick={() => setUseRoutine((value) => !value)}><i /></button></label><label className="preference-toggle"><span><Globe2 /><span><b>Alternar idiomas livremente</b><small>{pet.name} acompanha o idioma da sua mensagem.</small></span></span><button className="toggle on"><i /></button></label></div>
        <div className="freedom-note"><Sparkles /><p><strong>Você não está preso a um modo.</strong> As opções só ajudam a calibrar a resposta. Escreva o que quiser a qualquer momento.</p></div>
      </aside>
      {preferencesOpen && <button className="preferences-overlay" onClick={() => setPreferencesOpen(false)} aria-label="Fechar preferências" />}
    </div>
  )
}
