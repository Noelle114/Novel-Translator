import { describe, expect, it } from 'vitest'
import {
  canTransitionJob,
  canTransitionParagraph
} from '@mtn/domain'

describe('state machine', () => {
  it('allows expected job transitions', () => {
    expect(canTransitionJob('ready', 'translating')).toBe(true)
    expect(canTransitionJob('translating', 'paused')).toBe(true)
    expect(canTransitionJob('completed', 'translating')).toBe(false)
  })

  it('allows expected paragraph transitions', () => {
    expect(canTransitionParagraph('pending', 'translating')).toBe(true)
    expect(canTransitionParagraph('translated', 'approved')).toBe(true)
    expect(canTransitionParagraph('approved', 'pending')).toBe(false)
  })
})

