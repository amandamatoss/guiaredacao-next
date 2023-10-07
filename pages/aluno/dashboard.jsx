import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { useRouter } from "next/router";
import Input from "../../components/Input";
import RedacoesContainer from "../../components/RedacoesContainer";
import NavbarItens, { NavbarDashboard } from "../../components/NavbarItens";
import Navbar from "../../components/Navbar";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Image } from "@mantine/core";
import Logo from "../../assets/imgs/Logo.png";

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("inicio");

  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [opened, { toggle }] = useDisclosure();

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
    signOut(auth);
    setCurrentUser(null);
    router.push("/");
  }

  return (
    <>
      {currentUser ? (
        <div>
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header>
              <Group>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Image src={Logo} alt="roger"></Image>
              </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
              <NavbarItens setSelectedOption={setSelectedOption} />
            </AppShell.Navbar>

            <AppShell.Main>
              {selectedOption === "redacoes" && (
                <div>
                  <RedacoesContainer />
                  <Input />
                </div>
              )}
            </AppShell.Main>
          </AppShell>
        </div>
      ) : (
        <div>
          <h2 onClick={() => router.push("/auth/signin")}>
            fazer login antes de acessar
          </h2>
        </div>
      )}
    </>
  );
}
