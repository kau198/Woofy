import { Check, Leaf, Pause, PawPrint, Play, RotateCcw, Sun, Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'
import { apiRequest, runAction } from '../services/api'

interface FocusSession { id: number; minutes: number; secondsLeft: number; running: boolean; completed: boolean }

export function FocusPage() {
  const { pet, refreshData, tasks } = useWoofy()
  const [minutes, setMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState(true)
  const [done, setDone] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const deadline = useRef(0)
  const completionPending = useRef(false)
  const audio = useRef<AudioContext | null>(null)

  const applySession = (session: FocusSession) => {
    setSessionId(session.id); setMinutes(session.minutes); setSecondsLeft(session.secondsLeft)
    setRunning(session.running); setDone(session.completed)
    deadline.current = Date.now() + session.secondsLeft * 1000
  }
  useEffect(() => {
    runAction(apiRequest<FocusSession | null>('/focus-sessions/active').then((session) => { if (session) applySession(session) }))
    return () => { void audio.current?.close() }
  }, [])

  useEffect(() => {
    if (!running || !sessionId) return
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining > 0 || completionPending.current) return
      completionPending.current = true
      runAction(apiRequest<FocusSession>(`/focus-sessions/${sessionId}/complete`, { method: 'POST' }).then(async (session) => {
        applySession(session)
        if (sound && audio.current) {
          const oscillator = audio.current.createOscillator()
          const gain = audio.current.createGain()
          oscillator.connect(gain); gain.connect(audio.current.destination)
          gain.gain.value = 0.06; oscillator.frequency.value = 660
          oscillator.start(); oscillator.stop(audio.current.currentTime + 0.3)
        }
        await refreshData()
      }).catch((error: unknown) => { setRunning(false); throw error }).finally(() => { completionPending.current = false }))
    }
    const timer = window.setInterval(tick, 250)
    tick()
    return () => clearInterval(timer)
  }, [running, sessionId, sound, refreshData])

  const change = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (sound && !audio.current) audio.current = new AudioContext()
      await audio.current?.resume()
      const session = !sessionId || done
        ? await apiRequest<FocusSession>('/focus-sessions', { method: 'POST', body: JSON.stringify({ minutes }) })
        : await apiRequest<FocusSession>(`/focus-sessions/${sessionId}/${running ? 'pause' : 'resume'}`, { method: 'POST' })
      applySession(session)
    } finally { setBusy(false) }
  }
  const selectMinutes = async (value: number) => {
    if (sessionId && !done) await apiRequest(`/focus-sessions/${sessionId}/cancel`, { method: 'POST' })
    setSessionId(null); setMinutes(value); setSecondsLeft(value * 60); setRunning(false); setDone(false)
  }
  const reset = () => selectMinutes(minutes)
  const displayMinutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const displaySeconds = (secondsLeft % 60).toString().padStart(2, '0')
  const progress = 1 - secondsLeft / (minutes * 60)
  const companionMessage = done ? 'Conseguimos! Você merece uma pausa.' : running ? 'Estou aqui. Só mais um passo.' : 'Pronto quando você estiver.'
  const companionState = done ? 'done' : running ? 'running' : 'ready'
  const focusTask = tasks.find((task) => !task.completed)?.title ?? 'Escolha uma tarefa da sua lista'

  return (
    <m.div className="focus-page page-enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
      <div className="focus-topbar"><div><span className="page-kicker">MODO FOCO</span><h1>Um momento só para isso.</h1><p>{pet.name} fica aqui com você. Sem pressa, sem distrações.</p></div><m.button type="button" className="sound-button" onClick={() => setSound((value) => !value)} aria-pressed={sound} whileTap={{ scale: 0.95 }}>{sound ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />} Sons {sound ? 'ligados' : 'desligados'}</m.button></div>
      <m.section className="focus-room" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.04 }}>
        <div className="focus-room-decor focus-plant" aria-hidden="true"><Leaf size={76} strokeWidth={1.4} /></div><div className="focus-room-decor focus-window" aria-hidden="true"><Sun size={34} strokeWidth={1.7} /></div>
        <m.div className="focus-companion" animate={{ y: running ? -3 : 0, scale: done ? 1.02 : 1 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="xl" state={running ? 'studying' : done ? 'celebrating' : 'normal'} /><AnimatePresence mode="wait" initial={false}><m.div key={companionState} className="focus-speech" role="status" aria-live="polite" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>{companionMessage}</m.div></AnimatePresence></m.div>
        <m.div className="timer-panel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="timer-task"><span>FOCANDO EM</span><strong>{focusTask}</strong></div>
          <m.div className="timer-ring" style={{ '--timer-progress': `${progress * 360}deg` } as React.CSSProperties} animate={{ scale: done ? 1.025 : 1 }} transition={{ type: 'spring', stiffness: 210, damping: 18 }}><div><strong>{displayMinutes}</strong><i>:</i><strong>{displaySeconds}</strong><span>{running ? 'EM FOCO' : done ? 'CONCLUÍDO' : 'PRONTO'}</span></div></m.div>
          <div className="timer-controls"><m.button type="button" className="timer-secondary" onClick={() => runAction(reset())} disabled={busy} aria-label="Reiniciar" whileTap={{ rotate: -24, scale: 0.92 }}><RotateCcw /></m.button><m.button type="button" className="timer-main" onClick={() => runAction(change())} disabled={busy} aria-pressed={running} whileTap={{ scale: 0.97 }}>{running ? <Pause fill="currentColor" /> : <Play fill="currentColor" />} {running ? 'Pausar' : done ? 'Focar novamente' : 'Começar foco'}</m.button></div>
          <div className="timer-presets">{[15, 25, 45, 60].map((value) => <m.button type="button" className={minutes === value ? 'active' : ''} key={value} onClick={() => runAction(selectMinutes(value))} disabled={busy} aria-pressed={minutes === value} whileTap={{ scale: 0.94 }}>{value} min</m.button>)}</div>
          <div className="focus-reward"><PawPrint size={17} aria-hidden="true" /><p>Complete a sessão e ganhe <strong>+{Math.max(5, Math.round(minutes / 2))} patinhas</strong></p></div>
        </m.div>
      </m.section>
      <section className="focus-tips"><span><Check /> Coloque o celular no silencioso</span><span><Check /> Feche abas que não vai usar</span><span><Check /> Tenha água por perto</span></section>
    </m.div>
  )
}
