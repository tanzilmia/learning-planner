'use client'

import { EditorContent, useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'

import { useEffect } from 'react'

export function TextNoteEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {

  const editor = useEditor({

    extensions: [StarterKit],

    content: value,

    immediatelyRender: false,

    editorProps: {

      attributes: {

        class:

          'min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',

      },

    },

    onUpdate: ({ editor }) => onChange(editor.getHTML()),

  })

  useEffect(() => {

    if (!editor) return

    const current = editor.getHTML()

    if (value && value !== current) editor.commands.setContent(value)

  }, [editor, value])

  if (!editor) return <div className="text-sm text-muted-foreground">এডিটর লোড হচ্ছে...</div>

  return <EditorContent editor={editor} />

}
