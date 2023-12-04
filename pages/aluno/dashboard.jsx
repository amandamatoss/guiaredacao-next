import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Input from "../../components/Input";
import RedacoesContainer from "../../components/RedacoesContainer";
import NavbarItens from "../../components/NavbarItens";
import { useDisclosure, useHover, useMediaQuery } from "@mantine/hooks";
import {
  AppShell,
  Button,
  Text,
  Modal,
  Box,
  Flex,
  Loader,
  Avatar,
  Menu,
  Divider,
  UnstyledButton,
} from "@mantine/core";
import Logo from "../../assets/imgs/Logo.png";
import styles from "../../styles/Dashboard.module.css";
import { getSession, signOut, useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Inicio from "../../components/Inicio";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Head from "next/head";
import { IconHelpCircle, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconPencil } from "@tabler/icons-react";
import NavbarMobile from "../../components/NavbarMobile";
import Agendamento from "../../components/Agendamento";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("inicio");
  const { data: session } = useSession();

  const [isOpen, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notasRedacoes, setNotasRedacoes] = useState([]);
  const [mediaNotasRedacoes, setMediaNotasRedacoes] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { hovered, ref } = useHover()
  const matches = useMediaQuery("(max-width: 576px)");

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    if (session && session.user) {
      const CreateUser = async () => {
        const usersCollection = collection(db, "users");
        const userQuery = query(
          usersCollection,
          where("email", "==", session.user.email)
        );
        const userDocs = await getDocs(userQuery);

        if (userDocs.empty) {
          const uniqueUserId = uuidv4(); // Gere um ID único usando uuidv4
          const userDocumentData = {
            id: uniqueUserId,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            isAdmin: false,
            createdAt: serverTimestamp(),
            plan: 'free',
            // Outras informações do usuário, se necessário
          };

          try {
            // Crie o documento do usuário
            await addDoc(usersCollection, userDocumentData);
            console.log("Documento do usuário criado com sucesso.");
            const userDoc = userDocs.docs[0];
            session.user.id = userDoc.data().id;
            setIsLoading(false);
          } catch (error) {
            console.error("Erro ao criar o documento do usuário:", error);
          }
        } else {
          // O documento do usuário já existe, defina o session.user.id com base no documento existente
          const userDoc = userDocs.docs[0];
          session.user.id = userDoc.data().id;
          console.log("Documento do usuário já existe.");
          setIsLoading(false);
        }
      };

      CreateUser();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      const redacoesRef = collection(db, "redacoes");
      const q = query(redacoesRef, where("email", "==", session.user.email));

      getDocs(q)
        .then((querySnapshot) => {
          const notas = [];
          let numeroRedacoesCorrigidas = 0; // Inicialize um contador para redações corrigidas

          querySnapshot.forEach((doc) => {
            const redacaoData = doc.data();
            const notasRedacao = redacaoData.notas || [];

            if (redacaoData.status === true) { // Verifique se a redação está corrigida
              const somaNotasRedacao = notasRedacao.reduce(
                (acc, nota) => acc + nota,
                0
              );
              notas.push(somaNotasRedacao);
              numeroRedacoesCorrigidas++; // Incrementa o contador de redações corrigidas
            }
          });

          setNotasRedacoes(notas);

          // Calcula a média das somas das notas de todas as redações corrigidas
          const mediaNotas =
            numeroRedacoesCorrigidas > 0
              ? notas.reduce((acc, soma) => acc + soma, 0) / numeroRedacoesCorrigidas
              : 0;
          setMediaNotasRedacoes(mediaNotas);
        })
        .catch((error) => {
          console.error("Erro ao buscar as redações:", error);
        });
    }
  }, [session]);


  return (
    <>
      <Head>
        <title>Aluno | GUIA</title>
      </Head>
      {isLoading ? (
        <Flex
          align="center"
          justify="center"
          style={{
            width: '100vw',
            height: '100vh',
            position: "absolute",
            zIndex: "10000",
            backgroundColor: "white",
          }}
        >
          <Loader size="md" />
        </Flex>
      ) : null}
      <div>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: sidebarCollapsed ? '70px' : '230px',
            breakpoint: 576,
          }}
          padding="md"
        >
          <Modal opened={isOpen} onClose={close} centered fullScreen >
            <Input isOpen={isOpen} close={close} />
          </Modal>

          <AppShell.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0px 0 10px', boxShadow: '2px 1px 4px 0px rgba(0,0,0,0.2)' }}>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              {!matches ? <UnstyledButton onClick={toggleSidebar}>{sidebarCollapsed ? <IconLayoutSidebarLeftExpand size={30} /> : <IconLayoutSidebarLeftCollapse size={30} />}</UnstyledButton> : null }
              <Image src={Logo} width={100} height={100} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Menu position="bottom-end" withArrow>
                <Menu.Target>
                  <Avatar src={session?.user.image} style={{ cursor: 'pointer', marginRight: '15px' }} />
                </Menu.Target>
                <Menu.Dropdown p={10}>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src={session?.user.image} style={{ cursor: "pointer", marginBottom: '10px', border: '1px solid green' }} size={90} />
                    <Text fw={600} size="22px" style={{ textAlign: 'center', marginTop: '5px' }}>{session?.user.name.trim().split(" ")[0].charAt(0).toUpperCase() + session?.user.name.trim().split(" ")[0].slice(1)}</Text>
                    <Text style={{ textAlign: 'center', marginTop: '1px' }}>{session?.user.email}</Text>
                  </div>

                  <Divider style={{ margin: "10px 0" }} />

                  <Button variant="transparent" c="black" fullWidth leftSection={<IconHelpCircle size={20} />} align="center">Ajuda</Button>

                  <Divider style={{ margin: "10px 0" }} />

                  <Button onClick={signOut} variant='transparent' style={{ color: "black", margin: "0 auto", display: "block", border: '1px solid gray' }}>
                    SAIR
                  </Button>
                </Menu.Dropdown>
              </Menu>
            </div>
          </AppShell.Header>

          {!matches && (
            <AppShell.Navbar zIndex={1} style={{ width: sidebarCollapsed ? "50px" : "230px", transition: "width 0.3s" }}>
              <NavbarItens setSelectedOption={setSelectedOption} openModal={open} sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} selectedOption={selectedOption}/>
            </AppShell.Navbar>
          )}
          {matches && (
            <NavbarMobile setSelectedOption={setSelectedOption} selectedOption={selectedOption}/>
          )}


          <AppShell.Main>
            {selectedOption === "inicio" && (
              <Inicio session={session}
                mediaNotasRedacoes={mediaNotasRedacoes}
                notasRedacoes={notasRedacoes} />
            )}
            {selectedOption === "redacoes" && (
              <>
                <div className={styles.container}>
                  <Text fw={600} size="20px" mb={15}>
                    Minhas redações
                  </Text>
                  <Button
                    size='md'
                    radius='md'
                    ref={ref}
                    w='70%'
                    m='auto'
                    leftSection={<IconPencil size={24} />}
                    onClick={open}
                    style={{
                      background: !hovered ? 'rgba(144, 238, 144, 0.5)' : 'rgba(144, 238, 144, 1)',
                      color: 'green',
                      transition: '0.3s',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
                    }}
                  >
                    Nova redação
                  </Button>
                  <div className={styles.containerRedacoes}>
                    <RedacoesContainer />
                  </div>
                </div>
              </>
            )}
            {selectedOption === "evolucao" && (
              <Flex direction="column" align="center" m={30}>
                <div style={{ width: '80%', height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[{ name: 'Ponto Inicial', nota: 0 }, ...notasRedacoes.map((nota, index) => ({ name: `Redação ${index + 1}`, nota }))]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="nota" stroke="green" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Flex>
            )}
            {selectedOption === "agendamento" && (
                <Agendamento />
            )}

          </AppShell.Main>
        </AppShell>
      </div>
    </>
  );
}
