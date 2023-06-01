import admin from 'firebase-admin'
import serviceAccount from '../ram-farid-cv-amin-SDK.json'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://ram-farid-cv-c3d7f.appspot.com',
  })
}

export default admin
