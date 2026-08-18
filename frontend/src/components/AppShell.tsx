import {
  Award,
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
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useWoofy } from '../contexts/WoofyContext'
import { BrandMark } from './BrandMark'
import { Mascot } from './Mascot'

const navItems = [
  { to: '/app', label: 'Início', icon: Home, end: true, area: 'home', motto: 'Seu dia em movimento' },
  { to: '/app/tarefas', label: 'Tarefas', icon: CheckSquare2, area: 'tasks', motto: 'Uma coisa de cada vez' },
  { to: '/app/habitos', label: 'Hábitos', icon: CalendarCheck2, area: 'habits', motto: 'Cuidado que vira rotina' },
  { to: '/app/foco', label: 'Modo foco', icon: Clock3, area: 'focus', motto: 'Presença antes de pressa' },
  { to: '/app/conversar', label: 'Conversar', icon: MessageCircle, area: 'chat', motto: 'Companhia sem julgamento' },
  { to: '/app/meu-pet', label: 'Meu Pet', icon: PawPrint, area: 'pet', motto: 'Seu companheiro, do seu jeito' },
  { to: '/app/acessorios', label: 'Acessórios', icon: Gift, area: 'rewards', motto: 'Conquistas com personalidade' },
  { to: '/app/progresso', label: 'Progresso', icon: BarChart3, area: 'progress', motto: 'Ritmo também é avanço' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { paws, pet, userName } = useWoofy()
  const location = useLocation()
  const currentNavIndex = navItems.findIndex(({ to, end }) => end ? location.pathname === to : location.pathname.startsWith(to))
  const activeArea = location.pathname === '/app/configuracoes'
    ? { label: 'Configurações', area: 'settings', motto: 'O Woofy no seu ritmo', code: '09' }
    : location.pathname === '/app/perfil'
      ? { label: 'Perfil', area: 'profile', motto: 'Sua história por aqui', code: '10' }
      : currentNavIndex >= 0
        ? { ...navItems[currentNavIndex], code: String(currentNavIndex + 1).padStart(2, '0') }
        : { label: 'Seu espaço', area: 'home', motto: 'Rotina com companhia', code: '00' }

  return (
    <div className="app-shell" data-area={activeArea.area}>
      <aside className={`app-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar-top">
          <BrandMark />
          <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X /></button>
        </div>
        <nav className="app-nav" aria-label="Navegação do aplicativo">
          {navItems.map(({ to, label, icon: Icon, end }, index) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>
              <small aria-hidden="true">{String(index + 1).padStart(2, '0')}</small>
              <Icon size={20} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-pet-card">
          <div className="sidebar-pet-visual"><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="sm" state="listening" accessory="none" /></div>
          <div>
            <span>Nível {Math.floor(paws / 100) + 1} · Seu companheiro</span>
            <strong>{pet.name}</strong>
            <i><b style={{ width: `${paws % 100}%` }} /></i>
          </div>
          <Award size={17} aria-hidden="true" />
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
            <span className="app-route-label" key={location.pathname}>
              <small><i aria-hidden="true" /> WOOFY / {activeArea.code}</small>
              <strong>{activeArea.label}</strong>
            </span>
            <span className="app-route-motto">{activeArea.motto}</span>
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
        <main id="main-content" className="app-main" tabIndex={-1}>{children}</main>
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
