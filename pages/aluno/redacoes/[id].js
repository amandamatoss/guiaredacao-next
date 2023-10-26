import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from '../../../styles/id.module.css';
import { Accordion, ActionIcon, Badge, Box, Divider, ScrollArea, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { getSession, useSession } from "next-auth/react";

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

export default function Post() {
    const [redacao, setRedacao] = useState({});
    const [notas, setNotas] = useState([]);
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession()
    console.log(session)

    useEffect(() => {
        if (session) {
            const redacaoRef = doc(db, "redacoes", id);
            getDoc(redacaoRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const redacaoData = docSnap.data();
                        if (session.user.email === redacaoData.email) {
                            const redacaoComId = {
                                id: docSnap.id,
                                email: redacaoData.email,
                                text: redacaoData.text,
                                status: redacaoData.status,
                                timestamp: redacaoData.timestamp.toDate().toLocaleDateString(),
                                tema: redacaoData.tema,
                                notas: redacaoData.notas,
                            };
                            setRedacao(redacaoComId);
                            setNotas(redacaoData.notas);
                        } else {
                            router.push('/aluno/dashboard');
                        }
                    } else {
                        console.log("O documento da redação não foi encontrado.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar o documento da redação:", error);
                });
        }
    }, [id]);

    const notaSoma = notas ? notas.reduce((acc, nota) => acc + nota, 0) : 0;
    
    return (
        <div className={styles.container}>
            <ActionIcon style={{ borderRadius: '15px', position: 'absolute', top: '0', left: '0' }} variant="default" size="xl" m={5} onClick={() => router.push('/aluno/dashboard')}>
                <IconArrowLeft />
            </ActionIcon>
            <div className={styles.containerText}>
                <ScrollArea h={'50vh'}>
                    <Box style={{ maxWidth: '100%', wordBreak: 'break-all', whiteSpace: 'pre-wrap', margin: '10px', }}>
                        {redacao.text}
                    </Box>
                </ScrollArea>
            </div>
            <div className={styles.containerInfo}>
                <div className={styles.dateAndStatusGroup}>
                    <Text fw={600}>{redacao.timestamp}</Text>
                    {redacao.status === false ? (
                        <Badge color="gray" variant="light">
                            Não avaliada
                        </Badge>
                    ) : (
                        <Badge color="green" variant="light">
                            Avaliada
                        </Badge>
                    )}
                </div>
                {notas && notas.length > 0 && (
                    <div>
                        <Divider my="sm" />
                        <Text>Sua nota</Text>
                        <Text fw={800} size="22px" ml={5} display="flex" style={{ alignItems: "end" }}>
                            <Text fw={800} size="36px">{notaSoma}</Text>/1000
                        </Text>
                    </div>
                )}

                <div style={{ width: '100%' }}>
                    <Divider my="sm" />
                    <Accordion>
                        <Accordion.Item label="Accordion Item 1" value="instrucoes">
                            <Accordion.Control>Notas por competência</Accordion.Control>
                            <Accordion.Panel>
                                <Box style={{ backgroundColor: '#f1efe8', borderRadius: '10px', padding: '5px' }}>
                                    {notas && notas.length > 0 ? (
                                        notas.map((nota, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    gap: "10px",
                                                    marginLeft: "10px",
                                                    marginRight: "10px",
                                                }}
                                            >
                                                <span style={{ fontWeight: 600 }}>
                                                    Competência {index + 1}
                                                </span>
                                                <span>{nota}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <Text>Você ainda não foi avaliado.</Text>
                                    )}
                                </Box>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item label="Accordion Item 2" value="motivador">
                            <Accordion.Control>Informações da redação</Accordion.Control>
                            <Accordion.Panel>
                                <Box style={{ backgroundColor: '#f1efe8', padding: '10px', borderRadius: '10px' }}>
                                    <Text fw={400} size="16px">Tema: {redacao.tema}</Text>
                                    <Text>Exemplo:</Text>
                                    <Text>Exemplo:</Text>
                                </Box>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
