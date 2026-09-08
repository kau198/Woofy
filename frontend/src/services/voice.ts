interface RecognitionResult { results: ArrayLike<ArrayLike<{ transcript: string }>> }
interface Recognition {
  lang: string
  interimResults: boolean
  onresult: ((event: RecognitionResult) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }

export function createRecognition(onText: (text: string) => void, onEnd: () => void, onError: () => void) {
  const speech = window as SpeechWindow
  const Constructor = speech.SpeechRecognition ?? speech.webkitSpeechRecognition
  if (!Constructor) return null
  const recognition = new Constructor()
  recognition.lang = 'pt-BR'
  recognition.interimResults = false
  recognition.onresult = (event) => onText(Array.from(event.results).map((result) => result[0].transcript).join(' '))
  recognition.onend = onEnd
  recognition.onerror = onError
  return recognition
}
