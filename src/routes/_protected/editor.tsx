import { createFileRoute } from '@tanstack/react-router'
import { EditorPage } from '@/components/editor/EditorPage'

export const Route = createFileRoute('/_protected/editor')({
  component: EditorPage,
})
