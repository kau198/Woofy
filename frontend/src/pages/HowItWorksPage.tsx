import { ArrowRight, BrainCircuit, CheckCircle2, Heart, MessageCircle, PawPrint } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'

const steps = [
  ['01', 'Adote seu companheiro', 'Escolha a pelagem, o nome, o gênero e uma personalidade que combine com você.'],
  ['02', 'Conte o que quer melhorar', 'Estudos, trabalho, hábitos ou rotina: o Woofy começa entendendo a sua prioridade.'],
  ['03', 'Organize sem pressão', 'Crie tarefas, use o modo foco e converse com seu pet para transformar planos em passos.'],
  ['04', 'Comemore o que avançou', 'Ganhe patinhas, acompanhe seu progresso e reconheça até as pequenas conquistas.'],
]

export function HowItWorksPage() {
  return (
    <div className="public-page">
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="inner-hero how-hero">
          <div>
            <span className="eyebrow"><PawPrint size={15} /> Como funciona</span>
            <h1>Uma rotina mais leve começa com companhia.</h1>
            <p>O Woofy combina organização, foco e inteligência artificial em uma experiência acolhedora — desenhada para ajudar, nunca para cobrar.</p>
            <Link className="button button-primary button-lg" to="/criar-conta">Conhecer meu companheiro <ArrowRight /></Link>
          </div>
          <div className="how-hero-visual"><Mascot size="xl" state="happy" /><span><Heart fill="currentColor" /></span></div>
        </section>

        <section className="section how-steps-section">
          <div className="section-heading centered"><span className="section-kicker">Da adoção à primeira conquista</span><h2>Quatro passos, no seu ritmo.</h2></div>
          <div className="how-steps">
            {steps.map(([number, title, text]) => (
              <article key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </section>

        <section className="principles-section">
          <div className="principles-copy"><span className="section-kicker">Nosso princípio</span><h2>Incentivar é diferente de pressionar.</h2><p>Você não perde sequências, não recebe broncas e não precisa justificar uma pausa. Quando voltar, o Woofy ajuda você a recomeçar pequeno.</p></div>
          <div className="principles-card">
            <div className="principles-mascot"><Mascot size="md" state="normal" /></div>
            <div className="speech-card"><MessageCircle size={18} aria-hidden="true" /><p>Que bom que você voltou! Vamos começar com uma tarefa pequena hoje?</p></div>
          </div>
        </section>

        <section className="section what-can-do">
          <div className="section-heading"><span className="section-kicker">Na prática</span><h2>Seu pet ajuda a tirar as coisas da cabeça e colocar em movimento.</h2></div>
          <div className="capability-list">
            {['Organizar seu dia e sua semana', 'Dividir tarefas grandes em etapas', 'Montar planos de estudo e revisões', 'Criar hábitos possíveis', 'Sugerir pausas e momentos de foco', 'Conversar em outros idiomas para praticar'].map((item) => <span key={item}><CheckCircle2 /> {item}</span>)}
          </div>
          <div className="ai-note"><BrainCircuit /><p><strong>IA com limites claros.</strong> O Woofy sempre pede sua confirmação antes de adicionar tarefas e não substitui profissionais de saúde.</p></div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
