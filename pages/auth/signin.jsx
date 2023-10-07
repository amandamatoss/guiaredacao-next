import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function signIn() {

    const router = useRouter()
    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            const user = auth.currentUser.providerData[0]
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    userImg: user.photoURL,
                    uid: user.uid,
                    timestamp: serverTimestamp(),
                })
            }
            router.push('/aluno/dashboard')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <button onClick={onGoogleClick}>Sign</button>
    )
}