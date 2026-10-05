import 'server-only'
import { Document, Font, Link, Page, renderToBuffer, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { CvBlock, CvDocument, CvEntry } from './types'

// The CV's layout, built for applicant tracking systems first (docs/cv.md#ats): one column in reading order, real
// text in a standard font, plain section headings, links written out, no images, icons, tables or text in page
// headers or footers.

// react-pdf hyphenates long words by default, which would put "Type-Script" into the extracted text.
Font.registerHyphenationCallback((word) => [word])

// The light theme of docs/design-system/tokens.json: the CV is printed and read on white.
const color = {
  ink: '#16121d',
  inkMuted: '#5d566c',
  primaryInk: '#7a2ee0',
  lineStrong: '#8a8199',
}

// Helvetica is one of the PDF standard fonts: nothing to embed, and its text extracts exactly in every reader and
// parser. It covers Latin-1, which the English CV needs.
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.4,
    color: color.ink,
  },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 20, lineHeight: 1.2 },
  headline: { fontFamily: 'Helvetica-Bold', fontSize: 11.5, color: color.primaryInk, marginTop: 2 },
  tools: { fontSize: 9.5, color: color.inkMuted, marginTop: 1 },
  contacts: { fontSize: 9, marginTop: 4 },
  contactLink: { color: color.ink, textDecoration: 'none' },
  section: { marginTop: 12 },
  sectionHeading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    color: color.primaryInk,
    paddingBottom: 2,
    marginBottom: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: color.lineStrong,
  },
  paragraph: { marginBottom: 4 },
  skillRow: { marginBottom: 2.5 },
  bold: { fontFamily: 'Helvetica-Bold' },
  entry: { marginBottom: 8 },
  entryHead: { flexDirection: 'row', justifyContent: 'space-between' },
  entryHeading: { fontFamily: 'Helvetica-Bold', fontSize: 10, flex: 1, paddingRight: 12 },
  entryDates: { fontSize: 9, color: color.inkMuted, paddingTop: 0.5 },
  links: { fontSize: 9, color: color.inkMuted },
  link: { color: color.inkMuted, textDecoration: 'none' },
  entryText: { marginTop: 1.5 },
  bullet: { flexDirection: 'row', marginTop: 2 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
})

/** Items joined by " | " as text, each clickable when it has an address. */
function Joined({ items, linkStyle }: { items: { text: string; href?: string }[]; linkStyle: typeof styles.link }) {
  return items.map((item, index) => (
    <Text key={`${item.text}-${index}`}>
      {index > 0 && ' | '}
      {item.href ? (
        <Link src={item.href} style={linkStyle}>
          {item.text}
        </Link>
      ) : (
        item.text
      )}
    </Text>
  ))
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet} wrap={false}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  )
}

function Entry({ entry }: { entry: CvEntry }) {
  const [first, ...rest] = entry.bullets

  return (
    <View style={styles.entry}>
      {/* The heading never ends a page alone: it moves with the first line under it. */}
      <View wrap={false}>
        <View style={styles.entryHead}>
          <Text style={styles.entryHeading}>{entry.heading}</Text>
          {entry.dates && <Text style={styles.entryDates}>{entry.dates}</Text>}
        </View>
        {entry.links.length > 0 && (
          <Text style={styles.links}>
            <Joined items={entry.links} linkStyle={styles.link} />
          </Text>
        )}
        {entry.text && <Text style={styles.entryText}>{entry.text}</Text>}
        {first && <Bullet text={first} />}
      </View>
      {rest.map((bullet, index) => (
        <Bullet key={index} text={bullet} />
      ))}
    </View>
  )
}

function Block({ block }: { block: CvBlock }) {
  const items =
    block.id === 'summary'
      ? block.paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))
      : block.id === 'skills'
        ? block.groups.map((group) => (
            <Text key={group.label} style={styles.skillRow}>
              <Text style={styles.bold}>{group.label}: </Text>
              {group.items.join(', ')}
            </Text>
          ))
        : block.id === 'languages'
          ? [<Text key="languages">{block.items.join(' | ')}</Text>]
          : block.entries.map((entry, index) => <Entry key={index} entry={entry} />)
  const [first, ...rest] = items

  return (
    <View style={styles.section}>
      {/* A heading never ends a page alone: it moves with the section's first item. */}
      <View wrap={false}>
        <Text style={styles.sectionHeading}>{block.heading.toUpperCase()}</Text>
        {first}
      </View>
      {rest}
    </View>
  )
}

function CvPdf({ cv }: { cv: CvDocument }) {
  return (
    <Document
      title={cv.title}
      author={cv.name}
      subject={cv.subject}
      keywords={cv.keywords.join(', ')}
      creator={cv.name}
      producer={cv.name}
      language="en"
    >
      <Page size={cv.pageSize} style={styles.page}>
        <Text style={styles.name}>{cv.name}</Text>
        {cv.headline && <Text style={styles.headline}>{cv.headline}</Text>}
        {cv.tools.length > 0 && <Text style={styles.tools}>{cv.tools.join(' | ')}</Text>}
        {cv.contacts.length > 0 && (
          <Text style={styles.contacts}>
            <Joined items={cv.contacts} linkStyle={styles.contactLink} />
          </Text>
        )}
        {cv.blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </Page>
    </Document>
  )
}

/** The CV as PDF bytes, with its page count (from the page objects; react-pdf doesn't report it). */
export async function renderCvPdf(cv: CvDocument) {
  const pdf = await renderToBuffer(<CvPdf cv={cv} />)
  const pages = pdf.toString('latin1').match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0
  return { pdf, pages }
}
