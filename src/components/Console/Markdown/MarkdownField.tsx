'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { EditorState } from '@codemirror/state'
import {
  Bold,
  CircleAlert,
  Code,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  LoaderCircle,
  Quote,
  SeparatorHorizontal,
  SquareCode,
  Strikethrough,
  Table,
  type LucideIcon,
} from 'lucide-react'
import { useLocale, useTranslations, type Locale } from 'next-intl'
import { LocaleSwitch } from '@/components/ui/LocaleSwitch'
import type { LocalizedValue } from '@/components/ui/LocalizedField'
import { localeDirection } from '@/i18n/routing'
import type { UploadFolder } from '@/lib/storage/actions'
import { acceptedImageTypes, uploadImage, type UploadError } from '@/lib/storage/upload'
import { cn } from '@/utils'

// A multi-language Markdown field with Obsidian-style live preview: the text is styled as the case study sets it, and
// the Markdown shows only where the caret is. The editor (CodeMirror) loads when the field mounts.
// See docs/portfolio.md#story-editor

type EditorModule = typeof import('./editor')
type EditorView = InstanceType<EditorModule['EditorView']>

type MarkdownFieldProps = {
  id: string
  label: string
  value: LocalizedValue
  onChange: (value: LocalizedValue) => void
  /** Where images inserted from the toolbar are uploaded. */
  uploadFolder: UploadFolder
  maxLength?: number
  hint?: ReactNode
  errors?: Partial<Record<Locale, string>>
}

type ToolName =
  | 'heading'
  | 'subheading'
  | 'bold'
  | 'italic'
  | 'strike'
  | 'code'
  | 'link'
  | 'bullets'
  | 'numbers'
  | 'tasks'
  | 'quote'
  | 'codeBlock'
  | 'table'
  | 'rule'

type Tool = { key: ToolName; icon: LucideIcon; run: (editor: EditorModule, view: EditorView) => void; shortcut?: string }

const toolGroups: Tool[][] = [
  [
    { key: 'heading', icon: Heading1, run: (e, v) => e.toggleLinePrefix(v, '# ') },
    { key: 'subheading', icon: Heading2, run: (e, v) => e.toggleLinePrefix(v, '## ') },
  ],
  [
    { key: 'bold', icon: Bold, run: (e, v) => e.toggleWrap(v, '**'), shortcut: 'Ctrl+B' },
    { key: 'italic', icon: Italic, run: (e, v) => e.toggleWrap(v, '_'), shortcut: 'Ctrl+I' },
    { key: 'strike', icon: Strikethrough, run: (e, v) => e.toggleWrap(v, '~~') },
    { key: 'code', icon: Code, run: (e, v) => e.toggleWrap(v, '`') },
    { key: 'link', icon: Link2, run: (e, v) => e.insertLink(v), shortcut: 'Ctrl+K' },
  ],
  [
    { key: 'bullets', icon: List, run: (e, v) => e.toggleLinePrefix(v, '- ') },
    { key: 'numbers', icon: ListOrdered, run: (e, v) => e.toggleLinePrefix(v, '1. ') },
    { key: 'tasks', icon: ListTodo, run: (e, v) => e.toggleLinePrefix(v, '- [ ] ') },
    { key: 'quote', icon: Quote, run: (e, v) => e.toggleLinePrefix(v, '> ') },
  ],
  [
    { key: 'codeBlock', icon: SquareCode, run: (e, v) => e.insertCodeBlock(v) },
    {
      key: 'table',
      icon: Table,
      run: (e, v) => e.insertBlock(v, '| Column | Column |\n| --- | --- |\n| Cell | Cell |', 'Column'),
    },
    { key: 'rule', icon: SeparatorHorizontal, run: (e, v) => e.insertBlock(v, '---') },
  ],
]

const toolClasses =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink disabled:opacity-45'

export function MarkdownField({ id, label, value, onChange, uploadFolder, maxLength, hint, errors = {} }: MarkdownFieldProps) {
  const t = useTranslations('Console.markdown')
  const tUpload = useTranslations('Console.upload')
  const tField = useTranslations('LocalizedField')
  const pageLocale = useLocale()
  const [active, setActive] = useState<Locale>(pageLocale)
  const [ready, setReady] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<UploadError | null>(null)
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const editor = useRef<EditorModule | null>(null)
  const states = useRef(new Map<Locale, EditorState>())
  const latest = useRef({ value, onChange })
  const fileInput = useRef<HTMLInputElement>(null)
  const labelId = useId()
  const messageId = `${id}-message`

  const others = (Object.keys(value) as Locale[]).filter((locale) => locale !== active)
  const activeError = errors[active]
  const otherError = others.find((locale) => errors[locale])
  const message = uploadError
    ? tUpload(`errors.${uploadError}`)
    : (activeError ?? (otherError ? tField('otherError', { language: tField(`names.${otherError}`), error: errors[otherError]! }) : undefined))
  const length = value[active].length

  useEffect(() => {
    latest.current = { value, onChange }
  })

  const stateFor = (codemirror: EditorModule, locale: Locale) =>
    codemirror.createState({
      doc: latest.current.value[locale],
      dir: localeDirection[locale],
      lang: locale,
      placeholder: t('placeholder'),
      labelledBy: labelId,
      describedBy: messageId,
      onChange: (doc) => latest.current.onChange({ ...latest.current.value, [locale]: doc }),
    })

  // Loads CodeMirror once and mounts the editor on the page's language.
  useEffect(() => {
    let cancelled = false
    void import('./editor').then((codemirror) => {
      if (cancelled || !host.current) return
      editor.current = codemirror
      view.current = new codemirror.EditorView({ parent: host.current, state: stateFor(codemirror, active) })
      setReady(true)
    })
    return () => {
      cancelled = true
      view.current?.destroy()
      view.current = null
    }
    // Mount once; switching languages swaps the state instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A value changed from outside the editor (Discard) is copied in.
  useEffect(() => {
    if (view.current && editor.current) editor.current.syncDoc(view.current, value[active])
  }, [value, active])

  const switchTo = (locale: Locale) => {
    const current = view.current
    const codemirror = editor.current
    setActive(locale)
    if (!current || !codemirror) return
    states.current.set(active, current.state)
    const saved = states.current.get(locale)
    current.setState(saved && saved.doc.toString() === value[locale] ? saved : stateFor(codemirror, locale))
    requestAnimationFrame(() => current.focus())
  }

  const run = (tool: Tool) => {
    if (view.current && editor.current) tool.run(editor.current, view.current)
  }

  const insertImage = async (file: File) => {
    setUploadError(null)
    setUploading(true)
    const result = await uploadImage(file, uploadFolder)
    setUploading(false)
    if (fileInput.current) fileInput.current.value = ''
    if (!result.ok) return setUploadError(result.error)
    if (view.current && editor.current) editor.current.insertImage(view.current, result.image.url, t('imageAlt'))
  }

  return (
    <div className="grid content-start gap-space-2">
      <span id={labelId} className="text-label text-ink">
        {label}
      </span>

      <div
        className={cn(
          'overflow-hidden rounded-md border border-line-strong bg-surface shadow-sm transition-colors',
          'hover:border-ink-muted focus-within:border-primary',
          (activeError || otherError || uploadError) && 'border-danger ring-1 ring-danger hover:border-danger',
        )}
      >
        <div
          role="toolbar"
          aria-label={t('toolbar')}
          aria-controls={id}
          className="flex flex-wrap items-center gap-y-space-1 border-b border-line px-space-2 py-space-1"
        >
          {toolGroups.map((group, index) => (
            <div key={index} className="flex items-center gap-0.5 border-e border-line pe-space-1 me-space-1">
              {group.map((tool) => {
                const name = t(`tools.${tool.key}`)
                const title = tool.shortcut ? `${name} (${tool.shortcut})` : name
                return (
                  <button
                    key={tool.key}
                    type="button"
                    disabled={!ready}
                    aria-label={name}
                    title={title}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => run(tool)}
                    className={toolClasses}
                  >
                    <tool.icon aria-hidden size={17} strokeWidth={1.75} />
                  </button>
                )
              })}
            </div>
          ))}

          <button
            type="button"
            disabled={!ready || uploading}
            aria-label={t('tools.image')}
            title={t('tools.image')}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => fileInput.current?.click()}
            className={toolClasses}
          >
            {uploading ? (
              <LoaderCircle aria-hidden size={17} strokeWidth={1.75} className="animate-spin motion-reduce:animate-none" />
            ) : (
              <ImagePlus aria-hidden size={17} strokeWidth={1.75} />
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept={acceptedImageTypes.join(',')}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void insertImage(file)
            }}
          />

          <LocaleSwitch
            active={active}
            onSwitch={switchTo}
            isMissing={(locale) => !value[locale].trim()}
            errors={errors}
            className="ms-auto"
          />
        </div>

        <div ref={host} id={id} className="md-editor" data-ready={ready || undefined} />
      </div>

      <div className="flex items-start gap-space-3">
        <p
          id={messageId}
          className={cn('flex flex-1 items-start gap-space-2 text-small', message ? 'text-danger' : 'text-ink-muted')}
        >
          {message && <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />}
          <span>
            {message ?? hint}
            {!activeError && !uploadError && otherError && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={() => switchTo(otherError)}
                  className="text-label text-primary-ink underline underline-offset-4 hover:no-underline"
                >
                  {tField('switchShort', { language: tField(`names.${otherError}`) })}
                </button>
              </>
            )}
          </span>
        </p>
        {maxLength && (
          <span
            dir="ltr"
            className={cn('shrink-0 font-mono text-code tabular-nums', length > maxLength ? 'text-danger' : 'text-ink-muted')}
          >
            {length.toLocaleString('en-US')} / {maxLength.toLocaleString('en-US')}
          </span>
        )}
      </div>
    </div>
  )
}
