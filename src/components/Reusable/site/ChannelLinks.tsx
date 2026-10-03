import { useTranslations } from 'next-intl'
import { Arrow } from '@/components/ui/Arrow'
import { contactChannels } from '@/lib/profile'
import type { ContactChannel } from '@/lib/profile/types'
import { cn } from '@/utils'
import { ChannelIcon } from './ChannelIcon'

// Profiles open in a new tab with `rel="me"`, which ties them to this site; email and chat links open the visitor's app.
function linkProps(channel: ContactChannel) {
  if (channel.id === 'email') return {}
  return { target: '_blank', rel: channel.kind === 'profile' ? 'me noreferrer' : 'noreferrer' }
}

/** The footer's short list: each channel's name. */
export function FooterChannels({ className }: { className?: string }) {
  const t = useTranslations('Common')

  return (
    <ul className={cn('flex flex-wrap gap-x-space-5 gap-y-space-2', className)}>
      {contactChannels
        .filter((channel) => channel.footer)
        .map((channel) => (
          <li key={channel.id}>
            <a
              href={channel.href}
              {...linkProps(channel)}
              className="group inline-flex items-center gap-space-1 text-label text-ink transition-colors hover:text-primary-ink"
            >
              {t(`channels.${channel.id}`)}
              {channel.id !== 'email' && <span className="sr-only">{t('newTab')}</span>}
              <Arrow direction="external" className="text-ink-muted" />
            </a>
          </li>
        ))}
    </ul>
  )
}

/**
 * Every channel as a dark tile: an icon, then the channel's name and the handle to find Ram by. Made for a violet field,
 * where the tiles echo the dark screenshot slab.
 */
export function ChannelList({ className }: { className?: string }) {
  const t = useTranslations('Common')

  return (
    <ul className={cn('grid grid-cols-2 gap-space-2', className)}>
      {contactChannels.map((channel) => (
        <li key={channel.id}>
          <a
            href={channel.href}
            {...linkProps(channel)}
            className={cn(
              'group grid h-full gap-space-4 rounded-lg border border-transparent bg-violet-ink p-space-4 text-link',
              'transition-[border-color,translate,box-shadow] duration-(--duration-base) ease-out',
              'hover:-translate-y-0.5 hover:border-link/55 hover:shadow-glow motion-reduce:hover:translate-y-0',
            )}
          >
            <span className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-md bg-link/18">
                <ChannelIcon id={channel.id} />
              </span>
              <Arrow direction="external" className="text-link/70" />
            </span>
            <span className="grid min-w-0 gap-space-1">
              <span className="text-label">{t(`channels.${channel.id}`)}</span>
              {/* justify-self-start keeps the left-to-right handle on the start side in RTL too. */}
              <bdi dir="ltr" className="max-w-full justify-self-start truncate font-mono text-code">
                {channel.handle}
              </bdi>
            </span>
            {channel.id !== 'email' && <span className="sr-only">{t('newTab')}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
