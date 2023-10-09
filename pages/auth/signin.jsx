import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { useEffect } from 'react';

export default function signIn() {

    const routere = useRouter()

  const [currentUser, setCurrentUser] = useRecoilState(userState);

  if(currentUser) {
    routere.push('/aluno/dashboard')
}
  console.log(currentUser);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          }
        };
        fetchUser();
      }
    });
  }, []);

    const router = useRouter()
    const handleGoogleSignIn = async () => {
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
        <button onClick={handleGoogleSignIn}>Sign</button>
    )
}