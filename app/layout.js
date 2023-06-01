import '@/styles/globals.css'
import '@/styles/nav.css'
import '@/styles/footer.css'
import Nav from '@/components/Navigation/Nav'
import Footer from '@/components/Footer/Footer'
import '@/styles/portfolio.css'
import '@/styles/loading.css'
import 'react-toastify/dist/ReactToastify.css'
import ToastContanier from '@/components/ToastContanier'

export const metadata = {
  title: 'Ram Farid',
  description:
    "Hello, I'm Ram Farid Front-end developer I have +1.5 years experience in Front-End development I can build a fully website with all features that make Customer familiar with it, I can build with Pure HTML, CSS and JavaScript This is a good choice; but React library is a very good one.My react knowledge isn't a few, I know all fundamentals and advanced topics from Error boundaries, HOC, Lazy loading advanced hooks (useReducer, useMemo, ...etc) I hope to be at the best of your judgment My projects is little bit but you will like my work, just work with me",
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <main className='container'>{children}</main>
        <Footer />
        <Nav />
        <ToastContanier />
      </body>
    </html>
  )
}
