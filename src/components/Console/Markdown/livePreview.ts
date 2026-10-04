import { ensureSyntaxTree, syntaxTree } from '@codemirror/language'
import { StateField, type EditorState, type Range } from '@codemirror/state'
import { Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view'

// Obsidian-style live preview: Markdown is styled in place, the way the case study's `story-prose` sets it, and its
// markers show only where the caret is. Images, rules, checkboxes and tables render as widgets until the caret enters
// them. Styles are `.md-editor` in globals.css. See docs/portfolio.md#story-editor

type SyntaxNode = ReturnType<typeof syntaxTree>['topNode']

const hidden = Decoration.replace({})
const line = (className: string, attributes?: Record<string, string>) => Decoration.line({ class: className, attributes })
const mark = (className: string) => Decoration.mark({ class: className })

/** Puts the caret at the widget's source when it's clicked, so the Markdown opens for editing. */
function editOnClick(dom: HTMLElement, view: EditorView) {
  dom.addEventListener('mousedown', (event) => {
    event.preventDefault()
    view.dispatch({ selection: { anchor: view.posAtDOM(dom) } })
    view.focus()
  })
  return dom
}

class BulletWidget extends WidgetType {
  eq() {
    return true
  }
  toDOM() {
    const dom = document.createElement('span')
    dom.className = 'cm-md-bullet'
    dom.textContent = '•'
    return dom
  }
}

class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) {
    super()
  }
  eq(other: CheckboxWidget) {
    return other.checked === this.checked
  }
  toDOM(view: EditorView) {
    const dom = document.createElement('span')
    dom.className = 'cm-md-checkbox'
    dom.dataset.checked = String(this.checked)
    return editOnClick(dom, view)
  }
}

class RuleWidget extends WidgetType {
  eq() {
    return true
  }
  toDOM(view: EditorView) {
    const dom = document.createElement('span')
    dom.className = 'cm-md-rule'
    return editOnClick(dom, view)
  }
}

class ImageWidget extends WidgetType {
  constructor(
    readonly url: string,
    readonly alt: string,
  ) {
    super()
  }
  eq(other: ImageWidget) {
    return other.url === this.url && other.alt === this.alt
  }
  toDOM(view: EditorView) {
    const dom = document.createElement('span')
    dom.className = 'cm-md-image'
    const image = document.createElement('img')
    image.src = this.url
    image.alt = this.alt
    image.loading = 'lazy'
    image.onerror = () => dom.setAttribute('data-broken', this.alt || this.url)
    dom.append(image)
    return editOnClick(dom, view)
  }
}

/** Splits a table row on its unescaped pipes. */
function cells(row: string) {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, '|'))
}

/** Inline Markdown inside a table cell, reduced to its text. */
const plain = (text: string) => text.replace(/(\*\*|__|~~|[*_`])(.+?)\1/g, '$2').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')

class TableWidget extends WidgetType {
  constructor(readonly source: string) {
    super()
  }
  eq(other: TableWidget) {
    return other.source === this.source
  }
  toDOM(view: EditorView) {
    const [header = '', delimiter = '', ...rows] = this.source.split('\n')
    const align = cells(delimiter).map((cell) =>
      cell.startsWith(':') && cell.endsWith(':') ? 'center' : cell.endsWith(':') ? 'end' : 'start',
    )
    const wrap = document.createElement('div')
    wrap.className = 'cm-md-table'
    const table = document.createElement('table')
    const addRow = (parent: HTMLElement, values: string[], tag: 'th' | 'td') => {
      const tr = document.createElement('tr')
      align.forEach((textAlign, index) => {
        const cell = document.createElement(tag)
        cell.style.textAlign = textAlign
        cell.textContent = plain(values[index] ?? '')
        tr.append(cell)
      })
      parent.append(tr)
    }
    const head = document.createElement('thead')
    addRow(head, cells(header), 'th')
    const body = document.createElement('tbody')
    rows.forEach((row) => addRow(body, cells(row), 'td'))
    table.append(head, body)
    wrap.append(table)
    return editOnClick(wrap, view)
  }
}

function buildDecorations(state: EditorState): DecorationSet {
  const tree = ensureSyntaxTree(state, state.doc.length, 200) ?? syntaxTree(state)
  const { doc, selection } = state
  const decorations: Range<Decoration>[] = []

  const activeLines = new Set<number>()
  for (const range of selection.ranges) {
    for (let n = doc.lineAt(range.from).number; n <= doc.lineAt(range.to).number; n++) activeLines.add(n)
  }
  const onActiveLine = (pos: number) => activeLines.has(doc.lineAt(pos).number)
  const touches = (node: { from: number; to: number }) =>
    selection.ranges.some((range) => range.from <= node.to && range.to >= node.from)
  const eachLine = (node: { from: number; to: number }, run: (start: number, index: number, last: boolean) => void) => {
    const first = doc.lineAt(node.from).number
    const last = doc.lineAt(node.to).number
    for (let n = first; n <= last; n++) run(doc.line(n).from, n - first, n === last)
  }
  // A marker plus the space after it (`# `, `> `), so the text lines up where the marker was.
  const hideWithSpace = (node: SyntaxNode) => {
    const end = doc.sliceString(node.to, node.to + 1) === ' ' ? node.to + 1 : node.to
    decorations.push(hidden.range(node.from, end))
  }
  const inside = (node: SyntaxNode, name: string) => {
    for (let parent = node.parent; parent; parent = parent.parent) if (parent.name === name) return parent
    return null
  }

  tree.iterate({
    enter(ref) {
      const node = ref.node
      switch (node.name) {
        case 'ATXHeading1':
        case 'SetextHeading1':
          eachLine(node, (start) => decorations.push(line('cm-md-h3').range(start)))
          break
        case 'ATXHeading2':
        case 'ATXHeading3':
        case 'ATXHeading4':
        case 'ATXHeading5':
        case 'ATXHeading6':
        case 'SetextHeading2':
          eachLine(node, (start) => decorations.push(line('cm-md-h4').range(start)))
          break
        case 'HeaderMark':
          if (node.parent?.name.startsWith('Setext')) {
            if (!onActiveLine(node.from)) decorations.push(hidden.range(node.from, node.to))
          } else if (!onActiveLine(node.from)) hideWithSpace(node)
          break
        case 'StrongEmphasis':
          decorations.push(mark('cm-md-strong').range(node.from, node.to))
          break
        case 'Emphasis':
          decorations.push(mark('cm-md-em').range(node.from, node.to))
          break
        case 'Strikethrough':
          decorations.push(mark('cm-md-del').range(node.from, node.to))
          break
        case 'InlineCode':
          decorations.push(mark('cm-md-code').range(node.from, node.to))
          break
        case 'EmphasisMark':
        case 'StrikethroughMark':
          if (node.parent && !touches(node.parent)) decorations.push(hidden.range(node.from, node.to))
          break
        case 'CodeMark':
          if (node.parent?.name === 'InlineCode') {
            if (!touches(node.parent)) decorations.push(hidden.range(node.from, node.to))
          } else if (node.parent && touches(node.parent)) decorations.push(mark('cm-md-fence').range(node.from, node.to))
          else decorations.push(hidden.range(node.from, node.to))
          break
        case 'CodeInfo':
          // The language stays as a quiet label when the fences are hidden.
          decorations.push(mark(node.parent && touches(node.parent) ? 'cm-md-fence' : 'cm-md-lang').range(node.from, node.to))
          break
        case 'FencedCode':
        case 'CodeBlock':
          // Code reads left to right in both languages.
          eachLine(node, (start, index, last) =>
            decorations.push(
              line(['cm-md-code-line', index === 0 && 'cm-md-code-first', last && 'cm-md-code-last'].filter(Boolean).join(' '), {
                dir: 'ltr',
              }).range(start),
            ),
          )
          break
        case 'Blockquote':
          eachLine(node, (start) => decorations.push(line('cm-md-quote').range(start)))
          break
        case 'QuoteMark':
          if (!onActiveLine(node.from)) hideWithSpace(node)
          break
        case 'ListMark': {
          if (onActiveLine(node.from)) {
            decorations.push(mark('cm-md-listmark').range(node.from, node.to))
            break
          }
          const item = node.parent
          const isTask = item?.getChild('Task') !== null
          if (isTask) hideWithSpace(node)
          else if (item?.parent?.name === 'BulletList')
            decorations.push(Decoration.replace({ widget: new BulletWidget() }).range(node.from, node.to))
          else decorations.push(mark('cm-md-listmark').range(node.from, node.to))
          break
        }
        case 'TaskMarker':
          if (!onActiveLine(node.from)) {
            const checked = /x/i.test(doc.sliceString(node.from, node.to))
            decorations.push(Decoration.replace({ widget: new CheckboxWidget(checked) }).range(node.from, node.to))
          }
          break
        case 'Link':
          decorations.push(mark('cm-md-link').range(node.from, node.to))
          if (!touches(node)) {
            for (let child = node.firstChild; child; child = child.nextSibling) {
              if (child.name === 'LinkMark' || child.name === 'URL' || child.name === 'LinkTitle') {
                // Everything from `](` to the closing `)` goes; the opening `[` too.
                const end = child.name === 'LinkMark' && doc.sliceString(child.from, child.to) === '[' ? child.to : node.to
                decorations.push(hidden.range(child.from, end))
                if (end === node.to) break
              }
            }
          }
          return false
        case 'Image': {
          if (touches(node)) {
            decorations.push(mark('cm-md-link').range(node.from, node.to))
            return false
          }
          const url = node.getChild('URL')
          const source = doc.sliceString(node.from, node.to)
          const alt = /^!\[([^\]]*)\]/.exec(source)?.[1] ?? ''
          if (url) {
            decorations.push(
              Decoration.replace({ widget: new ImageWidget(doc.sliceString(url.from, url.to), alt) }).range(node.from, node.to),
            )
          }
          return false
        }
        case 'URL':
        case 'Autolink':
          if (!inside(node, 'Link') && !inside(node, 'Image')) decorations.push(mark('cm-md-link').range(node.from, node.to))
          break
        case 'HorizontalRule':
          if (!onActiveLine(node.from)) decorations.push(Decoration.replace({ widget: new RuleWidget() }).range(node.from, node.to))
          break
        case 'Table': {
          if (touches(node)) {
            eachLine(node, (start) => decorations.push(line('cm-md-table-line').range(start)))
            return false
          }
          const from = doc.lineAt(node.from).from
          const to = doc.lineAt(node.to).to
          decorations.push(
            Decoration.replace({ widget: new TableWidget(doc.sliceString(from, to)), block: true }).range(from, to),
          )
          return false
        }
        case 'HTMLBlock':
        case 'HTMLTag':
          // Raw HTML is dropped when the story is saved.
          decorations.push(mark('cm-md-html').range(node.from, node.to))
          break
      }
    },
  })

  return Decoration.set(decorations, true)
}

/** A state field, not a view plugin, because table widgets replace whole lines. */
export const livePreview = StateField.define<DecorationSet>({
  create: buildDecorations,
  update(decorations, transaction) {
    if (transaction.docChanged || transaction.selection || syntaxTree(transaction.state) !== syntaxTree(transaction.startState)) {
      return buildDecorations(transaction.state)
    }
    return decorations
  },
  provide: (field) => EditorView.decorations.from(field),
})
