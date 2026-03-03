import fs from 'node:fs'
import path from 'node:path'
import PDFDocument from 'pdfkit'
import { type IExporter, type ExportInput } from './interfaces.js'

export class PdfExporter implements IExporter {
  async export(input: ExportInput): Promise<string> {
    await fs.promises.mkdir(path.dirname(input.outputPath), { recursive: true })

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({
        margins: {
          top: input.profile.margins.top,
          left: input.profile.margins.left,
          right: input.profile.margins.right,
          bottom: input.profile.margins.bottom
        }
      })

      const stream = fs.createWriteStream(input.outputPath)
      stream.on('finish', () => resolve())
      stream.on('error', (error) => reject(error))
      doc.pipe(stream)

      doc.fontSize(input.profile.fontSize)
      const sourceColor = input.profile.sourceTextColor ?? input.profile.textColor
      const translatedColor = input.profile.translatedTextColor ?? input.profile.textColor
      doc.fillColor(translatedColor)
      doc.text(input.sourceMetadata.title)
      doc.moveDown(1)

      for (const paragraph of input.paragraphs) {
        const sourceText = paragraph.sourceText.trim()
        const translationText = paragraph.translationText.trim()

        if (input.profile.layout === 'single') {
          doc.fillColor(translatedColor)
          doc.text(translationText || sourceText, { paragraphGap: input.profile.paragraphSpacing })
          continue
        }

        if (input.profile.layout === 'bilingual-sidebyside') {
          doc.fillColor(sourceColor)
          doc.text(sourceText)

          if (translationText) {
            doc.fillColor(translatedColor)
            doc.text(translationText, { paragraphGap: input.profile.paragraphSpacing })
          } else {
            doc.moveDown(input.profile.paragraphSpacing / Math.max(input.profile.fontSize, 1))
          }
          continue
        }

        doc.fillColor(sourceColor)
        doc.text(sourceText)

        if (translationText) {
          doc.fillColor(translatedColor)
          doc.text(translationText, { paragraphGap: input.profile.paragraphSpacing })
        } else {
          doc.moveDown(input.profile.paragraphSpacing / Math.max(input.profile.fontSize, 1))
        }
      }

      doc.end()
    })

    return input.outputPath
  }
}
