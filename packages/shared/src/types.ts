// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  name: string | null
  energy_baseline: number
  preferred_timer_minutes: number
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
  context_bookmark: string | null
  date: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

// ─── Day Plan ────────────────────────────────────────────────────────────────

export interface DayPlan {
  id: string
  user_id: string
  date: string
  energy_level: number
  top_three_ids: string[]
  created_at: string
  updated_at: string
}

// ─── Journal ─────────────────────────────────────────────────────────────────

export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface JournalEntry {
  id: string
  user_id: string
  date: string
  mood_start: MoodLevel | null
  mood_end: MoodLevel | null
  energy_start: number | null
  energy_end: number | null
  wins: string[]
  reflection: string | null
  tasks_completed: number
  avoid_apps: string[]
  avoided_apps_breached: string[]
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

export type ChatAction =
  | { type: 'create_task'; payload: { title: string; priority?: TaskPriority; description?: string } }
  | { type: 'breakdown_task'; payload: { title_or_id: string } }
  | { type: 'suggest_top_three'; payload: Record<string, never> }
  | { type: 'complete_task'; payload: { title_or_id: string } }
  | { type: 'save_context'; payload: { title_or_id: string; bookmark: string } }
  | { type: 'set_energy'; payload: { level: 1 | 2 | 3 | 4 | 5 } }
  | { type: 'reply_only'; payload: Record<string, never> }

export interface ChatContext {
  pendingTasks: Array<Pick<Task, 'id' | 'title' | 'priority' | 'status'>>
  energyLevel: number | null
  todayDate: string
}

export interface ChatResponse {
  reply: string
  actions: ChatAction[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: ChatAction[]
  createdAt: string
}

// ─── Memory / Palace ─────────────────────────────────────────────────────────

export type MemoryKind = 'fact' | 'preference' | 'event' | 'decision' | 'context' | 'pattern'
export type MemorySource = 'chat' | 'task' | 'journal' | 'manual' | 'inferred'

export interface MemoryWing {
  id: string
  user_id: string
  name: string
  summary: string | null
  created_at: string
  updated_at: string
}

export interface MemoryRoom {
  id: string
  wing_id: string
  name: string
  summary: string | null
  created_at: string
  updated_at: string
}

export interface Memory {
  id: string
  user_id: string
  wing_id: string | null
  room_id: string | null
  content: string
  kind: MemoryKind
  valid_from: string
  valid_until: string | null
  invalidated_by: string | null
  invalidated_reason: string | null
  source_type: MemorySource | null
  source_id: string | null
  confidence: number
  created_at: string
}
