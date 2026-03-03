import type { JobState, ParagraphState } from '@mtn/shared'

const jobTransitions: Record<JobState, JobState[]> = {
  idle: ['extracting'],
  extracting: ['ready', 'failed', 'cancelled'],
  ready: ['translating', 'cancelled'],
  translating: ['paused', 'paused_recoverable', 'paused_error_waiting_user', 'completed', 'failed', 'cancelled'],
  paused: ['translating', 'cancelled'],
  paused_recoverable: ['translating', 'cancelled'],
  paused_error_waiting_user: ['translating', 'paused', 'cancelled'],
  completed: [],
  failed: [],
  cancelled: []
}

const paragraphTransitions: Record<ParagraphState, ParagraphState[]> = {
  pending: ['translating', 'skipped', 'locked'],
  translating: ['translated', 'error', 'skipped'],
  translated: ['edited', 'approved', 'locked', 'error'],
  edited: ['approved', 'translated', 'locked', 'error'],
  approved: ['edited', 'locked'],
  locked: ['approved', 'edited'],
  skipped: ['pending', 'translated', 'unresolved'],
  unresolved: ['pending', 'translated', 'error'],
  error: ['pending', 'skipped', 'unresolved']
}

export function canTransitionJob(from: JobState, to: JobState): boolean {
  return jobTransitions[from]?.includes(to) ?? false
}

export function canTransitionParagraph(from: ParagraphState, to: ParagraphState): boolean {
  return paragraphTransitions[from]?.includes(to) ?? false
}

export function assertJobTransition(from: JobState, to: JobState): void {
  if (!canTransitionJob(from, to)) {
    throw new Error(`Invalid job transition: ${from} -> ${to}`)
  }
}

export function assertParagraphTransition(from: ParagraphState, to: ParagraphState): void {
  if (!canTransitionParagraph(from, to)) {
    throw new Error(`Invalid paragraph transition: ${from} -> ${to}`)
  }
}

