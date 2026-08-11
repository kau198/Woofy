import { PawPrint } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer-top">
        <div className="footer-brand">
          <BrandMark />
          <p>Organize sua vida com um amigo ao seu lado.</p>
        </div>
        <div className="footer-column">
          <strong>Woofy</strong>
          <Link to="/como-funciona">Como funciona</Link>
          <Link to="/app">Demonstração</Link>
          <Link to="/criar-conta">Adotar um companheiro</Link>
        </div>
        <div className="footer-column">
          <strong>Suporte</strong>
          <Link to="/contato">Fale com a gente</Link>
          <Link to="/termos">Termos de uso</Link>
          <Link to="/privacidade">Privacidade</Link>
        </div>
        <div className="footer-note">
          <PawPrint size={25} />
          <p>Feito com carinho para dias reais — inclusive os mais bagunçados.</p>
        </div>
      </div>
      <div className="public-footer-bottom">
        <span>© 2026 Woofy. Todos os direitos reservados.</span>
        <span>O Woofy incentiva, mas nunca julga.</span>
      </div>
    </footer>
  )
}
