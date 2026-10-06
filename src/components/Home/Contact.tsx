import { useTranslations } from 'next-intl'
import { ChannelList } from '@/components/Reusable/site/ChannelLinks'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContactForm } from './ContactForm'

// Where the page ends, on a violet field: the form, then the other ways to reach Ram. See docs/contact.md
export function Contact() {
  const t = useTranslations('Home.contact')

  return (
    <section id="contact" aria-labelledby="contact-title" className="field-violet py-space-9 md:py-space-10">
      {/* Phones read heading, form, channels; from lg the channels sit under the heading, beside the form. */}
      <Container className="grid gap-x-space-8 gap-y-space-7 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        <SectionHeading
          id="contact-title"
          index="08"
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
          className="lg:col-span-5"
        />

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <ContactForm />
        </div>

        <div className="grid content-start gap-space-3 max-lg:mt-space-4 lg:col-span-5">
          <h3 className="text-small text-ink-muted">{t('social')}</h3>
          <ChannelList />
        </div>
      </Container>
    </section>
  )
}
