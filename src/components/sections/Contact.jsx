import FormMsg from '@/components/ContactMe/FormMsg'
import SocialCards from '@/components/ContactMe/SocialCards'
import FSWrapper from '@/lib/FS'
import '@/styles/contact.css'

export default function ContactMe() {
  return (
    <>
      <FSWrapper
        frontFaceComponent={<SocialCards />}
        backFaceComponent={<FormMsg />}
      />
    </>
  )
}
