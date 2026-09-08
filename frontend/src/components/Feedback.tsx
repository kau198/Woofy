import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function Feedback() {
  const [message, setMessage] = useState('')
  useEffect(() => {
    let timeout: number
    const show = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail)
      clearTimeout(timeout)
      timeout = window.setTimeout(() => setMessage(''), 7000)
    }
    window.addEventListener('woofy-error', show)
    return () => { window.removeEventListener('woofy-error', show); clearTimeout(timeout) }
  }, [])
  return message ? <div className="feedback-toast" role="alert"><span>{message}</span><button onClick={() => setMessage('')} aria-label="Fechar aviso"><X size={18} /></button></div> : null
}
