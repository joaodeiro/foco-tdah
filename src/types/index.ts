// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  name: string | null
  energy_baseline: number // 1-5, default 3
  preferred_timer_minutes: number // default 25
  created_at: string
  updated_at: string
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'paused'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface TaskStep {
  id: string
  task_id: string
  content: string
  order: number
  completed: boolean
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  estimated_minutes: number | null
  steps: TaskStep[]
  context_bookmark: string | null // texto salvo ao ser interrompido
  date: string // YYYY-MM-DD
  completed_at: string | null
  created_at: string
  updated_at: string
}

// ─── Day Plan ─────────────────────────────────────────────────────────────────

export interface DayPlan {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  energy_level: number // 1-5
  top_three_ids: string[] // IDs das 3 tarefas prioritárias
  created_at: string
  updated_at: string
}

// ─── Journal ─────────────────────────────────────────────────────────────────

export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface JournalEntry {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  mood_start: MoodLevel | null
  mood_end: MoodLevel | null
  energy_start: number | null
  energy_end: number | null
  wins: string[] // lista de conquistas do dia
  reflection: string | null
  tasks_completed: number
  created_at: string
  updated_at: string
}

// ─── Streaks ─────────────────────────────────────────────────────────────────

export interface Streak {
  current: number
  longest: number
  last_active_date: string | null
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AIBreakdownResult {
  steps: string[]
  estimated_minutes: number
}

export interface AIProvider {
  breakdownTask(title: string, description?: string): Promise<AIBreakdownResult>
  suggestTopThree(tasks: Task[], energyLevel: number): Promise<string[]>
}
