import { describe, expect, it } from 'vitest'
import { mergeGlossary } from '@mtn/domain'

describe('mergeGlossary', () => {
  it('prefers project glossary by default', () => {
    const global = [
      {
        id: crypto.randomUUID(),
        sourceTerm: 'Dungeon',
        targetTerm: 'Zindan',
        ruleType: 'always_translate' as const,
        caseSensitive: false,
        notes: null,
        priority: 1,
        updatedAt: new Date().toISOString()
      }
    ]

    const project = [
      {
        ...global[0],
        id: crypto.randomUUID(),
        targetTerm: 'Mahzen'
      }
    ]

    const merged = mergeGlossary(global, project, 'project_over_global')
    expect(merged[0]?.targetTerm).toBe('Mahzen')
  })

  it('can prefer global glossary', () => {
    const global = [
      {
        id: crypto.randomUUID(),
        sourceTerm: 'Sword',
        targetTerm: 'Kilic',
        ruleType: 'always_translate' as const,
        caseSensitive: false,
        notes: null,
        priority: 1,
        updatedAt: new Date().toISOString()
      }
    ]

    const project = [
      {
        ...global[0],
        id: crypto.randomUUID(),
        targetTerm: 'Pala'
      }
    ]

    const merged = mergeGlossary(global, project, 'global_over_project')
    expect(merged[0]?.targetTerm).toBe('Kilic')
  })
})

