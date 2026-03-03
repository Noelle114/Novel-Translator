import fs from 'node:fs'
import path from 'node:path'
import pino from 'pino'

function todaysLogFile(logsDir: string): string {
  const date = new Date().toISOString().slice(0, 10)
  return path.join(logsDir, `app-${date}.log`)
}

export function createLogger(logsDir: string) {
  fs.mkdirSync(logsDir, { recursive: true })
  const destination = pino.destination({
    dest: todaysLogFile(logsDir),
    sync: false,
    mkdir: true
  })

  return pino({ level: 'info' }, destination)
}
