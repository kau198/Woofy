import { Check, ChevronDown, Pause, Play, RotateCcw, Settings2, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'

export function FocusPage() {
  const { pet, addPaws } = useWoofy()
  const [minutes, setMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          setRunning(false)
          setDone(true)
          addPaws(Math.max(5, Math.round(minutes / 2)), 'Sessão de foco concluída')
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running, minutes, addPaws])

  const selectMinutes = (value: number) => { setMinutes(value); setSecondsLeft(value * 60); setRunning(false); setDone(false) }
  const reset = () => { setSecondsLeft(minutes * 60); setRunning(false); setDone(false) }
  const displayMinutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const displaySeconds = (secondsLeft % 60).toString().padStart(2, '0')
  const progress = 1 - secondsLeft / (minutes * 60)

  return (
    <div className="focus-page page-enter">
      <div className="focus-topbar"><div><span className="page-kicker">MODO FOCO</span><h1>Um momento só para isso.</h1><p>{pet.name} fica aqui com você. Sem pressa, sem distrações.</p></div><button className="sound-button" onClick={() => setSound((value) => !value)}>{sound ? <Volume2 /> : <VolumeX />} Sons {sound ? 'ligados' : 'desligados'}</button></div>
      <section className="focus-room">
        <div className="focus-room-decor focus-plant">☘</div><div className="focus-room-decor focus-window">☀</div>
        <div className="focus-companion"><Mascot coat={pet.coat} size="xl" state={running ? 'studying' : done ? 'celebrating' : 'normal'} /><div className="focus-speech">{done ? 'Conseguimos! Você merece uma pausa.' : running ? 'Estou aqui. Só mais um passo.' : 'Pronto quando você estiver.'}</div></div>
        <div className="timer-panel">
          <div className="timer-task"><span>FOCANDO EM</span><button>Revisar banco de dados <ChevronDown /></button></div>
          <div className="timer-ring" style={{ '--timer-progress': `${progress * 360}deg` } as React.CSSProperties}><div><strong>{displayMinutes}</strong><i>:</i><strong>{displaySeconds}</strong><span>{running ? 'EM FOCO' : done ? 'CONCLUÍDO' : 'PRONTO'}</span></div></div>
          <div className="timer-controls"><button className="timer-secondary" onClick={reset} aria-label="Reiniciar"><RotateCcw /></button><button className="timer-main" onClick={() => setRunning((value) => !value)}>{running ? <Pause fill="currentColor" /> : <Play fill="currentColor" />} {running ? 'Pausar' : done ? 'Focar novamente' : 'Começar foco'}</button><button className="timer-secondary" aria-label="Configurar"><Settings2 /></button></div>
          <div className="timer-presets">{[15, 25, 45, 60].map((value) => <button className={minutes === value ? 'active' : ''} key={value} onClick={() => selectMinutes(value)}>{value} min</button>)}</div>
          <div className="focus-reward"><span>🐾</span><p>Complete a sessão e ganhe <strong>+{Math.max(5, Math.round(minutes / 2))} patinhas</strong></p></div>
        </div>
      </section>
      <section className="focus-tips"><span><Check /> Coloque o celular no silencioso</span><span><Check /> Feche abas que não vai usar</span><span><Check /> Tenha água por perto</span></section>
    </div>
  )
}
