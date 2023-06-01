import '@/styles/dashboard.css'

export const metadata = {
  title: 'Dashborad',
}

export default function DashboardLayout({ children }) {
  return <section className='DASHBOARD_PAGE'>{children}</section>
}
