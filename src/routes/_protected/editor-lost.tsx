import { createFileRoute } from '@tanstack/react-router'
import { EditorPage } from '@/components/editor-lost/EditorPage'

export const Route = createFileRoute('/_protected/editor-lost')({
  component: EditorPage,
})
