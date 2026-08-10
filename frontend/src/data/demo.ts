import type { Habit, PawTransaction, Task } from '../types'

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Revisar o capítulo de banco de dados',
    description: 'Focar em normalização e comandos SQL.',
    category: 'Estudos',
    priority: 'Alta',
    date: 'Hoje',
    time: '09:30',
    completed: false,
    subtasks: [
      { id: 11, title: 'Revisar normalização', completed: true },
      { id: 12, title: 'Praticar SELECT e JOIN', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Responder e-mails importantes',
    category: 'Trabalho',
    priority: 'Média',
    date: 'Hoje',
    time: '11:00',
    completed: false,
  },
  {
    id: 3,
    title: 'Caminhar por 20 minutos',
    category: 'Saúde',
    priority: 'Baixa',
    date: 'Hoje',
    time: '17:30',
    completed: true,
  },
  {
    id: 4,
    title: 'Organizar a mesa de estudos',
    category: 'Casa',
    priority: 'Baixa',
    date: 'Amanhã',
    completed: false,
  },
]

export const initialHabits: Habit[] = [
  { id: 1, name: 'Beber água', icon: 'water', time: '8 copos', completed: true, color: 'sky' },
  { id: 2, name: 'Ler um pouco', icon: 'book', time: '20 min', completed: false, color: 'amber' },
  { id: 3, name: 'Fazer uma pausa', icon: 'coffee', time: '10 min', completed: false, color: 'rose' },
  { id: 4, name: 'Dormir antes das 23h', icon: 'sleep', time: '22:45', completed: false, color: 'lavender' },
]

export const initialTransactions: PawTransaction[] = [
  { id: 1, amount: 10, description: 'Tarefa concluída', date: 'Hoje, 08:42' },
  { id: 2, amount: 5, description: 'Hábito concluído', date: 'Ontem, 20:15' },
  { id: 3, amount: 15, description: 'Sessão de foco', date: 'Ontem, 16:30' },
]

export const coatOptions = [
  { id: 'cream', label: 'Creme claro', color: '#EAD9C4' },
  { id: 'golden', label: 'Dourado natural', color: '#D8AC72' },
  { id: 'honey', label: 'Mel suave', color: '#C28B53' },
  { id: 'caramel', label: 'Caramelo', color: '#9A6648' },
  { id: 'red', label: 'Ruivo acobreado', color: '#7E4C37' },
] as const

export const objectives = [
  'Organizar meus estudos',
  'Reduzir a procrastinação',
  'Criar hábitos melhores',
  'Organizar meu trabalho',
  'Cuidar melhor da minha rotina',
  'Melhorar minha produtividade',
  'Organizar meus compromissos',
]
