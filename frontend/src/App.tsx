import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'

const AccessoriesPage = lazy(() => import('./pages/AccessoriesPage').then(({ AccessoriesPage }) => ({ default: AccessoriesPage })))
const AuthPage = lazy(() => import('./pages/AuthPage').then(({ AuthPage }) => ({ default: AuthPage })))
const ChatPage = lazy(() => import('./pages/ChatPage').then(({ ChatPage }) => ({ default: ChatPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(({ DashboardPage }) => ({ default: DashboardPage })))
const FocusPage = lazy(() => import('./pages/FocusPage').then(({ FocusPage }) => ({ default: FocusPage })))
const HabitsPage = lazy(() => import('./pages/HabitsPage').then(({ HabitsPage }) => ({ default: HabitsPage })))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(({ HowItWorksPage }) => ({ default: HowItWorksPage })))
const LandingPage = lazy(() => import('./pages/LandingPage').then(({ LandingPage }) => ({ default: LandingPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(({ NotFoundPage }) => ({ default: NotFoundPage })))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(({ OnboardingPage }) => ({ default: OnboardingPage })))
const PetPage = lazy(() => import('./pages/PetPage').then(({ PetPage }) => ({ default: PetPage })))
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(({ ProgressPage }) => ({ default: ProgressPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(({ SettingsPage }) => ({ default: SettingsPage })))
const StaticPage = lazy(() => import('./pages/StaticPage').then(({ StaticPage }) => ({ default: StaticPage })))
const TasksPage = lazy(() => import('./pages/TasksPage').then(({ TasksPage }) => ({ default: TasksPage })))

function AppArea({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}

function RouteFallback() {
  return <div className="route-loader" role="status"><span aria-hidden="true" /><strong>WOOFY</strong><small>Abrindo seu espaço</small></div>
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  )
}
