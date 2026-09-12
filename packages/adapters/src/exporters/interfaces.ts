import type { ExportProfile, Paragraph, ProjectMetadata, SourceDocumentMetadata } from '@mtn/shared'

export type ExportInput = {
  project: ProjectMetadata
  sourceMetadata: SourceDocumentMetadata
  paragraphs: Paragraph[]
  profile: ExportProfile
  outputPath: string
  targetLanguage: string
}

export interface IExporter {
  export(input: ExportInput): Promise<string>
}

export function buildRenderableText(paragraph: Paragraph, layout: ExportInput['profile']['layout']): string {
  const sourceText = paragraph.sourceText.trim()
  const translationText = paragraph.translationText.trim()

  if (layout === 'single') {
    return translationText || sourceText
  }

  if (layout === 'bilingual-sidebyside') {
    return translationText ? `${sourceText}\n${translationText}` : sourceText
  }

  return translationText ? `${sourceText}\n${translationText}` : sourceText
}

