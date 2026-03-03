import fs from 'node:fs/promises'
import path from 'node:path'
import {
  EpubParser,
  PdfTextParser,
  type IParser,
  type ParsedDocument
} from '@mtn/adapters'
import { ProjectMetadataSchema, SourceTypeSchema, type ProjectMetadata } from '@mtn/shared'
import { AppDatabase, projectPaths } from '@mtn/storage'

export class ProjectService {
  private readonly parsers: Record<'epub' | 'pdf', IParser>

  constructor(
    private readonly db: AppDatabase,
    private readonly projectsRootDir: string
  ) {
    this.parsers = {
      epub: new EpubParser(),
      pdf: new PdfTextParser()
    }
  }

  async createFromFile(filePath: string, providedName?: string): Promise<ProjectMetadata> {
    const ext = path.extname(filePath).toLowerCase()
    const sourceType = this.detectSourceType(ext)
    const projectId = crypto.randomUUID()

    const parsed = await this.parseDocument(projectId, sourceType, filePath)
    const now = new Date().toISOString()

    const project = ProjectMetadataSchema.parse({
      id: projectId,
      name: providedName || path.basename(filePath, ext),
      sourceFilePath: filePath,
      sourceType,
      status: 'ready',
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now
    })

    const projectDir = projectPaths(this.projectsRootDir, projectId)
    const sourceDest = path.join(projectDir.sourceDir, `original${ext}`)
    await fs.copyFile(filePath, sourceDest)

    await fs.writeFile(path.join(projectDir.extractedDir, 'document.jsonl'), parsed.paragraphs.map((entry) => JSON.stringify(entry)).join('\n'))
    await fs.writeFile(path.join(projectDir.extractedDir, 'toc.json'), JSON.stringify(parsed.chapters, null, 2))

    this.db.createProject(project, parsed.sourceMetadata, parsed.chapters, parsed.sections, parsed.paragraphs)
    return project
  }

  listProjects(): ProjectMetadata[] {
    return this.db.listProjects()
  }

  async deleteProject(projectId: string): Promise<void> {
    this.db.deleteProject(projectId)
    await fs.rm(path.join(this.projectsRootDir, projectId), { recursive: true, force: true })
  }

  openProject(projectId: string) {
    const project = this.db.getProject(projectId)
    if (!project) {
      throw new Error('Project not found')
    }

    this.db.touchProject(projectId)
    const paragraphs = this.db.listParagraphs(projectId)
    return { project, paragraphs }
  }

  private detectSourceType(ext: string): 'epub' | 'pdf' {
    if (ext === '.epub') {
      return SourceTypeSchema.parse('epub')
    }

    if (ext === '.pdf') {
      return SourceTypeSchema.parse('pdf')
    }

    throw new Error(`Unsupported source format: ${ext}`)
  }

  private parseDocument(projectId: string, sourceType: 'epub' | 'pdf', filePath: string): Promise<ParsedDocument> {
    return this.parsers[sourceType].parse(projectId, filePath)
  }
}

