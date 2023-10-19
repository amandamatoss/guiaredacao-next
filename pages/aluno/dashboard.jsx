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
import { Loader, Flex } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks'
import { AppShell, Burger, Button, Group, Image, Text, Modal, Box } from "@mantine/core";
import Logo from "../../assets/imgs/Logo.png";
import styles from "../../styles/Dashboard.module.css";

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("inicio");

  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [opened, { toggle }] = useDisclosure();
  const [isOpen, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);

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
        fetchUser().then(() => setIsLoading(false));
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
      {isLoading ? (
        <Flex
          align="center"
          justify="center"
          style={{ minHeight: "100vh" }} // Centraliza o conteúdo verticalmente e horizontalmente
        >
          <Loader size="md" />
        </Flex>
      ) : currentUser ? (
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
            <Modal opened={isOpen} onClose={close} centered size='100vw'>
              <Input isOpen={isOpen} close={close} />
            </Modal>

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
              {selectedOption === "inicio" && <h2>Bem vindo, {currentUser.name}</h2>}
              {selectedOption === "redacoes" && (
                <>
                  <div className={styles.container}>
                    <Text fw={800} size="48px">
                      Redação
                    </Text>
                    <div className={styles.containerInfo}>
                      <Box>
                        <Text fw={600} size="18px">
                          Média das suas redações
                        </Text>
                        {/* De acordo com as redações enviadas! Apenas exemplo */}
                        <Text fw={800} size="24px" mt={15} display='flex'><Text fw={800} size="36px">780</Text>/1000</Text>
                      </Box>
                      <Box>
                        <Text fw={600} size="18px">Redações disponíveis</Text>
                        {/* De acordo com o plano! Apenas exemplo */}
                        <Text fw={800} size="24px" mt={15} display='flex'><Text fw={800} size="36px">1</Text>/2</Text>
                      </Box>
                    </div>
                    <div className={styles.containerRedacoes}>
                      <Text fw={500} size='20px'>Minhas redações</Text>
                      <RedacoesContainer />
                    </div>
                    <Button maw={160} m={"auto"} onClick={open}>
                      Nova redação
                    </Button>
                  </div>
                </>
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
