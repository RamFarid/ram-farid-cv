const { AiFillLinkedin } = require('react-icons/ai')
const { BsMessenger, BsWhatsapp } = require('react-icons/bs')
const { MdEmail } = require('react-icons/md')

const contactLinks = [
  {
    icon: <AiFillLinkedin />,
    head: 'LinkidIn',
    sub: {
      href: 'https://www.linkedin.com/in/ram-farid-2a6760273',
      text: 'ram-farid-2a6760273',
    },
  },
  {
    icon: <MdEmail />,
    head: 'Gmail',
    sub: [
      {
        href: 'mailto:workprojects22@gmail.com',
        text: 'workprojects22@gmail.com',
      },
      {
        href: 'mailto:ramfarid3@gmail.com',
        text: 'ramfarid3@gmail.com',
      },
    ],
  },
  {
    icon: <BsWhatsapp />,
    head: 'WhatsApp',
    sub: {
      href: 'https://api.whatsapp.com/send?phone=201553706448&text=Welcome from your website!',
      text: '+201553706448',
    },
  },
  {
    icon: <BsMessenger />,
    head: 'Messenger',
    sub: {
      href: 'https://m.me/rraaamm_s',
      text: 'rraaamm_s',
    },
  },
]

export default contactLinks
