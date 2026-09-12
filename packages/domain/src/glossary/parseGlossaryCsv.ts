export type GlossaryCsvRow = {
  sourceTerm: string
  targetTerm: string | null
}

const HEADER_SOURCE = /^(source|target|源词|目标词|原文|译文|key|value)$/i

export function parseGlossaryCsv(text: string): GlossaryCsvRow[] {
  const rows: GlossaryCsvRow[] = []

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) {
      continue
    }

    const parts = line.split(/[,，\t]/)
    const source = (parts[0] ?? '').trim()
    const target = (parts[1] ?? '').trim()

    if (!source) {
      continue
    }

    if (HEADER_SOURCE.test(source) && !target) {
      continue
    }

    rows.push({ sourceTerm: source, targetTerm: target || null })
  }

  return rows
}
