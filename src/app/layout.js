import { Poppins } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/skeletons.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'
import ToastContanier from '@/components/ToastContanier'
import { SkeletonTheme } from 'react-loading-skeleton'
import HomeBtn from '@/components/HomeBtn'
import Script from 'next/script'

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
        {/* Google Analytics */}
        <Script
          strategy='afterInteractive'
          src={`https://www.googletagmanager.com/gtag/js?id=G-YK75Q6GDGZ`}
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YK75Q6GDGZ');
          `}
        </Script>
      </body>
    </html>
  )
}
