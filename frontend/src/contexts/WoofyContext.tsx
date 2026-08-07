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

export function WoofyProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('Kauã')
  const [interests, setInterests] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem('woofy_interests')
      return stored ? JSON.parse(stored) as string[] : ['Futebol', 'Games', 'Tecnologia']
    } catch {
      return ['Futebol', 'Games', 'Tecnologia']
    }
  })
  const [pet, setPet] = useState(defaultPet)
  const [tasks, setTasks] = useState(initialTasks)
  const [habits, setHabits] = useState(initialHabits)
  const [paws, setPaws] = useState(245)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    window.localStorage.setItem('woofy_interests', JSON.stringify(interests))
  }, [interests])

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
