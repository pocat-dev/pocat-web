import { ClipsPanel } from './ClipsPanel'
import { VideoPreview } from './VideoPreview'
import { PropertiesPanel } from './PropertiesPanel'

interface EditorWorkspaceProps {
  editor: any // TODO: Type this properly
}

export function EditorWorkspace({ editor }: EditorWorkspaceProps) {
  return (
    <div className="editor-main">
      <ClipsPanel editor={editor} />
      <VideoPreview editor={editor} />
      <PropertiesPanel editor={editor} />
    </div>
  )
}
