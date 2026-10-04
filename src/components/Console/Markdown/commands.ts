import { EditorSelection, type ChangeSpec } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'

// The toolbar's and shortcuts' edits. Each works on every selection range and leaves the caret where typing goes next.

/** Wraps each selection in `marker` (`**`), or unwraps it when it's already wrapped. An empty selection gets a pair. */
export function toggleWrap(view: EditorView, marker: string) {
  const { state } = view
  const size = marker.length
  view.dispatch(
    state.changeByRange((range) => {
      const before = state.sliceDoc(range.from - size, range.from)
      const after = state.sliceDoc(range.to, range.to + size)
      if (before === marker && after === marker) {
        return {
          changes: [
            { from: range.from - size, to: range.from },
            { from: range.to, to: range.to + size },
          ],
          range: EditorSelection.range(range.from - size, range.to - size),
        }
      }
      return {
        changes: [
          { from: range.from, insert: marker },
          { from: range.to, insert: marker },
        ],
        range: EditorSelection.range(range.from + size, range.to + size),
      }
    }),
  )
  view.focus()
}

const linePrefixes = /^(#{1,6} |> |- \[[ xX]\] |[-*+] |\d+[.)] )/

/**
 * Sets the block marker of every selected line (`# `, `> `, `- `, `1. `, `- [ ] `), replacing the one it had, or
 * removes it when every line already has it. Numbered lists count up.
 */
export function toggleLinePrefix(view: EditorView, prefix: string) {
  const { state } = view
  const lines = new Map<number, { from: number; text: string }>()
  for (const range of state.selection.ranges) {
    for (let n = state.doc.lineAt(range.from).number; n <= state.doc.lineAt(range.to).number; n++) {
      const line = state.doc.line(n)
      lines.set(n, { from: line.from, text: line.text })
    }
  }
  const numbered = prefix === '1. '
  const has = (text: string) => (numbered ? /^\d+[.)] /.test(text) : text.startsWith(prefix))
  const removing = [...lines.values()].every((line) => has(line.text))

  let count = 0
  const changes: ChangeSpec[] = [...lines.values()].map((line) => {
    const current = linePrefixes.exec(line.text)?.[0] ?? ''
    const insert = removing ? '' : numbered ? `${++count}. ` : prefix
    return { from: line.from, to: line.from + current.length, insert }
  })
  view.dispatch({ changes })
  view.focus()
}

/** Inserts `text` as its own block, with a blank line before and after, and selects `select` inside it if given. */
export function insertBlock(view: EditorView, text: string, select?: string) {
  const { state } = view
  const range = state.selection.main
  const line = state.doc.lineAt(range.from)
  const atLineStart = range.from === line.from && line.text.trim() === ''
  const before = atLineStart ? (line.number > 1 && state.doc.line(line.number - 1).text.trim() !== '' ? '\n' : '') : '\n\n'
  const insert = `${before}${text}\n`
  const from = atLineStart ? line.from : range.to
  const start = from + before.length + (select ? text.indexOf(select) : text.length)
  view.dispatch({
    changes: { from, to: atLineStart ? line.to : range.to, insert },
    selection: select ? EditorSelection.range(start, start + select.length) : EditorSelection.cursor(start),
    scrollIntoView: true,
  })
  view.focus()
}

/** A fenced code block around the selection. */
export function insertCodeBlock(view: EditorView) {
  const selected = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
  const body = selected || 'code'
  insertBlock(view, `\`\`\`\n${body}\n\`\`\``, selected ? undefined : body)
}

/** Turns the selection into a link and selects the URL to type over; with nothing selected the caret goes in `[]`. */
export function insertLink(view: EditorView) {
  const { state } = view
  const range = state.selection.main
  const text = state.sliceDoc(range.from, range.to)
  const url = 'https://'
  const insert = `[${text}](${url})`
  view.dispatch({
    changes: { from: range.from, to: range.to, insert },
    selection: text
      ? EditorSelection.range(range.from + text.length + 3, range.from + text.length + 3 + url.length)
      : EditorSelection.cursor(range.from + 1),
  })
  view.focus()
}

/** An image on its own line, with its alt text selected to type over. */
export function insertImage(view: EditorView, url: string, alt: string) {
  insertBlock(view, `![${alt}](${url})`, alt)
}
