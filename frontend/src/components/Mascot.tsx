import type { CoatType } from '../types'

interface MascotProps {
  coat?: CoatType
  state?: 'idle' | 'normal' | 'happy' | 'talking' | 'listening' | 'studying' | 'sleeping' | 'celebrating'
  accessory?: 'bandana' | 'bow' | 'none'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Mascot({
  coat = 'golden',
  state = 'happy',
  accessory = 'bandana',
  size = 'lg',
  className = '',
}: MascotProps) {
  const isTalking = state === 'talking'
  const imageName = state === 'studying'
    ? 'doug-real-studying.png'
    : state === 'talking' || state === 'listening' || state === 'celebrating'
      ? 'doug-real-talking.png'
      : 'doug-real-idle.png'
  const image = `${import.meta.env.BASE_URL}mascots/${imageName}`
  const idleImage = `${import.meta.env.BASE_URL}mascots/doug-real-idle.png`

  return (
    <div
      className={`mascot mascot-${coat} mascot-${state} mascot-${size} accessory-${accessory} ${className}`}
      role="img"
      aria-label={`Golden Retriever ${state === 'studying' ? 'estudando' : 'do Woofy'}`}
    >
      {isTalking && <img className="mascot-talk-idle" src={idleImage} alt="" draggable={false} />}
      <img className="mascot-main-frame" src={image} alt="" draggable={false} />
      {(state === 'talking' || state === 'listening') && (
        <span className="mascot-sound-waves" aria-hidden="true"><i /><i /><i /></span>
      )}
      {state === 'sleeping' && <span className="mascot-state-symbol mascot-zzz">z z</span>}
      {state === 'celebrating' && (
        <span className="photo-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      )}
      {accessory === 'bow' && <span className="photo-bow" aria-hidden="true"><i /></span>}
    </div>
  )
}
