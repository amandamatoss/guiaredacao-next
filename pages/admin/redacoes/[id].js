import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Accordion, ActionIcon, Badge, Box, Divider, Grid, RingProgress, ScrollArea, Tabs, Text } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconAlignJustified, IconArrowLeft, IconPencil } from "@tabler/icons-react";
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
    const mappedNota = notaSoma / 10;

    return (
        <Grid grow>
            <Grid.Col span="content">
            <ActionIcon style={{ borderRadius: '15px', position: 'absolute', top: '0', left: '0' }} variant="default" size="xl" m={5} onClick={() => router.push('/aluno/dashboard')}>
                <IconArrowLeft />
            </ActionIcon>
            </Grid.Col>
            <Grid.Col span={6} style={{ display: 'flex', alignItems: 'center'}}>
                <ScrollArea h={'80vh'} offsetScrollbars>
                    <Box style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', }}>
                        <Text fw={400} size="xl">{redacao.text}</Text>
                    </Box>
                </ScrollArea>
            </Grid.Col>
            <Grid.Col span={5}>

                <Tabs color="rgba(135, 27, 27, 1)" variant="outline" radius="md" defaultValue="nota" p={25}>
                    <Tabs.List grow justify="center">
                        <Tabs.Tab value="nota" leftSection={<IconPencil size={20} color="green" />}>
                            <Text fw={500} color="#2B8A3E">NOTA</Text>
                        </Tabs.Tab>
                        <Tabs.Tab value="estatisticas" leftSection={<IconAdjustmentsHorizontal size={20} color="green" />}>
                            <Text fw={500} color="#2B8A3E">ESTATÍSTICAS</Text>
                        </Tabs.Tab>
                        <Tabs.Tab value="tema" leftSection={<IconAlignJustified size={20} color="green" />}>
                            <Text fw={500} color="#2B8A3E">TEMA</Text>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="nota" style={{ borderLeft: '1px solid #DEE2E6', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', height: '89vh', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Text fw={600} size="24px" my={10}>Nota final</Text>
                        <RingProgress
                            m="0 auto"
                            roundCaps
                            size={150}
                            sections={[{ value: mappedNota, color: 'green' }]}
                            label={
                                <Text fw={700} ta="center" size="24px">
                                    {notaSoma}
                                </Text>
                            }
                        />
                        <Divider my="sm" />
                        <Accordion w={'100%'}>
                            <Accordion.Item label="Accordion Item 1" value="instrucoes">
                                <Accordion.Control>Notas por competência</Accordion.Control>
                                <Accordion.Panel>
                                    <Box
                                        style={{
                                            backgroundColor: '#F8F9FA',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
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
                                                        padding: "5px 0",
                                                        borderBottom: "1px solid #DEE2E6",
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 600 }}>
                                                        Competência {index + 1}
                                                    </span>
                                                    <span>{nota}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <Text style={{ padding: "10px" }}>
                                                Você ainda não foi avaliado.
                                            </Text>
                                        )}
                                    </Box>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Tabs.Panel>

                    <Tabs.Panel value="estatisticas" style={{ borderLeft: '1px solid #DEE2E6', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', height: '89vh', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        Stats
                    </Tabs.Panel>

                    <Tabs.Panel value="tema" style={{ borderLeft: '1px solid #DEE2E6', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', height: '89vh', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        Tema
                    </Tabs.Panel>

                </Tabs>
            </Grid.Col>
        </Grid>
    );
}
