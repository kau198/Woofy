import { Moon } from 'lucide-react'
import type { CoatType, Personality, PetGender } from '../types'

type MascotState = 'idle' | 'normal' | 'happy' | 'talking' | 'listening' | 'studying' | 'sleeping' | 'celebrating'

interface MascotProps {
  coat?: CoatType
  gender?: PetGender
  personality?: Personality
  state?: MascotState
  accessory?: 'bandana' | 'bow' | 'none'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  decorative?: boolean
}

export function Mascot({
  coat = 'golden',
  gender,
  personality,
  state = 'happy',
  accessory = 'bandana',
  size = 'lg',
  className = '',
  decorative = false,
}: MascotProps) {
  const coatLabel: Record<CoatType, string> = {
    cream: 'creme claro',
    golden: 'dourado natural',
    honey: 'mel',
    caramel: 'caramelo',
    red: 'ruivo acobreado',
  }
  const personalityLabel: Record<Personality, string> = {
    carinhoso: 'carinhoso',
    calmo: 'calmo',
    divertido: 'divertido',
    animado: 'animado',
  }
  const stateLabel: Record<MascotState, string> = {
    idle: 'em repouso',
    normal: 'tranquilo',
    happy: 'feliz',
    talking: 'conversando',
    listening: 'ouvindo',
    studying: 'estudando',
    sleeping: 'dormindo',
    celebrating: 'comemorando',
  }
  const isTalking = state === 'talking'
  const usesCoatSheet = Boolean(personality)
  const fallbackImageName = state === 'studying'
    ? 'doug-real-studying.webp'
    : state === 'celebrating'
      ? 'doug-hero.webp'
      : state === 'talking'
      ? 'doug-real-talking.webp'
      : state === 'listening'
        ? 'doug-real-talking.webp'
        : 'doug-real-idle.webp'
  const coatImageName = gender ? `doug-coat-${coat}-${gender}.webp` : `doug-coat-${coat}.webp`
  const image = `${import.meta.env.BASE_URL}mascots/${usesCoatSheet ? coatImageName : fallbackImageName}`
  const idleImage = `${import.meta.env.BASE_URL}mascots/doug-real-idle.webp`
  const genderDescription = gender === 'female' ? 'fêmea com laço' : gender === 'male' ? 'macho com gravata' : ''
  const personalityDescription = personality ? `de personalidade ${personalityLabel[personality]}` : ''
  const accessibleLabel = [
    'Golden Retriever do Woofy',
    `de pelagem ${coatLabel[coat]}`,
    genderDescription,
    personalityDescription,
    stateLabel[state],
  ].filter(Boolean).join(', ')

  return (
    <div
      className={`mascot mascot-${coat} mascot-${state} mascot-${size} ${personality ? `mascot-personality-${personality}` : ''} accessory-${accessory} ${className}`}
      data-coat={coat}
      data-state={state}
      data-gender={gender}
      data-personality={personality}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : accessibleLabel}
    >
      {isTalking && !usesCoatSheet && <img className="mascot-talk-idle" src={idleImage} alt="" draggable={false} />}
      <img className={`mascot-main-frame ${usesCoatSheet ? 'mascot-coat-sheet' : ''}`} src={image} alt="" draggable={false} />
      {(state === 'talking' || state === 'listening') && (
        <span className="mascot-sound-waves" aria-hidden="true"><i /><i /><i /></span>
      )}
      {state === 'happy' && <span className="mascot-happy-spark" aria-hidden="true"><i /><i /><i /></span>}
      {state === 'sleeping' && <span className="mascot-state-symbol mascot-zzz" aria-hidden="true"><Moon size={18} strokeWidth={2.4} /></span>}
      {state === 'celebrating' && (
        <span className="photo-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      )}
      {accessory === 'bow' && <span className="photo-bow" aria-hidden="true"><i /></span>}
    </div>
  )
}
