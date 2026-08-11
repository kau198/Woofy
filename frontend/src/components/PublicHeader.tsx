import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BrandMark } from './BrandMark'

export function PublicHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <BrandMark />
        <nav className={`public-nav ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
          <NavLink to="/como-funciona" onClick={() => setOpen(false)}>Como funciona</NavLink>
          <Link to="/app" onClick={() => setOpen(false)}>Demonstração</Link>
          <Link to="/criar-conta" onClick={() => setOpen(false)}>Adoção</Link>
          <Link className="mobile-login" to="/entrar" onClick={() => setOpen(false)}>Entrar</Link>
        </nav>
        <div className="public-actions">
          <Link className="link-button" to="/entrar">Entrar</Link>
          <Link className="button button-sm button-primary" to="/criar-conta">Criar conta</Link>
        </div>
        <button
          type="button"
          className="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
