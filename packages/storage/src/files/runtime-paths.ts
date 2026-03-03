import fs from 'node:fs'
import path from 'node:path'

export type RuntimePaths = {
  root: string
  dbPath: string
  logsDir: string
  projectsDir: string
}

export function buildRuntimePaths(root: string): RuntimePaths {
  return {
    root,
    dbPath: path.join(root, 'app.db'),
    logsDir: path.join(root, 'logs'),
    projectsDir: path.join(root, 'projects')
  }
}

export function ensureRuntimePaths(paths: RuntimePaths): void {
  fs.mkdirSync(paths.root, { recursive: true })
  fs.mkdirSync(paths.logsDir, { recursive: true })
  fs.mkdirSync(paths.projectsDir, { recursive: true })
}

export function projectPaths(root: string, projectId: string) {
  const projectRoot = path.join(root, projectId)
  const paths = {
    root: projectRoot,
    sourceDir: path.join(projectRoot, 'source'),
    extractedDir: path.join(projectRoot, 'extracted'),
    translationDir: path.join(projectRoot, 'translation'),
    runsDir: path.join(projectRoot, 'translation', 'runs'),
    glossaryDir: path.join(projectRoot, 'glossary'),
    exportsDir: path.join(projectRoot, 'exports'),
    tempDir: path.join(projectRoot, 'temp'),
    crashDir: path.join(projectRoot, 'crash')
  }

  Object.values(paths).forEach((entry) => fs.mkdirSync(entry, { recursive: true }))
  return paths
}
