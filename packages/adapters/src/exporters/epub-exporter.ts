import fs from 'node:fs/promises'
import path from 'node:path'
import JSZip from 'jszip'
import { type IExporter, type ExportInput } from './interfaces.js'

export class EpubExporter implements IExporter {
  async export(input: ExportInput): Promise<string> {
    const zip = new JSZip()
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })

    zip.file('META-INF/container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

    const sourceColor = input.profile.sourceTextColor ?? input.profile.textColor
    const translatedColor = input.profile.translatedTextColor ?? input.profile.textColor

    const body = input.paragraphs
      .map((paragraph) => renderParagraph(paragraph, input.profile.layout, sourceColor, translatedColor))
      .join('\n')

    zip.file('OEBPS/chapter1.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${input.targetLanguage}">
  <head>
    <title>${escapeXml(input.sourceMetadata.title)}</title>
    <style>
      body {
        font-family: ${escapeXml(input.profile.fontFamily)};
        font-size: ${input.profile.fontSize}px;
        color: ${escapeXml(input.profile.textColor)};
        background: ${escapeXml(input.profile.backgroundColor)};
      }
      p {
        margin: 0 0 ${input.profile.paragraphSpacing}px 0;
      }
      .source {
        color: ${escapeXml(sourceColor)};
      }
      .translated {
        color: ${escapeXml(translatedColor)};
      }
      .pipe {
        color: ${escapeXml(input.profile.textColor)};
      }
    </style>
  </head>
  <body>
    <h1>${escapeXml(input.sourceMetadata.title)}</h1>
    ${body}
  </body>
</html>`)

    zip.file('OEBPS/nav.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>TOC</title></head>
  <body>
    <nav epub:type="toc" id="toc">
      <ol>
        <li><a href="chapter1.xhtml">${escapeXml(input.sourceMetadata.title)}</a></li>
      </ol>
    </nav>
  </body>
</html>`)

    zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${input.project.id}</dc:identifier>
    <dc:title>${escapeXml(input.sourceMetadata.title)}</dc:title>
    <dc:language>${input.targetLanguage}</dc:language>
    ${input.sourceMetadata.author ? `<dc:creator>${escapeXml(input.sourceMetadata.author)}</dc:creator>` : ''}
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter1"/>
  </spine>
</package>`)

    const fileBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    await fs.mkdir(path.dirname(input.outputPath), { recursive: true })
    await fs.writeFile(input.outputPath, fileBuffer)
    return input.outputPath
  }
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function renderParagraph(
  paragraph: ExportInput['paragraphs'][number],
  layout: ExportInput['profile']['layout'],
  sourceColor: string,
  translatedColor: string
): string {
  const sourceText = paragraph.sourceText.trim()
  const translationText = paragraph.translationText.trim()

  if (layout === 'single') {
    const singleText = translationText || sourceText
    return `<p><span class="translated" style="color:${escapeXml(translatedColor)}">${escapeXml(singleText)}</span></p>`
  }

  if (layout === 'bilingual-sidebyside') {
    if (!translationText) {
      return `<p><span class="source" style="color:${escapeXml(sourceColor)}">${escapeXml(sourceText)}</span></p>`
    }

    return `<p><span class="source" style="color:${escapeXml(sourceColor)}">${escapeXml(sourceText)}</span><br /><span class="translated" style="color:${escapeXml(translatedColor)}">${escapeXml(translationText)}</span></p>`
  }

  if (!translationText) {
    return `<p><span class="source" style="color:${escapeXml(sourceColor)}">${escapeXml(sourceText)}</span></p>`
  }

  return `<p><span class="source" style="color:${escapeXml(sourceColor)}">${escapeXml(sourceText)}</span><br /><span class="translated" style="color:${escapeXml(translatedColor)}">${escapeXml(translationText)}</span></p>`
}
