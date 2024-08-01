import '@/styles/dashboard.css'
import '@/styles/portfolio.css'
export const metadata = {
  title: 'Dashborad',
}

export default function DashboardLayout({ children }) {
  return <section className='DASHBOARD_PAGE'>{children}</section>
}
