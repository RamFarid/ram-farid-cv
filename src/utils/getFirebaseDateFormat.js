import admin from '@/lib/firebase/server'

export default function getFirebaseDateFormat(timeInterval) {
  return timeInterval
    ? admin.firestore.Timestamp.fromDate(new Date(timeInterval))
    : null
}
