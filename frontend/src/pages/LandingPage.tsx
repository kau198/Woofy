import {
  Activity,
  ArrowRight,
  BadgePlus,
  BadgeCheck,
  BookmarkCheck,
  BrainCircuit,
  Check,
  Clock3,
  Flame,
  Gamepad2,
  Heart,
  MessageCircle,
  Music2,
  Newspaper,
  PawPrint,
  Play,
  Trophy,
  Tv,
  Zap,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

gsap.registerPlugin(ScrollTrigger)

const topicOptions = [
  {
    label: 'Futebol',
    icon: Trophy,
    prompt: 'Bora falar de futebol? Posso acompanhar seu time, discutir o jogo e lembrar dos próximos confrontos.',
    color: 'lime',
  },
  {
    label: 'Games',
    icon: Gamepad2,
    prompt: 'Qual jogo está ocupando sua cabeça agora? Vale estratégia, história, build ou só reclamar daquele boss.',
    color: 'blue',
  },
  {
    label: 'Música',
    icon: Music2,
    prompt: 'Me conta o que está tocando no repeat. Posso descobrir seu estilo e montar momentos da rotina com música.',
    color: 'coral',
  },
  {
    label: 'Filmes e séries',
    icon: Tv,
    prompt: 'Sem spoiler ou com spoiler? Posso conversar sobre teorias, personagens e o que assistir depois.',
    color: 'yellow',
  },
  {
    label: 'Atualidades',
    icon: Newspaper,
    prompt: 'Podemos conversar sobre o que está acontecendo e separar o que importa do barulho.',
    color: 'cream',
  },
]

const quests = [
  { title: 'Organizar a primeira missão', detail: 'Escolha uma tarefa pequena para hoje', reward: 10, icon: Zap },
  { title: 'Contar algo que você curte', detail: 'Doug aprende um novo interesse seu', reward: 15, icon: Heart },
  { title: 'Fazer um foco de 10 minutos', detail: 'Uma aventura curta já vale', reward: 20, icon: Clock3 },
]

const steps = [
  { number: '01', title: 'Adote', text: 'Escolha nome, pelagem e personalidade. O companheiro começa com a sua cara.' },
  { number: '02', title: 'Combine', text: 'Conte o que importa, seus interesses e o ritmo que cabe na vida real.' },
  { number: '03', title: 'Evolua', text: 'Complete missões, faça pausas, ganhe patinhas e celebre progresso de verdade.' },
]

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
}

export function LandingPage() {
  const [activeTopic, setActiveTopic] = useState(0)
  const [completedQuests, setCompletedQuests] = useState<number[]>([0])
  const manifestoRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.3 })
  const dogY = useTransform(scrollYProgress, [0, 0.26], [0, 38])
  const dogRotate = useTransform(scrollYProgress, [0, 0.26], [-2, 2])

  useLayoutEffect(() => {
    const section = manifestoRef.current
    if (!section) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add(
        '(min-width: 960px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',
        () => {
          const index = section.querySelector<HTMLElement>('[data-gsap-manifesto="index"]')
          const headline = section.querySelector<HTMLElement>('[data-gsap-manifesto="headline"]')
          const copy = section.querySelector<HTMLElement>('[data-gsap-manifesto="copy"]')
          const notes = section.querySelectorAll<HTMLElement>('[data-gsap-manifesto="note"]')

          if (!index || !headline || !copy || notes.length === 0) return

          gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              id: 'woofy-manifesto-cinematic',
              trigger: section,
              start: 'top top',
              end: () => `+=${Math.max(960, Math.round(window.innerHeight * 1.55))}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.75,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
            .from(index, { autoAlpha: 0, x: -28, duration: 0.12 })
            .from(headline, { autoAlpha: 0, yPercent: 34, scale: 0.96, transformOrigin: '0 100%', duration: 0.34 }, 0)
            .from(copy, { autoAlpha: 0, xPercent: 12, duration: 0.24 }, 0.28)
            .from(notes, { autoAlpha: 0, y: 58, stagger: 0.1, duration: 0.24 }, 0.46)
            .to(headline, { yPercent: -3, duration: 0.16 }, 0.78)
        },
      )
    }, section)

    return () => {
      media.revert()
      context.revert()
    }
  }, [])

  const toggleQuest = (index: number) => {
    setCompletedQuests((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index])
  }

  const earnedPaws = completedQuests.reduce((total, index) => total + quests[index].reward, 0)
  const completion = Math.round((earnedPaws / 45) * 100)
  const activeTopicOption = topicOptions[activeTopic]
  const ActiveTopicIcon = activeTopicOption.icon

  return (
    <div className="woofy-home">
      <m.div className="woofy-scroll-progress" style={{ scaleX: progress }} />

      <header className="woofy-home-header">
        <BrandMark />
        <nav aria-label="Navegação principal">
          <a href="#experiencia">A experiência</a>
          <a href="#conversa">Conversa</a>
          <a href="#como-funciona">Como funciona</a>
        </nav>
        <div className="woofy-home-actions">
          <Link className="woofy-text-link" to="/entrar">Entrar</Link>
          <Link className="woofy-button woofy-button-small" to="/criar-conta">
            Adotar o Doug <ArrowRight />
          </Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="woofy-hero">
          <m.div
            className="woofy-hero-copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <m.div className="woofy-edition" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span>WOOFY® / 2026</span>
              <span>COMPANHEIRO DE ROTINA</span>
            </m.div>
            <m.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              Sua rotina ganhou um <em>melhor amigo.</em>
            </m.h1>
            <m.p
              className="woofy-hero-lead"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.65 }}
            >
              Um Golden Retriever virtual para transformar tarefas, foco e autocuidado em uma aventura que respeita o seu ritmo.
            </m.p>
            <m.div
              className="woofy-hero-actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
            >
              <Link className="woofy-button woofy-button-large" to="/criar-conta">
                Quero meu companheiro <PawPrint fill="currentColor" />
              </Link>
              <Link className="woofy-play-link" to="/app">
                <span><Play fill="currentColor" /></span>
                Jogar a demonstração
              </Link>
            </m.div>
            <m.div
              className="woofy-hero-proof"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.6 }}
            >
              <span><BadgeCheck /> Sem ranking tóxico</span>
              <span><BrainCircuit /> IA só quando ajuda</span>
              <span><Heart /> Zero culpa</span>
            </m.div>
          </m.div>

          <div className="woofy-hero-stage" aria-label="Doug, o companheiro virtual do Woofy">
            <span className="woofy-stage-serial">DOUG // 01</span>
            <span className="woofy-stage-word" aria-hidden="true">GOOD<br />DAYS</span>
            <m.div className="woofy-dog-frame" style={{ y: shouldReduceMotion ? 0 : dogY, rotate: shouldReduceMotion ? 0 : dogRotate }}>
              <img
                src={`${import.meta.env.BASE_URL}mascots/doug-hero.webp`}
                alt="Doug, um Golden Retriever sorridente, levantando a pata"
                width={1100}
                height={1100}
                fetchPriority="high"
                draggable={false}
              />
            </m.div>
            <m.div
              className="woofy-doug-note"
              initial={{ opacity: 0, x: 26, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              transition={{ delay: 0.48, type: 'spring', stiffness: 170, damping: 18 }}
            >
              <MessageCircle />
              <p>Eu seguro o ritmo.<br /><strong>Você escolhe o passo.</strong></p>
            </m.div>
            <m.div
              className="woofy-hero-quest"
              initial={{ opacity: 0, x: -28, rotate: -4 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ delay: 0.56, type: 'spring', stiffness: 170, damping: 18 }}
            >
              <span className="woofy-quest-check"><Check /></span>
              <span><small>MISSÃO DO DIA</small><strong>Começar pequeno</strong></span>
              <b><PawPrint fill="currentColor" /> +10</b>
            </m.div>
            <span className="woofy-stage-sticker"><Flame fill="currentColor" /> 3 DIAS<br />NO SEU RITMO</span>
          </div>
        </section>

        <div className="woofy-marquee" aria-hidden="true">
          <div>
            <span>MENOS CULPA</span><PawPrint fill="currentColor" />
            <span>MAIS RITMO</span><Activity />
            <span>UM PASSO DE CADA VEZ</span><Heart fill="currentColor" />
            <span>MENOS CULPA</span><PawPrint fill="currentColor" />
            <span>MAIS RITMO</span><Activity />
            <span>UM PASSO DE CADA VEZ</span><Heart fill="currentColor" />
          </div>
        </div>

        <section ref={manifestoRef} className="woofy-manifesto woofy-manifesto-cinematic" id="experiencia">
          <div className="woofy-manifesto-title">
            <span className="woofy-section-index" data-gsap-manifesto="index">01 / A EXPERIÊNCIA</span>
            <h2 data-gsap-manifesto="headline">O plano se adapta. <em>Você não se pune.</em></h2>
          </div>
          <div className="woofy-manifesto-copy" data-gsap-manifesto="copy">
            <p>O Woofy transforma o que você escolhe fazer em missões curtas, pausas e recompensas visíveis — sem apagar seu progresso quando a vida atravessa o dia.</p>
            <div className="woofy-manifesto-signature"><span>W</span><p>Confirmar.<br />Ajustar.<br />Continuar.</p></div>
          </div>
          <div className="woofy-manifesto-notes">
            {[
              ['01', 'Nada entra sozinho', 'Sugestões só viram tarefas depois da sua confirmação. Você edita, ignora ou salva.'],
              ['02', 'O dia não zera você', 'Uma pausa não apaga hábitos nem transforma descanso em fracasso. Amanhã continua daqui.'],
              ['03', 'Conversa além da lista', 'Futebol, games, música e o que aconteceu hoje também fazem parte do contexto.'],
            ].map(([number, title, text]) => (
              <article key={number} data-gsap-manifesto="note">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="woofy-mission-lab">
          <m.div className="woofy-mission-intro" {...reveal}>
            <span className="woofy-section-index">02 / MISSÕES REAIS</span>
            <h2>Progresso que dá vontade de continuar.</h2>
            <p>Clique nas missões. A recompensa aparece na hora, o Doug comemora e amanhã começa leve de novo.</p>
            <div className="woofy-mini-rule"><BookmarkCheck /><span><strong>Regra do Woofy</strong>Feito é melhor que perfeito — e pausas também contam.</span></div>
          </m.div>

          <m.div className="woofy-mission-console" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
            <div className="woofy-console-topline">
              <div><span>PAINEL DO DIA</span><strong>Hoje · missão atual</strong></div>
              <span className="woofy-live-dot">AO VIVO</span>
            </div>
            <div className="woofy-console-progress">
              <div
                className="woofy-progress-dial"
                style={{ '--progress': `${completion * 3.6}deg` } as React.CSSProperties}
                role="progressbar"
                aria-label="Progresso das missões"
                aria-valuemin={0}
                aria-valuemax={45}
                aria-valuenow={earnedPaws}
                aria-valuetext={`${completedQuests.length} de ${quests.length} missões concluídas`}
              >
                <span><strong>{earnedPaws}</strong><small>/ 45</small></span>
              </div>
              <div><span>PATINHAS CONQUISTADAS</span><h3>{completion === 100 ? 'Dia completo. Boa!' : 'Seu dia já está andando.'}</h3><p>{completedQuests.length} de {quests.length} missões concluídas</p></div>
            </div>
            <div className="woofy-console-list">
              {quests.map((quest, index) => {
                const completed = completedQuests.includes(index)
                const Icon = quest.icon
                return (
                  <m.button
                    type="button"
                    className={completed ? 'is-complete' : ''}
                    key={quest.title}
                    onClick={() => toggleQuest(index)}
                    aria-pressed={completed}
                    whileTap={{ scale: 0.985 }}
                  >
                    <span className="woofy-console-icon"><Icon /></span>
                    <span><strong>{quest.title}</strong><small>{quest.detail}</small></span>
                    <b><PawPrint fill="currentColor" /> +{quest.reward}</b>
                    <span className="woofy-console-toggle">{completed ? <Check /> : index + 1}</span>
                  </m.button>
                )
              })}
            </div>
            <AnimatePresence initial={false}>
              {completion === 100 && (
                <m.div
                  className="woofy-console-celebration"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Trophy /> Todas as missões feitas. Doug liberou um bônus de carinho.
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        </section>

        <section className="woofy-conversation" id="conversa">
          <m.div className="woofy-conversation-heading" {...reveal}>
            <span className="woofy-section-index">03 / CONVERSA COM CONTEXTO</span>
            <h2>Ele lembra que você é mais do que sua lista de tarefas.</h2>
            <p>Escolha um assunto e veja como a conversa muda. Futebol, games, música, filmes ou o que aconteceu hoje — tudo cabe.</p>
          </m.div>

          <div className="woofy-conversation-stage">
            <m.div className="woofy-topic-list" {...reveal}>
              {topicOptions.map(({ label, icon: Icon }, index) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setActiveTopic(index)}
                  aria-pressed={activeTopic === index}
                  className={activeTopic === index ? 'active' : ''}
                >
                  <span>0{index + 1}</span>
                  <Icon />
                  <strong>{label}</strong>
                  <ArrowRight />
                </button>
              ))}
            </m.div>

            <m.div className={`woofy-chat-demo topic-${activeTopicOption.color}`} {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
              <div className="woofy-chat-topbar">
                <div className="woofy-chat-avatar"><img src={`${import.meta.env.BASE_URL}woofy-logo-256.webp`} alt="" width={256} height={256} loading="lazy" /></div>
                <span><strong>Doug</strong><small><i /> aprendendo seus interesses</small></span>
                <span className="woofy-chat-id">WOOFY CHAT / 03</span>
              </div>
              <div className="woofy-chat-body">
                <AnimatePresence mode="wait">
                  <m.div
                    key={activeTopicOption.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28 }}
                    className="woofy-chat-exchange"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="woofy-user-bubble"><ActiveTopicIcon /> Quero conversar sobre {activeTopicOption.label.toLowerCase()}.</div>
                    <div className="woofy-doug-bubble">
                      <span><img src={`${import.meta.env.BASE_URL}woofy-logo-256.webp`} alt="" width={256} height={256} loading="lazy" /></span>
                      <p>{activeTopicOption.prompt}</p>
                    </div>
                  </m.div>
                </AnimatePresence>
                <div className="woofy-interest-reward"><BadgePlus /><span>NOVO INTERESSE DESCOBERTO</span><strong>+15 <PawPrint fill="currentColor" /></strong></div>
              </div>
              <div className="woofy-chat-caption"><MessageCircle /> A IA sugere. Você sempre decide.</div>
            </m.div>
          </div>
        </section>

        <section className="woofy-how" id="como-funciona">
          <m.div className="woofy-how-heading" {...reveal}>
            <span className="woofy-section-index">04 / SEM COMPLICAÇÃO</span>
            <h2>Três passos.<br /><em>Uma parceria.</em></h2>
          </m.div>
          <div className="woofy-step-list">
            {steps.map((step, index) => (
              <m.article key={step.number} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </m.article>
            ))}
          </div>
        </section>

        <section className="woofy-final-cta">
          <div className="woofy-final-copy">
            <span>PRONTO PARA O PRIMEIRO PASSEIO?</span>
            <h2>Seu próximo passo pode ser <em>pequeno.</em></h2>
            <p>O Doug encontra você onde estiver — inclusive nos dias bagunçados.</p>
            <Link className="woofy-button woofy-button-light woofy-button-large" to="/criar-conta">
              Adotar meu companheiro <ArrowRight />
            </Link>
          </div>
          <div className="woofy-final-dog" aria-hidden="true">
            <span>EI!</span>
            <img src={`${import.meta.env.BASE_URL}mascots/doug-hero.webp`} alt="" width={1100} height={1100} loading="lazy" draggable={false} />
          </div>
          <span className="woofy-final-watermark">WOOFY</span>
        </section>
      </main>

      <footer className="woofy-home-footer">
        <BrandMark />
        <p>Rotina real. Progresso gentil. Um bom amigo ao lado.</p>
        <nav aria-label="Links institucionais">
          <Link to="/como-funciona">Como funciona</Link>
          <Link to="/contato">Contato</Link>
          <Link to="/privacidade">Privacidade</Link>
        </nav>
        <span>© 2026 WOOFY®</span>
      </footer>
    </div>
  )
}
