import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { commonmarkLanguage, markdown, markdownKeymap } from '@codemirror/lang-markdown'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { GFM } from '@lezer/markdown'
import { insertLink, toggleWrap } from './commands'
import { livePreview } from './livePreview'

// The story editor: CodeMirror 6 with Markdown (CommonMark + GFM, the same dialect remark-gfm saves) and the live
// preview. Loaded only when a story field mounts. Each language gets its own state, so undo never crosses languages.
// See docs/portfolio.md#story-editor

export * from './commands'
export { EditorView }

type StateOptions = {
  doc: string
  dir: 'ltr' | 'rtl'
  lang: string
  placeholder: string
  /** The field's label and message, for screen readers. */
  labelledBy: string
  describedBy?: string
  onChange: (doc: string) => void
}

export function createState(options: StateOptions) {
  return EditorState.create({
    doc: options.doc,
    extensions: [
      history(),
      markdown({ base: commonmarkLanguage, extensions: GFM }),
      livePreview,
      EditorView.lineWrapping,
      EditorView.perLineTextDirection.of(true),
      placeholder(options.placeholder),
      EditorView.contentAttributes.of({
        dir: options.dir,
        lang: options.lang,
        'aria-labelledby': options.labelledBy,
        ...(options.describedBy ? { 'aria-describedby': options.describedBy } : {}),
      }),
      keymap.of([
        { key: 'Mod-b', run: (view) => (toggleWrap(view, '**'), true) },
        { key: 'Mod-i', run: (view) => (toggleWrap(view, '_'), true) },
        { key: 'Mod-k', run: (view) => (insertLink(view), true) },
        ...markdownKeymap,
        ...historyKeymap,
        ...defaultKeymap,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) options.onChange(update.state.doc.toString())
      }),
    ],
  })
}

/** Brings the editor in line with a value changed from outside (Discard), as one undoable edit. */
export function syncDoc(view: EditorView, doc: string) {
  if (view.state.doc.toString() === doc) return
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: doc } })
}
