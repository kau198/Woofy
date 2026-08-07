import type { CoatType } from '../types'

interface MascotProps {
  coat?: CoatType
  state?: 'normal' | 'happy' | 'studying' | 'sleeping' | 'celebrating'
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
  const imageName = state === 'studying' ? 'doug-studying.png' : 'doug-happy.png'
  const image = `${import.meta.env.BASE_URL}mascots/${imageName}`

  return (
    <div
      className={`mascot mascot-${coat} mascot-${state} mascot-${size} accessory-${accessory} ${className}`}
      role="img"
      aria-label={`Golden Retriever ${state === 'studying' ? 'estudando' : 'do Woofy'}`}
    >
      <img src={image} alt="" draggable={false} />
      {state === 'sleeping' && <span className="mascot-state-symbol mascot-zzz">z z</span>}
      {state === 'celebrating' && (
        <span className="photo-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      )}
      {accessory === 'bow' && <span className="photo-bow" aria-hidden="true"><i /></span>}
    </div>
  )
}
