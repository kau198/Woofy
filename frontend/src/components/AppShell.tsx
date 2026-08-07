import {
  BarChart3,
  CalendarCheck2,
  CheckSquare2,
  ChevronDown,
  Clock3,
  Gift,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  PawPrint,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useWoofy } from '../contexts/WoofyContext'
import { BrandMark } from './BrandMark'
import { Mascot } from './Mascot'

const navItems = [
  { to: '/app', label: 'Início', icon: Home, end: true },
  { to: '/app/tarefas', label: 'Tarefas', icon: CheckSquare2 },
  { to: '/app/habitos', label: 'Hábitos', icon: CalendarCheck2 },
  { to: '/app/foco', label: 'Modo foco', icon: Clock3 },
  { to: '/app/conversar', label: 'Conversar', icon: MessageCircle },
  { to: '/app/meu-pet', label: 'Meu Pet', icon: PawPrint },
  { to: '/app/acessorios', label: 'Acessórios', icon: Gift },
  { to: '/app/progresso', label: 'Progresso', icon: BarChart3 },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { paws, pet, userName } = useWoofy()

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar-top">
          <BrandMark />
          <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X /></button>
        </div>
        <nav className="app-nav" aria-label="Navegação do aplicativo">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>
              <Icon size={20} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-pet-card">
          <div className="sidebar-pet-visual"><Mascot coat={pet.coat} size="sm" accessory="none" /></div>
          <div>
            <span>Seu companheiro</span>
            <strong>{pet.name}</strong>
          </div>
          <Sparkles size={17} />
        </div>
        <div className="sidebar-bottom">
          <NavLink to="/app/configuracoes"><Settings size={20} /> Configurações</NavLink>
          <NavLink to="/"><LogOut size={20} /> Sair</NavLink>
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}

      <div className="app-stage">
        <header className="app-header">
          <div className="app-header-left">
            <button className="sidebar-trigger" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu /></button>
            <BrandMark compact />
          </div>
          <div className="app-header-actions">
            <div className="paws-balance"><PawPrint size={17} fill="currentColor" /> <strong>{paws}</strong><span>patinhas</span></div>
            <NavLink className="profile-chip" to="/app/perfil">
              <span className="profile-avatar">{userName.charAt(0)}</span>
              <span className="profile-name">{userName}</span>
              <ChevronDown size={16} />
            </NavLink>
          </div>
        </header>
        <main className="app-main">{children}</main>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Navegação móvel">
        {navItems.slice(0, 4).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}><Icon size={21} /><span>{label}</span></NavLink>
        ))}
        <button onClick={() => setMobileOpen(true)}><Menu size={21} /><span>Mais</span></button>
      </nav>
    </div>
  )
}
