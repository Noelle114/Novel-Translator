import fs from 'node:fs/promises'
import {
  ParagraphSchema,
  type Chapter,
  type Paragraph,
  type Section,
  type SourceDocumentMetadata
} from '@mtn/shared'
import type { IParser, ParsedDocument } from './interfaces.js'

function splitPdfParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/g)
    .map((entry) => entry.replace(/\s+/g, ' ').trim())
    .filter((entry) => entry.length > 0)
}

export class PdfTextParser implements IParser {
  async parse(projectId: string, filePath: string): Promise<ParsedDocument> {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const data = await fs.readFile(filePath)
    const loadingTask = pdfjs.getDocument({ data })
    const doc = await loadingTask.promise

    let fullText = ''
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      const page = await doc.getPage(pageNumber)
      const content = await page.getTextContent()
      const pageText = content.items
        .map((item: any) => item.str ?? '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (pageText.length > 0) {
        fullText += `${pageText}\n\n`
      }
    }

    const normalizedText = fullText.trim()
    if (normalizedText.length < 80) {
      throw new Error('PDF parse failure: text layer not found or too short (possible image-based PDF / OCR required)')
    }

    const chapterId = crypto.randomUUID()
    const sectionId = crypto.randomUUID()

    const chapters: Chapter[] = [
      {
        id: chapterId,
        projectId,
        index: 0,
        title: 'Imported PDF',
        sourceRef: null
      }
    ]

    const sections: Section[] = [
      {
        id: sectionId,
        chapterId,
        index: 0,
        kind: 'paragraphs'
      }
    ]

    const paragraphs: Paragraph[] = splitPdfParagraphs(normalizedText).map((sourceText, index) =>
      ParagraphSchema.parse({
        id: crypto.randomUUID(),
        projectId,
        sectionId,
        index,
        sourceText,
        sourceInlineMarks: {},
        translationText: '',
        state: 'pending',
        isLocked: false,
        isSkipped: false,
        issueFlag: false,
        contextHash: null,
        providerTrace: null,
        revision: 0,
        updatedAt: new Date().toISOString(),
        lineageParentId: null
      })
    )

    const sourceMetadata: SourceDocumentMetadata = {
      projectId,
      title: 'Imported PDF',
      author: null,
      language: 'en',
      chaptersCount: 1,
      hasImages: true,
      hasFootnotes: false,
      tocAvailable: false,
      drmStatus: 'unknown'
    }

    return {
      sourceMetadata,
      chapters,
      sections,
      paragraphs
    }
  }
}

