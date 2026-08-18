import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'

export function StaticPage({ type }: { type: 'contact' | 'terms' | 'privacy' }) {
  const title = type === 'contact' ? 'Fale com a gente' : type === 'terms' ? 'Termos de uso' : 'Política de privacidade'
  return (
    <div className="public-page">
      <PublicHeader />
      <main id="main-content" className="static-page" tabIndex={-1}>
        <div className="static-heading"><span>Woofy • Transparência e cuidado</span><h1>{title}</h1><p>{type === 'contact' ? 'Dúvidas, ideias ou só quer dizer oi? Nosso time vai adorar conversar com você.' : 'Última atualização: 06 de agosto de 2026.'}</p></div>
        {type === 'contact' ? (
          <div className="contact-grid">
            <form className="contact-form" onSubmit={(event) => event.preventDefault()}><label>Nome<input placeholder="Seu nome" /></label><label>E-mail<input type="email" placeholder="voce@exemplo.com" /></label><label>Assunto<select defaultValue=""><option value="" disabled>Escolha uma opção</option><option>Dúvida</option><option>Sugestão</option><option>Suporte</option></select></label><label>Mensagem<textarea rows={5} placeholder="Conte para a gente como podemos ajudar" /></label><button className="button button-primary" type="submit">Enviar mensagem</button></form>
            <aside className="contact-aside"><div><Mail /><span><strong>E-mail</strong>oi@woofy.com.br</span></div><div><MessageCircle /><span><strong>Resposta</strong>Em até 2 dias úteis</span></div><div><MapPin /><span><strong>Onde estamos</strong>Brasil, com carinho</span></div></aside>
          </div>
        ) : (
          <article className="legal-content">
            <h2>1. Sobre o Woofy</h2><p>O Woofy é uma plataforma de organização pessoal que combina tarefas, hábitos, sessões de foco e recursos de inteligência artificial. Ao utilizar o serviço, você concorda com as condições descritas nesta página.</p>
            <h2>2. Sua conta e seus dados</h2><p>Você é responsável por manter suas credenciais seguras. Os dados fornecidos são usados somente para oferecer e melhorar a experiência da plataforma, conforme os princípios de necessidade, transparência e segurança.</p>
            <h2>3. Inteligência artificial</h2><p>As respostas do pet têm caráter de apoio à organização e aos estudos. Elas podem conter imprecisões e não substituem aconselhamento médico, psicológico, jurídico ou financeiro profissional.</p>
            <h2>4. Controle do usuário</h2><p>A inteligência artificial nunca cria, edita ou exclui tarefas sem uma confirmação explícita. Você pode revisar e remover seu conteúdo e solicitar a exclusão da conta.</p>
            <h2>5. Contato</h2><p>Para exercer seus direitos, relatar um problema ou esclarecer dúvidas, escreva para privacidade@woofy.com.br.</p>
          </article>
        )}
      </main>
      <PublicFooter />
    </div>
  )
}
