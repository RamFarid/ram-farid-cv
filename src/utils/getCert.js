import admin from '@/lib/firebase/server'

export default async function getCert() {
  const testimonials = await admin
    .firestore()
    .collection('metadata')
    .doc('testimonials')
    .get()
  return { ...testimonials.data(), id: testimonials.id }
}
