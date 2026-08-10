/* oxlint-disable react/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialHabits, initialTasks, initialTransactions } from '../data/demo'
import type { Habit, PawTransaction, Pet, Task } from '../types'

interface WoofyContextValue {
  userName: string
  setUserName: (name: string) => void
  interests: string[]
  setInterests: (interests: string[]) => void
  pet: Pet
  setPet: (pet: Pet) => void
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  toggleTask: (id: number) => void
  habits: Habit[]
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  toggleHabit: (id: number) => void
  paws: number
  transactions: PawTransaction[]
  addPaws: (amount: number, description: string) => void
  darkMode: boolean
  setDarkMode: (enabled: boolean) => void
}

const defaultPet: Pet = {
  name: 'Doug',
  gender: 'male',
  coat: 'golden',
  personality: 'carinhoso',
  objective: 'Organizar meus estudos',
  adoptionDate: '06 de agosto de 2026',
}

const WoofyContext = createContext<WoofyContextValue | null>(null)

const STORAGE_KEY = 'woofy_frontend_state_v1'

interface StoredWoofyState {
  userName?: string
  interests?: string[]
  pet?: Pet
  tasks?: Task[]
  habits?: Habit[]
  paws?: number
  transactions?: PawTransaction[]
  darkMode?: boolean
}

function loadStoredState(): StoredWoofyState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as StoredWoofyState : {}
  } catch {
    return {}
  }
}

export function WoofyProvider({ children }: { children: ReactNode }) {
  const [storedState] = useState(loadStoredState)
  const [userName, setUserName] = useState(storedState.userName ?? 'Kauã')
  const [interests, setInterests] = useState<string[]>(storedState.interests ?? ['Futebol', 'Games', 'Tecnologia'])
  const [pet, setPet] = useState(storedState.pet ?? defaultPet)
  const [tasks, setTasks] = useState(storedState.tasks ?? initialTasks)
  const [habits, setHabits] = useState(storedState.habits ?? initialHabits)
  const [paws, setPaws] = useState(storedState.paws ?? 245)
  const [transactions, setTransactions] = useState(storedState.transactions ?? initialTransactions)
  const [darkMode, setDarkMode] = useState(storedState.darkMode ?? false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const snapshot: StoredWoofyState = { userName, interests, pet, tasks, habits, paws, transactions, darkMode }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }, [userName, interests, pet, tasks, habits, paws, transactions, darkMode])

  const addPaws = useCallback((amount: number, description: string) => {
    setPaws((current) => current + amount)
    setTransactions((current) => [
      { id: Date.now(), amount, description, date: 'Agora' },
      ...current,
    ])
  }, [])

  const toggleTask = useCallback((id: number) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task
        if (!task.completed) addPaws(10, `Tarefa concluída: ${task.title}`)
        return { ...task, completed: !task.completed }
      }),
    )
  }, [addPaws])

  const toggleHabit = useCallback((id: number) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit
        if (!habit.completed) addPaws(5, `Hábito concluído: ${habit.name}`)
        return { ...habit, completed: !habit.completed }
      }),
    )
  }, [addPaws])

  const value = useMemo(
    () => ({
      userName,
      setUserName,
      interests,
      setInterests,
      pet,
      setPet,
      tasks,
      setTasks,
      toggleTask,
      habits,
      setHabits,
      toggleHabit,
      paws,
      transactions,
      addPaws,
      darkMode,
      setDarkMode,
    }),
    [userName, interests, pet, tasks, toggleTask, habits, toggleHabit, paws, transactions, addPaws, darkMode],
  )

  return <WoofyContext.Provider value={value}>{children}</WoofyContext.Provider>
}

export function useWoofy() {
  const context = useContext(WoofyContext)
  if (!context) throw new Error('useWoofy deve ser usado dentro de WoofyProvider')
  return context
}
