import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'

const features = [
  {
    icon: CheckCircle2,
    title: 'Tarefas sem peso',
    text: 'Organize o que importa, divida grandes planos em pequenos passos e siga no seu ritmo.',
    color: 'mint',
  },
  {
    icon: Target,
    title: 'Hábitos possíveis',
    text: 'Crie rotinas que cabem na vida real, sem punições por um dia fora do plano.',
    color: 'peach',
  },
  {
    icon: Clock3,
    title: 'Foco acompanhado',
    text: 'Escolha seu tempo, respire e deixe seu companheiro ficar ao seu lado.',
    color: 'lavender',
  },
  {
    icon: MessageCircle,
    title: 'Ajuda que conversa',
    text: 'Transforme preocupações em planos claros com uma IA acolhedora e prática.',
    color: 'sky',
  },
]

export function LandingPage() {
  return (
    <div className="public-page">
      <PublicHeader />
      <main>
        <section className="hero-section">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> Mais leveza para a sua rotina</div>
            <h1>Organize sua vida com um <em>amigo</em> ao seu lado.</h1>
            <p className="hero-subtitle">
              Tarefas, hábitos e foco com a companhia de um Golden Retriever virtual que incentiva você — sem cobranças e sem julgamentos.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary button-lg" to="/criar-conta">
                Adotar meu companheiro <ArrowRight size={19} />
              </Link>
              <Link className="button button-ghost button-lg" to="/como-funciona">Ver como funciona</Link>
            </div>
            <div className="hero-proof">
              <span className="proof-avatars"><i>K</i><i>M</i><i>R</i></span>
              <span><strong>Feito para dias reais.</strong><br />Inclusive os mais bagunçados.</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one"><Heart size={18} fill="currentColor" /></div>
            <div className="hero-orbit orbit-two"><Check size={20} /></div>
            <div className="hero-orbit orbit-three"><PawPrint size={18} fill="currentColor" /></div>
            <div className="hero-mascot-stage">
              <span className="hero-sun" />
              <span className="hero-ground" />
              <Mascot size="xl" state="happy" />
              <div className="hero-message-card">
                <span className="mini-avatar"><PawPrint size={14} fill="currentColor" /></span>
                <p><strong>Oi! Eu sou o Doug.</strong><br />Vamos fazer uma coisinha de cada vez?</p>
              </div>
            </div>
            <div className="hero-task-card">
              <span className="task-check"><Check size={14} /></span>
              <span><strong>Primeira tarefa do dia</strong><small>Comece pela mais simples</small></span>
              <span className="paws-pill"><PawPrint size={12} fill="currentColor" /> +10</span>
            </div>
          </div>
        </section>

        <section className="values-strip" aria-label="Princípios do Woofy">
          <span><ShieldCheck size={20} /> Sem julgamentos</span>
          <span><Heart size={20} /> Feito com acolhimento</span>
          <span><BrainCircuit size={20} /> IA que entende contexto</span>
          <span><CalendarDays size={20} /> Uma rotina do seu jeito</span>
        </section>

        <section className="section features-section" id="recursos">
          <div className="section-heading centered">
            <span className="section-kicker">Tudo em um só lugar</span>
            <h2>Organização que se adapta à sua vida.</h2>
            <p>O Woofy reúne as ferramentas que você precisa e deixa de fora a pressão que você não precisa.</p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text, color }) => (
              <article key={title} className={`feature-card feature-${color}`}>
                <span className="feature-icon"><Icon size={23} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to="/criar-conta">Conhecer recurso <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="companion-section">
          <div className="companion-visual">
            <div className="companion-arch">
              <div className="companion-stars">✦ <span>✦</span></div>
              <Mascot size="xl" state="normal" accessory="bow" />
              <span className="pet-name-tag">Doug <Heart size={13} fill="currentColor" /></span>
            </div>
          </div>
          <div className="companion-copy">
            <span className="section-kicker">Um companheiro só seu</span>
            <h2>Mais do que um mascote. Uma presença na sua rotina.</h2>
            <p>Você escolhe a pelagem, o nome e a personalidade. O Woofy aprende como ajudar e comemora cada pequena conquista com você.</p>
            <ul className="check-list">
              <li><CheckCircle2 /> Personalize seu Golden Retriever</li>
              <li><CheckCircle2 /> Escolha um jeito de conversar que combina com você</li>
              <li><CheckCircle2 /> Ganhe patinhas e desbloqueie acessórios</li>
              <li><CheckCircle2 /> Volte quando quiser — ele sempre ficará feliz em ver você</li>
            </ul>
            <Link className="text-link" to="/como-funciona">Conheça a jornada de adoção <ArrowRight size={17} /></Link>
          </div>
        </section>

        <section className="ai-section" id="ia">
          <div className="ai-copy">
            <div className="eyebrow eyebrow-light"><BrainCircuit size={16} /> Inteligência artificial acolhedora</div>
            <h2>Quando tudo parece muito, o Woofy ajuda a encontrar o primeiro passo.</h2>
            <p>Converse naturalmente. Seu companheiro pode organizar a semana, dividir uma tarefa, montar um plano de estudos ou apenas ajudar você a clarear as ideias.</p>
            <div className="ai-guardrail"><ShieldCheck /><span><strong>Você sempre decide.</strong> Nenhuma tarefa é criada ou alterada sem sua confirmação.</span></div>
          </div>
          <div className="chat-preview">
            <div className="chat-preview-header">
              <span className="chat-dog-avatar"><PawPrint fill="currentColor" /></span>
              <span><strong>Conversar com Doug</strong><small>Seu companheiro está aqui</small></span>
              <i />
            </div>
            <div className="chat-preview-body">
              <div className="message message-user">Tenho uma prova na segunda e ainda não comecei.</div>
              <div className="message message-pet">
                <span className="message-avatar"><PawPrint size={15} fill="currentColor" /></span>
                <p>Tudo bem, ainda podemos organizar isso. Que tal dividir em três passos pequenos para hoje?</p>
              </div>
              <div className="suggestion-card">
                <span><CheckSquare2Icon /> Revisar os conceitos principais</span>
                <span><CheckSquare2Icon /> Praticar com 5 exercícios</span>
                <button type="button">Adicionar estas tarefas</button>
              </div>
            </div>
          </div>
        </section>

        <section className="section journey-section">
          <div className="section-heading centered">
            <span className="section-kicker">Começar é simples</span>
            <h2>Seu novo companheiro está a três passos.</h2>
          </div>
          <div className="journey-steps">
            <article><span>01</span><div className="journey-icon"><UserRoundIcon /></div><h3>Crie sua conta</h3><p>Conte só o necessário para começar.</p></article>
            <article><span>02</span><div className="journey-icon"><PawPrint /></div><h3>Adote seu pet</h3><p>Escolha pelagem, nome e personalidade.</p></article>
            <article><span>03</span><div className="journey-icon"><Sparkles /></div><h3>Comecem juntos</h3><p>Organize o primeiro dia no seu ritmo.</p></article>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-paw cta-paw-one">🐾</div>
          <div className="cta-paw cta-paw-two">🐾</div>
          <div className="cta-mascot"><Mascot size="md" state="celebrating" /></div>
          <div>
            <span>Seu companheiro está esperando.</span>
            <h2>Que tal dar o primeiro passo juntos?</h2>
            <p>Crie sua conta gratuitamente e comece uma rotina mais leve hoje.</p>
          </div>
          <Link className="button button-light button-lg" to="/criar-conta">Adotar meu companheiro <ArrowRight size={19} /></Link>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}

function CheckSquare2Icon() {
  return <span className="tiny-check"><Check size={11} /></span>
}

function UserRoundIcon() {
  return <span aria-hidden="true">☺</span>
}
