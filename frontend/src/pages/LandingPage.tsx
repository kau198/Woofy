import {
  ArrowRight,
  BadgeCheck,
  Check,
  Flame,
  Gamepad2,
  Gift,
  MessageCircle,
  Music2,
  Newspaper,
  PawPrint,
  Sparkles,
  Trophy,
  Tv,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Mascot } from '../components/Mascot'

const topicOptions = [
  { label: 'Futebol', icon: Trophy, prompt: 'Bora falar de futebol? Posso acompanhar seu time, discutir o jogo e lembrar dos próximos confrontos.' },
  { label: 'Games', icon: Gamepad2, prompt: 'Qual jogo está ocupando sua cabeça agora? Vale estratégia, história, build ou só reclamar daquele boss.' },
  { label: 'Música', icon: Music2, prompt: 'Me conta o que está tocando no repeat. Posso descobrir seu estilo e montar momentos da rotina com música.' },
  { label: 'Filmes e séries', icon: Tv, prompt: 'Sem spoiler ou com spoiler? Posso conversar sobre teorias, personagens e o que assistir depois.' },
  { label: 'Atualidades', icon: Newspaper, prompt: 'Podemos conversar sobre o que está acontecendo. Informações de hoje serão verificadas quando a IA estiver conectada.' },
]

const quests = [
  { title: 'Organize a primeira missão', detail: 'Escolha uma tarefa pequena para hoje', reward: 10 },
  { title: 'Conte algo que você curte', detail: 'Doug aprende um novo interesse seu', reward: 15 },
  { title: 'Faça um foco de 10 minutos', detail: 'Uma aventura curta já vale', reward: 20 },
]

export function LandingPage() {
  const [activeTopic, setActiveTopic] = useState(0)
  const [completedQuests, setCompletedQuests] = useState<number[]>([0])

  const toggleQuest = (index: number) => {
    setCompletedQuests((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index])
  }

  const earnedPaws = completedQuests.reduce((total, index) => total + quests[index].reward, 0)
  const ActiveTopicIcon = topicOptions[activeTopic].icon

  return (
    <div className="game-landing">
      <header className="game-topbar">
        <BrandMark />
        <div className="game-topbar-status">
          <span className="season-chip"><Sparkles /> Temporada de boas rotinas</span>
          <Link className="game-login-link" to="/entrar">Já tenho uma conta</Link>
          <Link className="button button-primary" to="/criar-conta">Começar agora <ArrowRight /></Link>
        </div>
      </header>

      <main>
        <section className="game-hero">
          <div className="game-hero-copy">
            <span className="game-kicker"><Zap fill="currentColor" /> SEU DIA, SUA AVENTURA</span>
            <h1>Produtividade fica melhor com um <em>parceiro de verdade.</em></h1>
            <p>Adote um Golden Retriever, complete missões do seu jeito, ganhe patinhas e converse sobre tudo o que faz parte da sua vida.</p>
            <div className="game-hero-actions">
              <Link className="button button-primary button-lg" to="/criar-conta">Adotar meu Golden <PawPrint fill="currentColor" /></Link>
              <Link className="button button-ghost button-lg" to="/app">Jogar a demonstração</Link>
            </div>
            <div className="game-social-proof">
              <span><BadgeCheck /> Sem punição por falhar um dia</span>
              <span><MessageCircle /> Conversas sobre qualquer assunto</span>
            </div>
          </div>

          <div className="companion-arena">
            <div className="arena-grid" />
            <span className="arena-level">NÍVEL 3</span>
            <div className="arena-speech">
              <i /><i /><i />
              <p><strong>Oi, eu sou o Doug!</strong> Qual vai ser nossa primeira missão?</p>
            </div>
            <Mascot size="xl" state="talking" className="hero-real-doug" />
            <div className="floating-loot loot-paws"><PawPrint fill="currentColor" /><strong>+{earnedPaws}</strong><span>patinhas</span></div>
            <div className="floating-loot loot-streak"><Flame fill="currentColor" /><strong>3 dias</strong><span>no seu ritmo</span></div>
            <div className="arena-xp">
              <span><strong>Doug</strong><small>Companheiro curioso</small></span>
              <div><i style={{ width: '68%' }} /></div>
              <b>680 / 1000 XP</b>
            </div>
          </div>
        </section>

        <section className="quest-board">
          <div className="quest-board-heading">
            <div><span className="game-kicker"><Trophy /> MISSÕES DE HOJE</span><h2>Pequenos passos rendem grandes recompensas.</h2></div>
            <div className="quest-total"><PawPrint fill="currentColor" /><span><strong>{earnedPaws}</strong> de 45 patinhas</span></div>
          </div>
          <div className="quest-grid">
            {quests.map((quest, index) => {
              const completed = completedQuests.includes(index)
              return (
                <button type="button" className={`quest-card ${completed ? 'is-complete' : ''}`} key={quest.title} onClick={() => toggleQuest(index)}>
                  <span className="quest-check">{completed ? <Check /> : index + 1}</span>
                  <span><strong>{quest.title}</strong><small>{quest.detail}</small></span>
                  <b><PawPrint fill="currentColor" /> +{quest.reward}</b>
                </button>
              )
            })}
          </div>
        </section>

        <section className="interest-playground">
          <div className="interest-copy">
            <span className="game-kicker"><MessageCircle /> CONVERSA QUE TEM A SUA CARA</span>
            <h2>Doug não fala só de tarefas.</h2>
            <p>Escolha seus interesses na adoção. Seu companheiro usa esses assuntos para puxar papo, explicar coisas e deixar cada conversa mais pessoal.</p>
            <div className="topic-selector">
              {topicOptions.map(({ label, icon: Icon }, index) => (
                <button type="button" className={activeTopic === index ? 'active' : ''} key={label} onClick={() => setActiveTopic(index)}><Icon /> {label}</button>
              ))}
            </div>
            <small className="live-info-note"><Newspaper /> Placares e notícias do momento serão consultados quando o backend com IA estiver conectado.</small>
          </div>
          <div className="topic-chat-card">
            <div className="topic-chat-header"><Mascot size="sm" state="listening" accessory="none" /><span><strong>Doug</strong><small>aprendendo seus interesses</small></span><i /></div>
            <div className="topic-user-message"><ActiveTopicIcon /> Quero conversar sobre {topicOptions[activeTopic].label.toLowerCase()}.</div>
            <div className="topic-doug-message"><Mascot size="sm" state="talking" accessory="none" /><p>{topicOptions[activeTopic].prompt}</p></div>
            <div className="topic-reward"><Gift /> Novo interesse descoberto <strong>+15 patinhas</strong></div>
          </div>
        </section>

        <section className="game-cta">
          <div className="game-cta-dog"><Mascot size="lg" state="celebrating" /></div>
          <div><span>PRONTO PARA O PRIMEIRO NÍVEL?</span><h2>Adote, personalize e comece a jogar sua rotina.</h2><p>Sem rankings impossíveis. O progresso é seu e o Doug comemora cada passo.</p></div>
          <Link className="button button-light button-lg" to="/criar-conta">Conhecer meu companheiro <ArrowRight /></Link>
        </section>
      </main>
    </div>
  )
}
