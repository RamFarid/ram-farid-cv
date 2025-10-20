import FormMsg from '@/components/ContactMe/FormMsg'
import SocialCards from '@/components/ContactMe/SocialCards'
import FSWrapper from '@/lib/FS'
import '@/styles/contact.css'

export default function ContactMe({ socialLinks }) {
  return (
    <>
      <FSWrapper
        frontFaceComponent={<SocialCards socialLinks={socialLinks} />}
        backFaceComponent={<FormMsg />}
      />
    </>
  )
}
