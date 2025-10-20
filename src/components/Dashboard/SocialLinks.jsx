import getSocialLinks from '@/utils/getSocialLinks'
import SocialTextField from './SocialTextField'

export default async function SocialLinks() {
  const initialData = await getSocialLinks()
  console.log(initialData)
  return (
    <div
      style={{
        padding: '20px',
        flex: 1,
        background: 'var(--color-background-variant)',
        borderRadius: 10,
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Social Links</h2>
      {['ig', 'wa', 'email', 'fb', 'github', 'linkedin', 'fb_m'].map((key) => (
        <div key={key} style={{ marginBottom: '12px' }}>
          <SocialTextField
            id={key}
            label={key.toUpperCase()}
            value={initialData[key] ?? ''}
          />
        </div>
      ))}
    </div>
  )
}
