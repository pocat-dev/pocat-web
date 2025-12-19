import { useEditor } from '@/hooks/useEditor'
import { EditorToolbar } from './EditorToolbar'
import { EditorWorkspace } from './EditorWorkspace'
import { EditorTimeline } from './EditorTimeline'

export function EditorPage() {
  const editor = useEditor()

  if (editor.isLoading) {
    return (
      <div className="editor-container">
        <div className="editor-loading">
          <i className="fa-solid fa-spinner fa-spin" />
          <p>Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="editor-container">
      <EditorToolbar editor={editor} />
      <EditorWorkspace editor={editor} />
      <EditorTimeline editor={editor} />
    </div>
  )
}
