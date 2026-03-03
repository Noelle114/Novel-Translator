import type { GlossaryEntry } from '@mtn/shared'

export function mergeGlossary(
  globalEntries: GlossaryEntry[],
  projectEntries: GlossaryEntry[],
  behavior: 'project_over_global' | 'global_over_project' = 'project_over_global'
): GlossaryEntry[] {
  const ordered = behavior === 'project_over_global'
    ? [...globalEntries, ...projectEntries]
    : [...projectEntries, ...globalEntries]

  const map = new Map<string, GlossaryEntry>()
  for (const entry of ordered) {
    const key = `${entry.ruleType}::${entry.sourceTerm.toLowerCase()}`
    map.set(key, entry)
  }

  return [...map.values()].sort((a, b) => b.priority - a.priority)
}

export function glossaryToPromptLines(entries: GlossaryEntry[]): string[] {
  return entries.map((entry) => {
    switch (entry.ruleType) {
      case 'never_translate':
        return `- NEVER TRANSLATE: ${entry.sourceTerm}`
      case 'always_translate':
        return `- ALWAYS TRANSLATE: ${entry.sourceTerm} => ${entry.targetTerm ?? ''}`
      case 'preserve':
        return `- PRESERVE EXACTLY: ${entry.sourceTerm}`
      case 'name_map':
        return `- NAME MAP: ${entry.sourceTerm} => ${entry.targetTerm ?? ''}`
      default:
        return `- RULE: ${entry.sourceTerm}`
    }
  })
}

