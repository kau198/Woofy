import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Dumbbell,
  Film,
  Gamepad2,
  Heart,
  Music2,
  Newspaper,
  Palette,
  PawPrint,
  Plane,
  Plus,
  Sparkles,
  Trophy,
  Utensils,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'
import { coatOptions, objectives } from '../data/demo'
import type { CoatType, Personality, PetGender } from '../types'

const personalityOptions: Array<{ id: Personality; emoji: string; title: string; text: string }> = [
  { id: 'carinhoso', emoji: '♥', title: 'Carinhoso', text: 'Gentil, próximo e cheio de afeto.' },
  { id: 'calmo', emoji: '☁', title: 'Calmo', text: 'Sereno, paciente e tranquilizador.' },
  { id: 'divertido', emoji: '✦', title: 'Divertido', text: 'Leve, bem-humorado e espontâneo.' },
  { id: 'animado', emoji: '⚡', title: 'Animado', text: 'Entusiasmado, energético e vibrante.' },
]

const interestOptions = [
  { id: 'Futebol', label: 'Futebol', icon: Trophy, color: 'green' },
  { id: 'Games', label: 'Games', icon: Gamepad2, color: 'purple' },
  { id: 'Tecnologia', label: 'Tecnologia', icon: Code2, color: 'blue' },
  { id: 'Música', label: 'Música', icon: Music2, color: 'rose' },
  { id: 'Filmes e séries', label: 'Filmes e séries', icon: Film, color: 'amber' },
  { id: 'Atualidades', label: 'Atualidades', icon: Newspaper, color: 'sky' },
  { id: 'Livros', label: 'Livros', icon: BookOpen, color: 'gold' },
  { id: 'Viagens', label: 'Viagens', icon: Plane, color: 'mint' },
  { id: 'Culinária', label: 'Culinária', icon: Utensils, color: 'orange' },
  { id: 'Arte e design', label: 'Arte e design', icon: Palette, color: 'pink' },
  { id: 'Esportes', label: 'Outros esportes', icon: Dumbbell, color: 'lime' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { userName, pet, setPet, interests, setInterests } = useWoofy()
  const [step, setStep] = useState(0)
  const [coat, setCoat] = useState<CoatType>(pet.coat)
  const [gender, setGender] = useState<PetGender>(pet.gender)
  const [name, setName] = useState(pet.name)
  const [personality, setPersonality] = useState<Personality>(pet.personality)
  const [objective, setObjective] = useState(pet.objective)
  const [selectedInterests, setSelectedInterests] = useState(interests)
  const [customInterest, setCustomInterest] = useState('')

  const totalSteps = 8
  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) => current.includes(interest)
      ? current.filter((item) => item !== interest)
      : current.length < 8 ? [...current, interest] : current)
  }
  const addCustomInterest = () => {
    const cleanInterest = customInterest.trim()
    if (!cleanInterest || selectedInterests.includes(cleanInterest) || selectedInterests.length >= 8) return
    setSelectedInterests((current) => [...current, cleanInterest])
    setCustomInterest('')
  }
  const saveAndContinue = () => {
    if (step === totalSteps - 1) {
      setPet({ ...pet, coat, gender, name: name.trim() || 'Doug', personality, objective })
      setInterests(selectedInterests)
      navigate('/app')
      return
    }
    if (step === totalSteps - 2) {
      setPet({ ...pet, coat, gender, name: name.trim() || 'Doug', personality, objective })
      setInterests(selectedInterests)
    }
    setStep((current) => Math.min(totalSteps - 1, current + 1))
  }

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <BrandMark />
        <div className="onboarding-progress" aria-label={`Etapa ${Math.min(step + 1, 7)} de 7`}>
          <span>Etapa {Math.min(step + 1, 7)} de 7</span>
          <div>{Array.from({ length: 7 }).map((_, index) => <i key={index} className={index <= Math.min(step, 6) ? 'active' : ''} />)}</div>
        </div>
        <button type="button" className="quiet-button" onClick={() => navigate('/')}>Sair</button>
      </header>

      <section className="onboarding-content">
        {step === 0 && (
          <div className="welcome-step step-animate">
            <div className="welcome-glow"><Mascot size="xl" state="happy" /><span className="floating-heart heart-one"><Heart fill="currentColor" /></span><span className="floating-heart heart-two"><PawPrint fill="currentColor" /></span></div>
            <span className="onboarding-kicker">OLÁ, {userName.toUpperCase()}!</span>
            <h1>Existe um companheiro esperando por você.</h1>
            <p>Ele vai ajudar a organizar seus dias, comemorar suas conquistas e lembrar que você não precisa fazer tudo de uma vez.</p>
          </div>
        )}

        {step === 1 && (
          <div className="choice-step interest-step step-animate">
            <div className="onboarding-title"><span className="onboarding-kicker">ANTES DE TUDO, SEU MUNDO</span><h1>Sobre o que você gosta de conversar?</h1><p>Escolha pelo menos 3 interesses. Doug usa isso para puxar assuntos que têm a sua cara — de futebol a tecnologia.</p></div>
            <div className="interest-options">
              {interestOptions.map(({ id, label, icon: Icon, color }) => {
                const selected = selectedInterests.includes(id)
                return <button type="button" className={`${selected ? 'selected' : ''} interest-${color}`} key={id} onClick={() => toggleInterest(id)}><span><Icon /></span><strong>{label}</strong>{selected && <Check />}</button>
              })}
            </div>
            <div className="custom-interest"><input value={customInterest} onChange={(event) => setCustomInterest(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCustomInterest() } }} placeholder="Outro interesse: automobilismo, anime, pets..." /><button type="button" onClick={addCustomInterest}><Plus /> Adicionar</button></div>
            {selectedInterests.some((item) => !interestOptions.some((option) => option.id === item)) && <div className="custom-interest-tags">{selectedInterests.filter((item) => !interestOptions.some((option) => option.id === item)).map((item) => <button type="button" key={item} onClick={() => toggleInterest(item)}>{item} <span>×</span></button>)}</div>}
            <div className="interest-selection-status"><span>{selectedInterests.length}/8 selecionados</span><div>{Array.from({ length: 8 }).map((_, index) => <i key={index} className={index < selectedInterests.length ? 'active' : ''} />)}</div></div>
          </div>
        )}

        {step === 2 && (
          <div className="choice-step step-animate">
            <div className="onboarding-title"><span className="onboarding-kicker">PRIMEIRO, A APARÊNCIA</span><h1>Qual Golden Retriever conquistou você?</h1><p>Todos são igualmente carinhosos. Escolha pela conexão.</p></div>
            <div className="coat-options">
              {coatOptions.map((option) => (
                <button type="button" key={option.id} className={coat === option.id ? 'selected' : ''} onClick={() => setCoat(option.id)}>
                  {coat === option.id && <span className="selected-check"><Check /></span>}
                  <span className="coat-preview"><Mascot coat={option.id} size="md" state="happy" accessory="none" /></span>
                  <strong>{option.label}</strong><small>{option.id === 'cream' ? 'Suave e luminoso' : option.id === 'golden' ? 'Clássico e radiante' : option.id === 'honey' ? 'Quente e acolhedor' : option.id === 'caramel' ? 'Marcante e doce' : 'Vibrante e especial'}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="choice-step compact-choice step-animate">
            <div className="onboarding-title"><span className="onboarding-kicker">UM POUCO MAIS SOBRE SEU PET</span><h1>Como você quer se referir ao seu companheiro?</h1><p>Isso adapta os pronomes usados nas conversas.</p></div>
            <div className="gender-options">
              <button type="button" className={gender === 'male' ? 'selected' : ''} onClick={() => setGender('male')}><span>♂</span><strong>Macho</strong><small>Ele / dele</small>{gender === 'male' && <Check />}</button>
              <button type="button" className={gender === 'female' ? 'selected' : ''} onClick={() => setGender('female')}><span>♀</span><strong>Fêmea</strong><small>Ela / dela</small>{gender === 'female' && <Check />}</button>
            </div>
            <div className="choice-pet-preview"><Mascot coat={coat} gender={gender} personality={personality} size="lg" state="normal" /></div>
          </div>
        )}

        {step === 4 && (
          <div className="name-step step-animate">
            <div className="name-pet"><Mascot coat={coat} gender={gender} personality={personality} size="xl" state="talking" /></div>
            <div className="name-copy">
              <span className="onboarding-kicker">AGORA, O NOME</span>
              <h1>Como seu companheiro vai se chamar?</h1>
              <div className="pet-speech">“Meu nome é Doug, mas agora que você me adotou pode escolher o nome que quiser.”</div>
              <label>Nome do seu pet<input value={name} maxLength={20} onChange={(event) => setName(event.target.value)} placeholder="Doug" /><span>{name.length}/20</span></label>
              <p>Você poderá mudar o nome depois em “Meu Pet”.</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="choice-step compact-choice step-animate">
            <div className="onboarding-title"><span className="onboarding-kicker">O JEITO DE {name.toUpperCase() || 'DOUG'}</span><h1>Qual personalidade combina mais com vocês?</h1><p>Isso muda o estilo das mensagens, sem deixar de ser acolhedor.</p></div>
            <div className="personality-options">
              {personalityOptions.map((option) => <button type="button" key={option.id} className={personality === option.id ? 'selected' : ''} onClick={() => setPersonality(option.id)}><span>{option.emoji}</span><strong>{option.title}</strong><small>{option.text}</small>{personality === option.id && <Check />}</button>)}
            </div>
            <div className="personality-message"><Mascot coat={coat} gender={gender} personality={personality} size="sm" state="happy" accessory="none" /><p>{personality === 'calmo' ? `Sem pressa, ${userName}. Podemos escolher só uma coisa importante para agora.` : personality === 'divertido' ? `Plano do dia: uma tarefa, uma pausa e talvez um petisco imaginário!` : personality === 'animado' ? `Vamos nessa, ${userName}! Um passo pequeno já conta muito!` : `Estou com você, ${userName}. Vamos cuidar do seu dia com carinho.`}</p></div>
          </div>
        )}

        {step === 6 && (
          <div className="choice-step compact-choice step-animate">
            <div className="onboarding-title"><span className="onboarding-kicker">O QUE VOCÊ QUER MELHORAR?</span><h1>Por onde vocês gostariam de começar?</h1><p>Escolha um objetivo principal. Isso poderá mudar a qualquer momento.</p></div>
            <div className="objective-options">
              {objectives.map((item, index) => <button type="button" key={item} className={objective === item ? 'selected' : ''} onClick={() => setObjective(item)}><span>{['📚', '⏳', '🌱', '💼', '☀️', '⚡', '📅'][index]}</span><strong>{item}</strong>{objective === item && <Check />}</button>)}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="certificate-step step-animate">
            <div className="confetti confetti-one">✦</div><div className="confetti confetti-two">●</div><div className="confetti confetti-three">♥</div>
            <span className="onboarding-kicker"><Sparkles size={15} /> ADOÇÃO CONCLUÍDA</span>
            <h1>Parabéns, {userName}!</h1><p>Você adotou seu novo companheiro.</p>
            <div className="adoption-certificate">
              <div className="certificate-ribbon">CERTIFICADO DE ADOÇÃO</div>
              <div className="certificate-pet"><Mascot coat={coat} gender={gender} personality={personality} size="lg" state="celebrating" /><span>{name || 'Doug'}</span></div>
              <div className="certificate-details">
                <p>Este certificado celebra o início de uma amizade entre</p><h2>{userName} & {name || 'Doug'}</h2>
                <div><span><small>PELAGEM</small><strong>{coatOptions.find((item) => item.id === coat)?.label.replace('Golden ', '')}</strong></span><span><small>PERSONALIDADE</small><strong>{personality}</strong></span><span><small>DATA DA ADOÇÃO</small><strong>06.08.2026</strong></span></div>
                <em>“Um passo de cada vez, sempre juntos.”</em>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="onboarding-footer">
        <button type="button" className="button button-ghost" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft /> Voltar</button>
        <span className="onboarding-reassurance">Você poderá alterar essas escolhas depois.</span>
        <button type="button" className="button button-primary" disabled={step === 1 && selectedInterests.length < 3} onClick={saveAndContinue}>{step === 0 ? 'Conhecer meu companheiro' : step === 1 && selectedInterests.length < 3 ? `Escolha mais ${3 - selectedInterests.length}` : step === totalSteps - 1 ? 'Começar nossa jornada' : 'Continuar'} <ArrowRight /></button>
      </footer>
    </main>
  )
}
