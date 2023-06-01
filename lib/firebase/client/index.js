'use client'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAFuwyU_wQ9_Tm-81TJUazNqfUFX_pP8tw',
  authDomain: 'ram-farid-cv-c3d7f.firebaseapp.com',
  projectId: 'ram-farid-cv-c3d7f',
  storageBucket: 'ram-farid-cv-c3d7f.appspot.com',
  messagingSenderId: '261619836421',
  appId: '1:261619836421:web:276b97714efdd89a6fde6c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
