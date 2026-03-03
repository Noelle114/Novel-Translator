export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS provider_settings (
  provider_id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS credential_refs (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS source_metadata (
  project_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  idx INTEGER NOT NULL,
  data TEXT NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  idx INTEGER NOT NULL,
  project_id TEXT NOT NULL,
  data TEXT NOT NULL,
  FOREIGN KEY(chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paragraphs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  idx INTEGER NOT NULL,
  state TEXT NOT NULL,
  is_locked INTEGER NOT NULL,
  is_skipped INTEGER NOT NULL,
  issue_flag INTEGER NOT NULL,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY(section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_paragraphs_project_idx ON paragraphs(project_id, idx);
CREATE INDEX IF NOT EXISTS idx_paragraphs_section_idx ON paragraphs(section_id, idx);

CREATE TABLE IF NOT EXISTS translation_runs (
  run_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  data TEXT NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS errors (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  data TEXT NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glossary_global (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS glossary_project (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  data TEXT NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS export_profiles (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS job_lock (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  project_id TEXT,
  run_id TEXT,
  state TEXT,
  updated_at TEXT
);
`
