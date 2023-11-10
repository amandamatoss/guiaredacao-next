import NextAuth from "next-auth"
<<<<<<< HEAD
export default NextAuth({
  providers: [
    GoogleProvider({
    }),
  ],
=======
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from 'firebase-admin/app'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  }),
  pages: [
    '/auth/signin',
  ],
>>>>>>> ba1fa68f6827b2d57c33d09add68171592a7544f
})