import type { CoatType, Personality, PetGender } from '../types'

interface MascotProps {
  coat?: CoatType
  gender?: PetGender
  personality?: Personality
  state?: 'idle' | 'normal' | 'happy' | 'talking' | 'listening' | 'studying' | 'sleeping' | 'celebrating'
  accessory?: 'bandana' | 'bow' | 'none'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Mascot({
  coat = 'golden',
  gender,
  personality,
  state = 'happy',
  accessory = 'bandana',
  size = 'lg',
  className = '',
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
  const personalityImage: Record<Personality, string> = {
    carinhoso: 'doug-real-idle.png',
    calmo: 'doug-real-studying.png',
    divertido: 'doug-real-talking.png',
    animado: 'doug-real-excited.png',
  }
  const isTalking = state === 'talking'
  const imageName = state === 'studying'
    ? 'doug-real-studying.png'
    : state === 'celebrating'
      ? 'doug-real-excited.png'
      : state === 'talking'
      ? 'doug-real-talking.png'
      : personality
        ? personalityImage[personality]
        : state === 'listening'
          ? 'doug-real-talking.png'
          : 'doug-real-idle.png'
  const image = `${import.meta.env.BASE_URL}mascots/${imageName}`
  const idleImage = `${import.meta.env.BASE_URL}mascots/${personality ? personalityImage[personality] : 'doug-real-idle.png'}`
  const genderDescription = gender === 'female' ? 'fêmea com laço' : gender === 'male' ? 'macho com bandana' : ''
  const personalityDescription = personality ? `de personalidade ${personalityLabel[personality]}` : ''

  return (
    <div
      className={`mascot mascot-${coat} mascot-${state} mascot-${size} ${personality ? `mascot-personality-${personality}` : ''} accessory-${accessory} ${className}`}
      data-coat={coat}
      data-state={state}
      data-gender={gender}
      data-personality={personality}
      role="img"
      aria-label={`Golden Retriever de pelagem ${coatLabel[coat]} ${genderDescription} ${personalityDescription} ${state === 'studying' ? 'estudando' : 'do Woofy'}`.replace(/\s+/g, ' ').trim()}
    >
      {isTalking && <img className="mascot-talk-idle" src={idleImage} alt="" draggable={false} />}
      <img className="mascot-main-frame" src={image} alt="" draggable={false} />
      {(state === 'talking' || state === 'listening') && (
        <span className="mascot-sound-waves" aria-hidden="true"><i /><i /><i /></span>
      )}
      {state === 'happy' && <span className="mascot-happy-spark" aria-hidden="true"><i />✦</span>}
      {state === 'sleeping' && <span className="mascot-state-symbol mascot-zzz">z z</span>}
      {state === 'celebrating' && (
        <span className="photo-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      )}
      {gender === 'female' && <span className="gender-marker gender-bow" aria-hidden="true"><i /></span>}
      {gender === 'male' && <span className="gender-marker gender-bandana" aria-hidden="true"><i /></span>}
      {accessory === 'bow' && <span className="photo-bow" aria-hidden="true"><i /></span>}
    </div>
  )
}
