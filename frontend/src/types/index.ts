export type CoatType = 'cream' | 'golden' | 'honey' | 'caramel' | 'red'
export type PetGender = 'male' | 'female'
export type Personality = 'carinhoso' | 'calmo' | 'divertido' | 'animado'
export type TaskCategory = 'Pessoal' | 'Estudos' | 'Trabalho' | 'Saúde' | 'Casa' | 'Outros'
export type TaskPriority = 'Baixa' | 'Média' | 'Alta'

export interface Pet {
  name: string
  gender: PetGender
  coat: CoatType
  personality: Personality
  objective: string
  adoptionDate: string
}

export interface Task {
  id: number
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  date: string
  time?: string
  completed: boolean
  subtasks?: Array<{ id: number; title: string; completed: boolean }>
}

export interface Habit {
  id: number
  name: string
  icon: string
  time: string
  completed: boolean
  color: string
}

export interface PawTransaction {
  id: number
  amount: number
  description: string
  date: string
}
