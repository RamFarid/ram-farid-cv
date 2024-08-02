import { Poppins } from 'next/font/google'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import ToastContanier from '@/components/ToastContanier'
import { SkeletonTheme } from 'react-loading-skeleton'
import HomeBtn from '@/components/HomeBtn'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata = {
  title: 'Ram Farid',
  description:
    'This is the CV of Ram Farid as a Front-end developer I have a lot of experience in Front-End development I can build a fully website with all features that make Customer familiar with it, Chuck up Ram Farid CV to see Projects, Experiences, and contact with us',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <HomeBtn />
        <SkeletonTheme
          baseColor='var(--color-background-variant)'
          highlightColor='var(--color-primary)'
        >
          {children}
        </SkeletonTheme>
        <ToastContanier />
      </body>
    </html>
  )
}
