import type { Dispatch, SetStateAction } from 'react'
import { Download, FolderOpen } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import type { ExportProfile } from '@mtn/shared'
import type { AppText } from '../../../app/types'

interface ExportPanelProps {
  exportDestinationPath: string
  exportProfile: ExportProfile
  isExporting: boolean
  onExportWithCustomization: () => void | Promise<void>
  onPickExportDestination: () => void | Promise<void>
  onSetExportProfile: Dispatch<SetStateAction<ExportProfile>>
  text: AppText
}

export function ExportPanel({
  exportDestinationPath,
  exportProfile,
  isExporting,
  onExportWithCustomization,
  onPickExportDestination,
  onSetExportProfile,
  text
}: ExportPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{text.export}</h3>

      {/* Format seçici */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">{text.format}</label>
        <Select
          value={exportProfile.outputFormat}
          onValueChange={(v) => onSetExportProfile((prev) => ({ ...prev, outputFormat: v as 'epub' | 'pdf' }))}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="epub" className="text-xs">EPUB</SelectItem>
            <SelectItem value="pdf" className="text-xs">PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Layout seçici */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">{text.layout}</label>
        <Select
          value={exportProfile.layout}
          onValueChange={(v) => onSetExportProfile((prev) => ({ ...prev, layout: v as ExportProfile['layout'] }))}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single" className="text-xs">{text.layoutSingle}</SelectItem>
            <SelectItem value="bilingual-stacked" className="text-xs">{text.layoutBilingualStacked}</SelectItem>
            <SelectItem value="bilingual-sidebyside" className="text-xs">{text.layoutBilingualSideBySide}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Çıktı konumu */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">{text.chooseLocation}</label>
        <div className="flex gap-1">
          <Input
            className="h-8 flex-1 text-xs"
            readOnly
            value={exportDestinationPath}
            placeholder={text.noExportLocation}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 shrink-0 p-0"
            onClick={() => void onPickExportDestination()}
            title={text.chooseLocation}
          >
            <FolderOpen className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Dışa aktar butonu */}
      <Button
        size="sm"
        className="h-8 gap-1.5 text-xs"
        disabled={isExporting || !exportDestinationPath}
        onClick={() => void onExportWithCustomization()}
      >
        <Download className="h-3.5 w-3.5" />
        {isExporting ? text.exporting : text.exportNow}
      </Button>
    </div>
  )
}
