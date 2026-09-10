/* oxlint-disable react/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiRequest, ApiError } from '../services/api'
import type { Habit, PawTransaction, Pet, Task } from '../types'

export interface ProfileValues {
  name?: string
  interests?: string[]
  dark_mode?: boolean
  notify_tasks?: boolean
  notify_habits?: boolean
  notify_companion?: boolean
}

interface Bootstrap {
  profile: { name: string; email: string; interests: string[]; darkMode: boolean; adopted: boolean; pet: Pet; notifications: { tasks: boolean; habits: boolean; companion: boolean } }
  tasks: Task[]
  habits: Habit[]
  paws: number
  focusMinutes: number
  transactions: PawTransaction[]
}

const empty: Bootstrap = {
  profile: { name: '', email: '', interests: [], darkMode: false, adopted: false,
    pet: { name: 'Doug', gender: 'male', coat: 'golden', personality: 'carinhoso', objective: 'Organizar minha rotina', adoptionDate: '' },
    notifications: { tasks: true, habits: true, companion: true } },
  tasks: [], habits: [], paws: 0, focusMinutes: 0, transactions: [],
}

interface WoofyContextValue {
  authenticated: boolean
  sessionReady: boolean
  sessionError: string
  adopted: boolean
  userName: string
  userEmail: string
  interests: string[]
  pet: Pet
  tasks: Task[]
  habits: Habit[]
  paws: number
  focusMinutes: number
  transactions: PawTransaction[]
  notifications: Bootstrap['profile']['notifications']
  darkMode: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  logout: () => Promise<void>
  toggleTask: (id: number) => Promise<void>
  toggleHabit: (id: number) => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<Task>
  addHabit: (habit: Omit<Habit, 'id' | 'completed'>) => Promise<Habit>
  saveProfile: (values: ProfileValues) => Promise<void>
  savePet: (values: Partial<Pet> & { adopted?: boolean }) => Promise<void>
  refreshData: () => Promise<void>
}

const WoofyContext = createContext<WoofyContextValue | null>(null)

export function WoofyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Bootstrap>(empty)
  const [authenticated, setAuthenticated] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState('')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('woofy_theme') === 'dark')

  const applyBootstrap = useCallback((result: Bootstrap) => {
    setData(result)
    setDarkMode(result.profile.darkMode)
    setAuthenticated(true)
    setSessionError('')
    setSessionReady(true)
  }, [])

  const refreshData = useCallback(async () => {
    const result = await apiRequest<Bootstrap>('/bootstrap', {}, true)
    applyBootstrap(result)
  }, [applyBootstrap])

  useEffect(() => {
    let active = true
    // Remove obsolete demo data and legacy script-readable session tokens.
    localStorage.removeItem('woofy_frontend_state_v1')
    localStorage.removeItem('woofy_access_token')
    void apiRequest<Bootstrap>('/bootstrap', {}, true).then((result) => {
      if (active) applyBootstrap(result)
    }).catch((error: unknown) => {
      if (!active) return
      if (!(error instanceof ApiError && error.status === 401)) setSessionError('Não foi possível conectar. Verifique sua conexão e tente novamente.')
      setSessionReady(true)
    })
    const expired = () => { setData(empty); setAuthenticated(false) }
    window.addEventListener('woofy-session-expired', expired)
    return () => { active = false; window.removeEventListener('woofy-session-expired', expired) }
  }, [applyBootstrap])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('woofy_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (!authenticated) return
    const refresh = () => { if (document.visibilityState === 'visible') void refreshData().catch(() => {}) }
    document.addEventListener('visibilitychange', refresh)
    const timer = window.setInterval(refresh, 60000)
    return () => { document.removeEventListener('visibilitychange', refresh); clearInterval(timer) }
  }, [authenticated, refreshData])

  const login = useCallback(async (email: string, password: string) => {
    await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, true)
    await refreshData()
  }, [refreshData])
  const register = useCallback(async (name: string, email: string, password: string) => {
    await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }, true)
    await refreshData()
  }, [refreshData])
  const loginWithGoogle = useCallback(async (credential: string) => {
    await apiRequest('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }, true)
    await refreshData()
  }, [refreshData])
  const logout = useCallback(async () => {
    await apiRequest('/auth/logout', { method: 'POST' })
    setData(empty)
    setAuthenticated(false)
  }, [])
  const toggleTask = async (id: number) => {
    const task = data.tasks.find((item) => item.id === id)
    if (!task) return
    await apiRequest(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ completed: !task.completed }) })
    await refreshData()
  }
  const toggleHabit = async (id: number) => {
    const habit = data.habits.find((item) => item.id === id)
    if (!habit) return
    await apiRequest(`/habits/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ completed: !habit.completed }) })
    await refreshData()
  }
  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    const created = await apiRequest<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) })
    await refreshData()
    return created
  }
  const addHabit = async (habit: Omit<Habit, 'id' | 'completed'>) => {
    const created = await apiRequest<Habit>('/habits', { method: 'POST', body: JSON.stringify(habit) })
    await refreshData()
    return created
  }
  const saveProfile = async (values: ProfileValues) => {
    await apiRequest('/profile', { method: 'PATCH', body: JSON.stringify(values) })
    await refreshData()
  }
  const savePet = async (values: Partial<Pet> & { adopted?: boolean }) => {
    const { adoptionDate: _date, accessory: _accessory, ...payload } = values
    await apiRequest('/pet', { method: 'PATCH', body: JSON.stringify(payload) })
    await refreshData()
  }

  return <WoofyContext.Provider value={{ authenticated, sessionReady, sessionError, adopted: data.profile.adopted,
    userName: data.profile.name, userEmail: data.profile.email, interests: data.profile.interests, pet: data.profile.pet,
    tasks: data.tasks, habits: data.habits, paws: data.paws, focusMinutes: data.focusMinutes, transactions: data.transactions,
    notifications: data.profile.notifications, darkMode, login, register, loginWithGoogle, logout, toggleTask,
    toggleHabit, addTask, addHabit, saveProfile, savePet, refreshData }}>{children}</WoofyContext.Provider>
}

export function useWoofy() {
  const value = useContext(WoofyContext)
  if (!value) throw new Error('useWoofy deve ser usado dentro de WoofyProvider')
  return value
}
