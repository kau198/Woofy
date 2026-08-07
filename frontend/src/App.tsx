import { Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppShell } from './components/AppShell'
import { AccessoriesPage } from './pages/AccessoriesPage'
import { AuthPage } from './pages/AuthPage'
import { ChatPage } from './pages/ChatPage'
import { DashboardPage } from './pages/DashboardPage'
import { FocusPage } from './pages/FocusPage'
import { HabitsPage } from './pages/HabitsPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { LandingPage } from './pages/LandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PetPage } from './pages/PetPage'
import { ProgressPage } from './pages/ProgressPage'
import { SettingsPage } from './pages/SettingsPage'
import { StaticPage } from './pages/StaticPage'
import { TasksPage } from './pages/TasksPage'

function AppArea({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/como-funciona" element={<HowItWorksPage />} />
      <Route path="/entrar" element={<AuthPage mode="login" />} />
      <Route path="/criar-conta" element={<AuthPage mode="register" />} />
      <Route path="/adocao" element={<OnboardingPage />} />
      <Route path="/contato" element={<StaticPage type="contact" />} />
      <Route path="/termos" element={<StaticPage type="terms" />} />
      <Route path="/privacidade" element={<StaticPage type="privacy" />} />
      <Route path="/app" element={<AppArea><DashboardPage /></AppArea>} />
      <Route path="/app/tarefas" element={<AppArea><TasksPage /></AppArea>} />
      <Route path="/app/habitos" element={<AppArea><HabitsPage /></AppArea>} />
      <Route path="/app/foco" element={<AppArea><FocusPage /></AppArea>} />
      <Route path="/app/conversar" element={<AppArea><ChatPage /></AppArea>} />
      <Route path="/app/meu-pet" element={<AppArea><PetPage /></AppArea>} />
      <Route path="/app/acessorios" element={<AppArea><AccessoriesPage /></AppArea>} />
      <Route path="/app/progresso" element={<AppArea><ProgressPage /></AppArea>} />
      <Route path="/app/perfil" element={<AppArea><SettingsPage profile /></AppArea>} />
      <Route path="/app/configuracoes" element={<AppArea><SettingsPage /></AppArea>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
