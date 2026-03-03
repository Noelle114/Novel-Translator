import path from 'node:path'
import {
  EpubExporter,
  PdfExporter,
  type IExporter
} from '@mtn/adapters'
import {
  ExportProfileSchema,
  type ExportProfile,
  type ProjectMetadata,
  type SourceDocumentMetadata
} from '@mtn/shared'
import { AppDatabase, projectPaths } from '@mtn/storage'

export class ExportService {
  private readonly exporters: Record<'epub' | 'pdf', IExporter>

  constructor(
    private readonly db: AppDatabase,
    private readonly projectsRootDir: string
  ) {
    this.exporters = {
      epub: new EpubExporter(),
      pdf: new PdfExporter()
    }
  }

  getDefaultProfile(projectId: string, format: 'epub' | 'pdf'): ExportProfile {
    return ExportProfileSchema.parse({
      id: crypto.randomUUID(),
      projectId,
      name: `Default ${format.toUpperCase()}`,
      outputFormat: format,
      layout: 'single',
      fontFamily: 'Literata',
      fontSize: 12,
      textColor: '#1b1f23',
      backgroundColor: '#ffffff',
      paragraphSpacing: 8,
      margins: {
        top: 36,
        right: 36,
        bottom: 36,
        left: 36
      },
      headingStyles: {},
      tocOptions: {},
      includeImages: true,
      includeMetadata: true,
      createdAt: new Date().toISOString()
    })
  }

  async start(projectId: string, exportProfileId: string, outputPathOverride?: string): Promise<string> {
    const project = this.mustGetProject(projectId)
    const sourceMetadata = this.mustGetSourceMetadata(projectId)
    const paragraphs = this.db.listParagraphs(projectId)

    let profile = this.db.getExportProfile(exportProfileId)
    if (!profile) {
      profile = this.getDefaultProfile(projectId, 'epub')
      this.db.upsertExportProfile(profile)
    }

    const exporter = this.exporters[profile.outputFormat]
    const projectDir = projectPaths(this.projectsRootDir, projectId)
    const outputPath =
      outputPathOverride ||
      path.join(
        projectDir.exportsDir,
        `${new Date().toISOString().replaceAll(':', '-')}-${project.name}.${profile.outputFormat}`
      )

    return exporter.export({
      project,
      sourceMetadata,
      paragraphs,
      profile,
      outputPath
    })
  }

  private mustGetProject(projectId: string): ProjectMetadata {
    const project = this.db.getProject(projectId)
    if (!project) {
      throw new Error('Project not found')
    }
    return project
  }

  private mustGetSourceMetadata(projectId: string): SourceDocumentMetadata {
    const sourceMeta = this.db.getSourceMetadata(projectId)
    if (!sourceMeta) {
      throw new Error('Source metadata not found')
    }
    return sourceMeta
  }
}

