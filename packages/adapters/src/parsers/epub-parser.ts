import fs from 'node:fs/promises'
import path from 'node:path'
import JSZip from 'jszip'
import { XMLParser } from 'fast-xml-parser'
import {
  ParagraphSchema,
  type Chapter,
  type Paragraph,
  type Section,
  type SourceDocumentMetadata
} from '@mtn/shared'
import type { IParser, ParsedDocument } from './interfaces.js'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
})

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractParagraphsFromHtml(html: string): string[] {
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
  const paragraphs = matches
    .map((match) => stripHtml(match[1] ?? ''))
    .filter((entry) => entry.length > 0)

  if (paragraphs.length > 0) {
    return paragraphs
  }

  return stripHtml(html)
    .split(/\n{2,}|\r\n\r\n/g)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
}

function extractTitleFromHtml(html: string, fallback: string): string {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!h1) {
    return fallback
  }
  const title = stripHtml(h1[1] ?? '')
  return title || fallback
}

function parseMetadata(contentOpf: string | null): { title: string; author: string | null } {
  if (!contentOpf) {
    return { title: 'Untitled', author: null }
  }

  try {
    const parsed = xmlParser.parse(contentOpf)
    const metadata = parsed?.package?.metadata
    const title = metadata?.['dc:title'] ?? 'Untitled'
    const author = metadata?.['dc:creator'] ?? null
    return {
      title: typeof title === 'string' ? title : 'Untitled',
      author: typeof author === 'string' ? author : null
    }
  } catch {
    return { title: 'Untitled', author: null }
  }
}

export class EpubParser implements IParser {
  async parse(projectId: string, filePath: string): Promise<ParsedDocument> {
    const bytes = await fs.readFile(filePath)
    const zip = await JSZip.loadAsync(bytes)

    const fileNames = Object.keys(zip.files)
    const htmlFiles = fileNames.filter((entry) => /\.(xhtml|html|htm)$/i.test(entry) && !entry.includes('nav'))

    if (htmlFiles.length === 0) {
      throw new Error('EPUB parse failure: no XHTML/HTML chapter files found')
    }

    const opfPath = fileNames.find((entry) => /content\.opf$/i.test(entry)) ?? null
    const opfContent = opfPath ? await zip.file(opfPath)?.async('string') : null
    const metadata = parseMetadata(opfContent ?? null)

    const chapters: Chapter[] = []
    const sections: Section[] = []
    const paragraphs: Paragraph[] = []

    let paragraphGlobalIndex = 0

    for (let chapterIndex = 0; chapterIndex < htmlFiles.length; chapterIndex += 1) {
      const chapterFile = htmlFiles[chapterIndex]
      const html = await zip.file(chapterFile)?.async('string')
      if (!html) {
        continue
      }

      const chapterId = crypto.randomUUID()
      const sectionId = crypto.randomUUID()
      const chapterTitle = extractTitleFromHtml(html, path.basename(chapterFile))

      chapters.push({
        id: chapterId,
        projectId,
        index: chapterIndex,
        title: chapterTitle,
        sourceRef: chapterFile
      })

      sections.push({
        id: sectionId,
        chapterId,
        index: 0,
        kind: 'paragraphs'
      })

      const extractedParagraphs = extractParagraphsFromHtml(html)
      for (let i = 0; i < extractedParagraphs.length; i += 1) {
        const sourceText = extractedParagraphs[i]
        paragraphs.push(
          ParagraphSchema.parse({
            id: crypto.randomUUID(),
            projectId,
            sectionId,
            index: paragraphGlobalIndex,
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
        paragraphGlobalIndex += 1
      }
    }

    const sourceMetadata: SourceDocumentMetadata = {
      projectId,
      title: metadata.title,
      author: metadata.author,
      language: 'en',
      chaptersCount: chapters.length,
      hasImages: fileNames.some((entry) => /\.(jpg|jpeg|png|gif|webp)$/i.test(entry)),
      hasFootnotes: false,
      tocAvailable: fileNames.some((entry) => /nav\.xhtml$/i.test(entry)),
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

