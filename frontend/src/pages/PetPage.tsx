import { CalendarDays, Check, Cloud, Edit3, Heart, Leaf, Medal, PartyPopper, PawPrint, Save, Zap, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'
import { coatOptions } from '../data/demo'
import type { CoatType, Personality } from '../types'

const personalityIcons: Record<Personality, LucideIcon> = {
  carinhoso: Heart,
  calmo: Cloud,
  divertido: PartyPopper,
  animado: Zap,
}

export function PetPage() {
  const { pet, setPet, paws, transactions } = useWoofy()
  const [name, setName] = useState(pet.name)
  const [coat, setCoat] = useState<CoatType>(pet.coat)
  const [personality, setPersonality] = useState<Personality>(pet.personality)
  const [saved, setSaved] = useState(false)
  const level = Math.floor(paws / 100) + 1
  const levelProgress = paws % 100
  const save = () => { setPet({ ...pet, name: name.trim() || pet.name, coat, personality }); setSaved(true); window.setTimeout(() => setSaved(false), 1800) }

  return (
    <div className="pet-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">SEU MELHOR AMIGO</span><h1>Meu Pet</h1><p>Personalize seu companheiro. O carinho continua o mesmo.</p></div><button className="button button-primary" onClick={save}>{saved ? <Check /> : <Save />} {saved ? 'Alterações salvas' : 'Salvar alterações'}</button></div>
      <div className="pet-layout">
        <section className="pet-display-card">
          <div className="pet-display-bg"><span className="pet-display-sun" /><span className="pet-display-leaf" aria-hidden="true"><Leaf size={80} strokeWidth={1.4} /></span><Mascot coat={coat} gender={pet.gender} personality={personality} size="xl" state="happy" /><div className="equipped-bandana">{pet.gender === 'female' ? 'Visual: laço rosa queimado' : 'Visual: gravata marrom'}</div></div>
          <div className="pet-display-info"><div><span className="pet-name-display">{name || pet.name} <Heart fill="currentColor" /></span><small>Golden {coatOptions.find((item) => item.id === coat)?.label.replace('Golden ', '')}</small></div><div className="pet-level"><span>Nível {level}</span><div><i style={{ width: `${levelProgress}%` }} /></div><small>{levelProgress} / 100 XP</small></div></div>
          <div className="pet-stats"><span><CalendarDays /><strong>Adotado em</strong><small>{pet.adoptionDate}</small></span><span><PawPrint /><strong>Patinhas</strong><small>{paws} disponíveis</small></span><span><Medal /><strong>Recompensas</strong><small>{transactions.length} registradas</small></span></div>
        </section>
        <section className="pet-editor-card">
          <div className="editor-section"><span className="editor-label">NOME DO PET</span><label className="name-edit-input"><input value={name} maxLength={20} onChange={(event) => setName(event.target.value)} /><Edit3 /></label></div>
          <div className="editor-section"><span className="editor-label">PELAGEM</span><div className="coat-swatches">{coatOptions.map((option) => <button type="button" className={coat === option.id ? 'selected' : ''} key={option.id} onClick={() => setCoat(option.id)}><i style={{ background: option.color }} />{coat === option.id && <Check />}<small>{option.label.replace('Golden ', '')}</small></button>)}</div></div>
          <div className="editor-section"><span className="editor-label">PERSONALIDADE</span><div className="pet-personality-grid">{(['carinhoso', 'calmo', 'divertido', 'animado'] as Personality[]).map((item) => {
            const Icon = personalityIcons[item]
            return <button type="button" key={item} className={personality === item ? 'selected' : ''} onClick={() => setPersonality(item)}><span aria-hidden="true"><Icon style={{ position: 'static', width: 16, height: 16 }} /></span><strong>{item}</strong>{personality === item && <Check />}</button>
          })}</div></div>
          <div className="editor-section"><span className="editor-label">PRONOMES</span><div className="segmented-control"><button className={pet.gender === 'male' ? 'active' : ''} onClick={() => setPet({ ...pet, gender: 'male' })}>Ele / dele</button><button className={pet.gender === 'female' ? 'active' : ''} onClick={() => setPet({ ...pet, gender: 'female' })}>Ela / dela</button></div></div>
        </section>
      </div>
    </div>
  )
}
