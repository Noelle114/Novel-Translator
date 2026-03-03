import type {
  Chapter,
  Paragraph,
  Section,
  SourceDocumentMetadata
} from '@mtn/shared'

export type ParsedDocument = {
  sourceMetadata: SourceDocumentMetadata
  chapters: Chapter[]
  sections: Section[]
  paragraphs: Paragraph[]
}

export interface IParser {
  parse(projectId: string, filePath: string): Promise<ParsedDocument>
}

