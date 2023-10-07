import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { useRouter } from "next/router";
import Input from "../../components/Input";
import RedacoesContainer from "../../components/RedacoesContainer"

export default function Dashboard () {

  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
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

  function onSignOut() {
    signOut(auth)
    setCurrentUser(null)
    router.push('/')
  }
  
  return (
    <>
    {currentUser ? (
      <div>
        <h2 onClick={onSignOut}>oi</h2>
        <Input />
        <RedacoesContainer />
      </div>
    ) : (
      <div>
        <h2 onClick={() => router.push('/auth/signin')}>fazer login antes de acessar</h2>
      </div>
    )}
    </>
  )
}
