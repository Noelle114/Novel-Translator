import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import {
  AppSettingsSchema,
  DEFAULT_APP_SETTINGS,
  ErrorStateSchema,
  ExportProfileSchema,
  GlossaryEntrySchema,
  ParagraphSchema,
  ProjectGlossaryEntrySchema,
  ProjectMetadataSchema,
  ProviderSettingsSchema,
  SavedCredentialRefSchema,
  SourceDocumentMetadataSchema,
  TechnicalSettingsSchema,
  TranslationStateSchema,
  type AppSettings,
  type ErrorState,
  type ExportProfile,
  type GlossaryEntry,
  type Paragraph,
  type ProjectGlossaryEntry,
  type ProjectMetadata,
  type ProviderSettings,
  type SavedCredentialRef,
  type SourceDocumentMetadata,
  type TranslationState
} from '@mtn/shared'
import { SCHEMA_SQL } from './schema.js'

function nowIso(): string {
  return new Date().toISOString()
}

function toJson(data: unknown): string {
  return JSON.stringify(data)
}

function fromJson<T>(raw: string): T {
  return JSON.parse(raw) as T
}

export class AppDatabase {
  private readonly db: Database.Database

  constructor(dbPath: string) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('foreign_keys = ON')
    this.db.exec(SCHEMA_SQL)
    this.bootstrapDefaults()
  }

  close(): void {
    this.db.close()
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)()
  }

  private bootstrapDefaults(): void {
    const row = this.db.prepare('SELECT id FROM app_settings WHERE id = ?').get('app-settings')
    if (!row) {
      const seed = {
        ...DEFAULT_APP_SETTINGS,
        createdAt: nowIso(),
        updatedAt: nowIso()
      }
      this.db
        .prepare('INSERT INTO app_settings (id, data) VALUES (?, ?)')
        .run(seed.id, toJson(seed))
    }
  }

  getAppSettings(): AppSettings {
    const row = this.db.prepare('SELECT data FROM app_settings WHERE id = ?').get('app-settings') as { data: string } | undefined
    if (!row) {
      return DEFAULT_APP_SETTINGS
    }

    return AppSettingsSchema.parse(fromJson<AppSettings>(row.data))
  }

  updateTechnicalSettings(technicalDefaults: unknown): AppSettings {
    const safe = TechnicalSettingsSchema.parse(technicalDefaults)
    const current = this.getAppSettings()
    const next = AppSettingsSchema.parse({
      ...current,
      technicalDefaults: safe,
      updatedAt: nowIso()
    })

    this.db
      .prepare('UPDATE app_settings SET data = ? WHERE id = ?')
      .run(toJson(next), 'app-settings')

    return next
  }

  listProviderSettings(): ProviderSettings[] {
    const rows = this.db.prepare('SELECT data FROM provider_settings').all() as Array<{ data: string }>
    return rows.map((row) => ProviderSettingsSchema.parse(fromJson<ProviderSettings>(row.data)))
  }

  upsertProviderSettings(settings: unknown): ProviderSettings {
    const safe = ProviderSettingsSchema.parse(settings)
    this.db
      .prepare(`INSERT INTO provider_settings (provider_id, data) VALUES (?, ?)
      ON CONFLICT(provider_id) DO UPDATE SET data = excluded.data`)
      .run(safe.providerId, toJson(safe))
    return safe
  }

  getProviderSetting(providerId: ProviderSettings['providerId']): ProviderSettings | null {
    const row = this.db.prepare('SELECT data FROM provider_settings WHERE provider_id = ?').get(providerId) as
      | { data: string }
      | undefined

    if (!row) {
      return null
    }

    return ProviderSettingsSchema.parse(fromJson<ProviderSettings>(row.data))
  }

  upsertCredentialRef(input: unknown): SavedCredentialRef {
    const safe = SavedCredentialRefSchema.parse(input)
    this.db
      .prepare(`INSERT INTO credential_refs (id, provider_id, data) VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data, provider_id = excluded.provider_id`)
      .run(safe.id, safe.providerId, toJson(safe))
    return safe
  }

  getCredentialRef(id: string): SavedCredentialRef | null {
    const row = this.db.prepare('SELECT data FROM credential_refs WHERE id = ?').get(id) as { data: string } | undefined
    if (!row) {
      return null
    }
    return SavedCredentialRefSchema.parse(fromJson<SavedCredentialRef>(row.data))
  }

  deleteCredentialRef(id: string): void {
    this.db.prepare('DELETE FROM credential_refs WHERE id = ?').run(id)
  }

  createProject(
    project: unknown,
    sourceMetadata: unknown,
    chapters: unknown[],
    sections: unknown[],
    paragraphs: unknown[]
  ): ProjectMetadata {
    const safeProject = ProjectMetadataSchema.parse(project)
    const safeSource = SourceDocumentMetadataSchema.parse(sourceMetadata)
    const safeParagraphs = paragraphs.map((item) => ParagraphSchema.parse(item))

    this.transaction(() => {
      this.db.prepare('INSERT INTO projects (id, data) VALUES (?, ?)').run(safeProject.id, toJson(safeProject))
      this.db.prepare('INSERT INTO source_metadata (project_id, data) VALUES (?, ?)').run(safeProject.id, toJson(safeSource))

      const chapterStmt = this.db.prepare('INSERT INTO chapters (id, project_id, idx, data) VALUES (?, ?, ?, ?)')
      for (const chapter of chapters) {
        const safe = fromJson<Record<string, unknown>>(toJson(chapter))
        chapterStmt.run((safe.id as string), safeProject.id, Number(safe.index ?? 0), toJson(safe))
      }

      const sectionStmt = this.db.prepare('INSERT INTO sections (id, chapter_id, project_id, idx, data) VALUES (?, ?, ?, ?, ?)')
      for (const section of sections) {
        const safe = fromJson<Record<string, unknown>>(toJson(section))
        sectionStmt.run((safe.id as string), (safe.chapterId as string), safeProject.id, Number(safe.index ?? 0), toJson(safe))
      }

      const paraStmt = this.db.prepare(`
        INSERT INTO paragraphs
        (id, project_id, section_id, idx, state, is_locked, is_skipped, issue_flag, data, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      for (const paragraph of safeParagraphs) {
        paraStmt.run(
          paragraph.id,
          paragraph.projectId,
          paragraph.sectionId,
          paragraph.index,
          paragraph.state,
          paragraph.isLocked ? 1 : 0,
          paragraph.isSkipped ? 1 : 0,
          paragraph.issueFlag ? 1 : 0,
          toJson(paragraph),
          paragraph.updatedAt
        )
      }
    })

    return safeProject
  }

  listProjects(): ProjectMetadata[] {
    const rows = this.db
      .prepare("SELECT data FROM projects ORDER BY json_extract(data, '$.updatedAt') DESC")
      .all() as Array<{ data: string }>
    return rows.map((row) => ProjectMetadataSchema.parse(fromJson<ProjectMetadata>(row.data)))
  }

  getProject(projectId: string): ProjectMetadata | null {
    const row = this.db.prepare('SELECT data FROM projects WHERE id = ?').get(projectId) as { data: string } | undefined
    if (!row) {
      return null
    }

    return ProjectMetadataSchema.parse(fromJson<ProjectMetadata>(row.data))
  }

  deleteProject(projectId: string): void {
    this.transaction(() => {
      this.db.prepare('DELETE FROM export_profiles WHERE project_id = ?').run(projectId)
      this.db.prepare('DELETE FROM projects WHERE id = ?').run(projectId)
    })
  }

  getSourceMetadata(projectId: string): SourceDocumentMetadata | null {
    const row = this.db.prepare('SELECT data FROM source_metadata WHERE project_id = ?').get(projectId) as
      | { data: string }
      | undefined

    if (!row) {
      return null
    }

    return SourceDocumentMetadataSchema.parse(fromJson<SourceDocumentMetadata>(row.data))
  }

  touchProject(projectId: string): void {
    const project = this.getProject(projectId)
    if (!project) {
      return
    }

    const updated = ProjectMetadataSchema.parse({
      ...project,
      updatedAt: nowIso(),
      lastOpenedAt: nowIso()
    })

    this.db.prepare('UPDATE projects SET data = ? WHERE id = ?').run(toJson(updated), projectId)
  }

  listParagraphs(projectId: string, sectionId?: string): Paragraph[] {
    const rows = sectionId
      ? this.db
          .prepare('SELECT data FROM paragraphs WHERE project_id = ? AND section_id = ? ORDER BY idx ASC')
          .all(projectId, sectionId)
      : this.db
          .prepare('SELECT data FROM paragraphs WHERE project_id = ? ORDER BY idx ASC')
          .all(projectId)

    return (rows as Array<{ data: string }>).map((row) => ParagraphSchema.parse(fromJson<Paragraph>(row.data)))
  }

  getParagraph(projectId: string, paragraphId: string): Paragraph | null {
    const row = this.db
      .prepare('SELECT data FROM paragraphs WHERE project_id = ? AND id = ?')
      .get(projectId, paragraphId) as { data: string } | undefined
    if (!row) {
      return null
    }
    return ParagraphSchema.parse(fromJson<Paragraph>(row.data))
  }

  updateParagraph(projectId: string, paragraphId: string, patch: Partial<Paragraph>): Paragraph {
    const current = this.getParagraph(projectId, paragraphId)
    if (!current) {
      throw new Error('Paragraph not found')
    }

    const next = ParagraphSchema.parse({
      ...current,
      ...patch,
      revision: current.revision + 1,
      updatedAt: nowIso()
    })

    this.db
      .prepare(`
        UPDATE paragraphs
        SET state = ?, is_locked = ?, is_skipped = ?, issue_flag = ?, data = ?, updated_at = ?
        WHERE project_id = ? AND id = ?
      `)
      .run(
        next.state,
        next.isLocked ? 1 : 0,
        next.isSkipped ? 1 : 0,
        next.issueFlag ? 1 : 0,
        toJson(next),
        next.updatedAt,
        projectId,
        paragraphId
      )

    this.touchProject(projectId)
    return next
  }

  splitParagraph(projectId: string, paragraphId: string, splitIndex: number): [Paragraph, Paragraph] {
    const current = this.getParagraph(projectId, paragraphId)
    if (!current) {
      throw new Error('Paragraph not found')
    }

    if (splitIndex <= 0 || splitIndex >= current.sourceText.length) {
      throw new Error('Invalid split index')
    }

    const sourceLeft = current.sourceText.slice(0, splitIndex).trim()
    const sourceRight = current.sourceText.slice(splitIndex).trim()

    if (!sourceLeft || !sourceRight) {
      throw new Error('Split produced empty paragraph')
    }

    const rightId = crypto.randomUUID()
    const left: Paragraph = ParagraphSchema.parse({
      ...current,
      sourceText: sourceLeft,
      translationText: current.translationText,
      updatedAt: nowIso(),
      revision: current.revision + 1
    })

    const right: Paragraph = ParagraphSchema.parse({
      ...current,
      id: rightId,
      sourceText: sourceRight,
      translationText: '',
      state: 'pending',
      index: current.index + 1,
      lineageParentId: current.id,
      revision: 0,
      updatedAt: nowIso()
    })

    this.transaction(() => {
      this.db
        .prepare('UPDATE paragraphs SET idx = idx + 1 WHERE project_id = ? AND section_id = ? AND idx > ?')
        .run(projectId, current.sectionId, current.index)

      this.db
        .prepare('UPDATE paragraphs SET state = ?, is_locked = ?, is_skipped = ?, issue_flag = ?, data = ?, updated_at = ? WHERE project_id = ? AND id = ?')
        .run(left.state, left.isLocked ? 1 : 0, left.isSkipped ? 1 : 0, left.issueFlag ? 1 : 0, toJson(left), left.updatedAt, projectId, left.id)

      this.db
        .prepare(`
          INSERT INTO paragraphs
          (id, project_id, section_id, idx, state, is_locked, is_skipped, issue_flag, data, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          right.id,
          right.projectId,
          right.sectionId,
          right.index,
          right.state,
          right.isLocked ? 1 : 0,
          right.isSkipped ? 1 : 0,
          right.issueFlag ? 1 : 0,
          toJson(right),
          right.updatedAt
        )
    })

    this.touchProject(projectId)
    return [left, right]
  }

  mergeParagraphs(projectId: string, firstParagraphId: string, secondParagraphId: string): Paragraph {
    const first = this.getParagraph(projectId, firstParagraphId)
    const second = this.getParagraph(projectId, secondParagraphId)

    if (!first || !second) {
      throw new Error('One of paragraphs not found')
    }

    if (first.sectionId !== second.sectionId) {
      throw new Error('Paragraphs are not in the same section')
    }

    const merged = ParagraphSchema.parse({
      ...first,
      sourceText: `${first.sourceText}\n${second.sourceText}`.trim(),
      translationText: `${first.translationText}\n${second.translationText}`.trim(),
      state: 'edited',
      revision: first.revision + 1,
      updatedAt: nowIso()
    })

    this.transaction(() => {
      this.db
        .prepare('DELETE FROM paragraphs WHERE project_id = ? AND id = ?')
        .run(projectId, secondParagraphId)

      this.db
        .prepare('UPDATE paragraphs SET idx = idx - 1 WHERE project_id = ? AND section_id = ? AND idx > ?')
        .run(projectId, first.sectionId, second.index)

      this.db
        .prepare('UPDATE paragraphs SET state = ?, is_locked = ?, is_skipped = ?, issue_flag = ?, data = ?, updated_at = ? WHERE project_id = ? AND id = ?')
        .run(
          merged.state,
          merged.isLocked ? 1 : 0,
          merged.isSkipped ? 1 : 0,
          merged.issueFlag ? 1 : 0,
          toJson(merged),
          merged.updatedAt,
          projectId,
          firstParagraphId
        )
    })

    this.touchProject(projectId)
    return merged
  }

  setRunState(state: unknown): TranslationState {
    const safe = TranslationStateSchema.parse(state)
    this.db
      .prepare(`INSERT INTO translation_runs (run_id, project_id, data) VALUES (?, ?, ?)
      ON CONFLICT(run_id) DO UPDATE SET data = excluded.data`)
      .run(safe.runId, safe.projectId, toJson(safe))

    return safe
  }

  getLatestRun(projectId: string): TranslationState | null {
    const row = this.db
      .prepare("SELECT data FROM translation_runs WHERE project_id = ? ORDER BY json_extract(data, '$.startedAt') DESC LIMIT 1")
      .get(projectId) as { data: string } | undefined
    if (!row) {
      return null
    }
    return TranslationStateSchema.parse(fromJson<TranslationState>(row.data))
  }

  setJobLock(projectId: string | null, runId: string | null, state: string): void {
    this.db
      .prepare(`INSERT INTO job_lock (id, project_id, run_id, state, updated_at) VALUES (1, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET project_id = excluded.project_id, run_id = excluded.run_id, state = excluded.state, updated_at = excluded.updated_at`)
      .run(projectId, runId, state, nowIso())
  }

  getJobLock(): { projectId: string | null; runId: string | null; state: string | null } {
    const row = this.db.prepare('SELECT project_id, run_id, state FROM job_lock WHERE id = 1').get() as
      | { project_id: string | null; run_id: string | null; state: string | null }
      | undefined

    if (!row) {
      return { projectId: null, runId: null, state: null }
    }

    return {
      projectId: row.project_id,
      runId: row.run_id,
      state: row.state
    }
  }

  addError(input: unknown): ErrorState {
    const safe = ErrorStateSchema.parse(input)
    this.db
      .prepare('INSERT INTO errors (id, project_id, created_at, resolved_at, data) VALUES (?, ?, ?, ?, ?)')
      .run(safe.id, safe.projectId, safe.createdAt, safe.resolvedAt, toJson(safe))
    return safe
  }

  listErrors(projectId: string): ErrorState[] {
    const rows = this.db
      .prepare('SELECT data FROM errors WHERE project_id = ? ORDER BY created_at DESC')
      .all(projectId) as Array<{ data: string }>

    return rows.map((row) => ErrorStateSchema.parse(fromJson<ErrorState>(row.data)))
  }

  resolveError(errorId: string): void {
    const row = this.db.prepare('SELECT data FROM errors WHERE id = ?').get(errorId) as { data: string } | undefined
    if (!row) {
      return
    }

    const current = ErrorStateSchema.parse(fromJson<ErrorState>(row.data))
    const next = ErrorStateSchema.parse({
      ...current,
      resolvedAt: nowIso()
    })

    this.db
      .prepare('UPDATE errors SET resolved_at = ?, data = ? WHERE id = ?')
      .run(next.resolvedAt, toJson(next), errorId)
  }

  deleteError(errorId: string): void {
    this.db.prepare('DELETE FROM errors WHERE id = ?').run(errorId)
  }

  listGlobalGlossary(): GlossaryEntry[] {
    const rows = this.db.prepare('SELECT data FROM glossary_global').all() as Array<{ data: string }>
    return rows.map((row) => GlossaryEntrySchema.parse(fromJson(row.data)))
  }

  listProjectGlossary(projectId: string): ProjectGlossaryEntry[] {
    const rows = this.db
      .prepare('SELECT data FROM glossary_project WHERE project_id = ?')
      .all(projectId) as Array<{ data: string }>
    return rows.map((row) => ProjectGlossaryEntrySchema.parse(fromJson(row.data)))
  }

  upsertProjectGlossary(entry: unknown): ProjectGlossaryEntry {
    const safe = ProjectGlossaryEntrySchema.parse(entry)
    this.db
      .prepare(`INSERT INTO glossary_project (id, project_id, data) VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data, project_id = excluded.project_id`)
      .run(safe.id, safe.projectId, toJson(safe))
    return safe
  }

  listExportProfiles(projectId?: string): ExportProfile[] {
    const rows = projectId
      ? this.db.prepare('SELECT data FROM export_profiles WHERE project_id = ? OR project_id IS NULL').all(projectId)
      : this.db.prepare('SELECT data FROM export_profiles').all()

    return (rows as Array<{ data: string }>).map((row) => ExportProfileSchema.parse(fromJson<ExportProfile>(row.data)))
  }

  getExportProfile(id: string): ExportProfile | null {
    const row = this.db.prepare('SELECT data FROM export_profiles WHERE id = ?').get(id) as { data: string } | undefined
    if (!row) {
      return null
    }

    return ExportProfileSchema.parse(fromJson<ExportProfile>(row.data))
  }

  upsertExportProfile(input: unknown): ExportProfile {
    const safe = ExportProfileSchema.parse(input)
    this.db
      .prepare(`INSERT INTO export_profiles (id, project_id, data) VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data, project_id = excluded.project_id`)
      .run(safe.id, safe.projectId, toJson(safe))
    return safe
  }
}

