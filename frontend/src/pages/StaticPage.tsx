import { MapPin, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { apiRequest } from '../services/api'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'

export function StaticPage({ type }: { type: 'contact' | 'terms' | 'privacy' }) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true)
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    try {
      const result = await apiRequest<{ message: string }>('/contact', { method: 'POST', body: JSON.stringify(values) })
      setStatus(result.message); form.reset()
    } catch (error) { setStatus((error as Error).message) }
    finally { setBusy(false) }
  }
  const title = type === 'contact' ? 'Fale com a gente' : type === 'terms' ? 'Termos de uso' : 'Política de privacidade'
  return (
    <div className="public-page">
      <PublicHeader />
      <main id="main-content" className="static-page" tabIndex={-1}>
        <div className="static-heading"><span>Woofy • Transparência e cuidado</span><h1>{title}</h1><p>{type === 'contact' ? 'Dúvidas, ideias ou só quer dizer oi? Nosso time vai adorar conversar com você.' : 'Última atualização: 08 de setembro de 2026.'}</p></div>
        {type === 'contact' ? (
          <div className="contact-grid">
            <form className="contact-form" onSubmit={submit}><label>Nome<input required minLength={2} maxLength={100} name="name" placeholder="Seu nome" /></label><label>E-mail<input required name="email" type="email" placeholder="voce@exemplo.com" /></label><label>Assunto<select required name="subject" defaultValue=""><option value="" disabled>Escolha uma opção</option><option>Dúvida</option><option>Sugestão</option><option>Suporte</option></select></label><label>Mensagem<textarea required name="message" minLength={10} maxLength={4000} rows={5} placeholder="Conte para a gente como podemos ajudar" /></label><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Enviando...' : 'Enviar mensagem'}</button>{status && <p role="status">{status}</p>}</form>
            <aside className="contact-aside"><div><MessageCircle /><span><strong>Resposta</strong>Sua mensagem será registrada para atendimento</span></div><div><MapPin /><span><strong>Onde estamos</strong>Brasil, com carinho</span></div></aside>
          </div>
        ) : (
          <article className="legal-content">
            <h2>1. Sobre o Woofy</h2><p>O Woofy é uma plataforma de organização pessoal que combina tarefas, hábitos, sessões de foco e recursos de inteligência artificial. Ao utilizar o serviço, você concorda com as condições descritas nesta página.</p>
            <h2>2. Sua conta e seus dados</h2><p>Você é responsável por manter suas credenciais seguras. Seu perfil, tarefas, hábitos, histórico de foco e conversas são armazenados no banco de dados do Woofy. A senha é protegida por hash Argon2. Uma sessão protegida mantém seu acesso no navegador.</p>
            <h2>3. Inteligência artificial</h2><p>Quando você envia uma mensagem, o texto e o histórico recente da conversa são enviados ao provedor de linguagem configurado pelo Woofy — atualmente Groq ou OpenAI — para gerar uma resposta. Se permitir o contexto da rotina, tarefas pendentes, hábitos e interesses também são enviados. Os arquivos de texto anexados fazem parte da conversa. O ditado depende do serviço do seu navegador. As respostas do pet têm caráter de apoio à organização e aos estudos. Elas podem conter imprecisões e não substituem aconselhamento médico, psicológico, jurídico ou financeiro profissional.</p>
            <h2>4. Controle do usuário</h2><p>A inteligência artificial nunca cria, edita ou exclui tarefas sem uma confirmação explícita. Você pode revisar e remover seu conteúdo e solicitar a exclusão da conta.</p>
            <h2>5. Contato</h2><p>Para exercer seus direitos, relatar um problema ou esclarecer dúvidas, use o formulário de contato do site. A exclusão e exportação dos dados estão disponíveis em Configurações.</p>
          </article>
        )}
      </main>
      <PublicFooter />
    </div>
  )
}
