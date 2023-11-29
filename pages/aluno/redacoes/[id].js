import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Accordion, ActionIcon, Badge, Box, Divider, Flex, Grid, Group, Loader, RingProgress, ScrollArea, Tabs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAdjustmentsHorizontal, IconAlignJustified, IconArrowLeft, IconPencil } from "@tabler/icons-react";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import NavbarMobileDashboard from '../../../components/NavbarMobileDashboard'

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

    const [selectedOption, setSelectedOption] = useState("nota");
    const [opacity, setOpacity] = useState(1);
    const [redacao, setRedacao] = useState({});
    const [notas, setNotas] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession()
    const matches = useMediaQuery("(max-width: 1050px)")

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
                                title: redacaoData.title,
                            };
                            setRedacao(redacaoComId);
                            setNotas(redacaoData.notas);
                            setIsLoading(false)
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
        <>
            {!matches ? (
                <div style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
                    {isLoading ? (
                        <Flex
                            align="center"
                            justify="center"
                            style={{
                                minWidth: "100vw",
                                minHeight: "100vh",
                                position: "absolute",
                                zIndex: "1000",
                                backgroundColor: "white",
                            }}
                        >
                            <Loader size="md" />
                        </Flex>
                    ) : null}
                    <Head>
                        <title>{redacao.title ? redacao.title : "Redação sem titulo"} | GUIA</title>
                    </Head>
                    <Grid grow align="center">
                        <Grid.Col span={0.5}>
                            <ActionIcon style={{ borderRadius: '15px', position: 'absolute', top: '0', left: '0' }} variant="default" size="xl" m={5} onClick={() => router.push('/aluno/dashboard')}>
                                <IconArrowLeft />
                            </ActionIcon>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <ScrollArea h={'80vh'} offsetScrollbars>
                                <Box style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', }}>
                                    <Text fw={400} size="xl">{redacao.text}</Text>
                                </Box>
                            </ScrollArea>
                        </Grid.Col>
                        <Grid.Col span={5} h="100vh">

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

                                <Tabs.Panel value="nota" style={{ borderLeft: '1px solid #DEE2E6', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

                                <Tabs.Panel value="estatisticas" style={{ borderLeft: '1px solid #DEE2E6', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    Stats
                                </Tabs.Panel>

                                <Tabs.Panel value="tema" style={{ borderLeft: '1px solid #DEE2E6', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box>
                                        <Text>{redacao.tema}</Text>
                                    </Box>
                                </Tabs.Panel>

                            </Tabs>
                        </Grid.Col>
                    </Grid>
                </div>
            ) : (
                <Grid>
                    <Grid.Col span={12} >
                        <Group>
                            <ActionIcon style={{ borderRadius: '15px', margin: '5px 0 0 5px' }} variant="default" size="xl" onClick={() => router.push('/aluno/dashboard')}>
                                <IconArrowLeft />
                            </ActionIcon>
                            <Text fw={700}>
                                {redacao.title ? redacao.title : "Redação sem titulo"}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={12} style={{ display: 'flex', justifyContent: 'center', height: '100%', opacity: opacity, transition: 'opacity 0.5s ease-in-out' }}>
                        {selectedOption === "redacao" && (
                            <Box style={{ margin: '0 15px', border: '1px solid gray', borderRadius: '10px' }}>
                                <ScrollArea h="80vh" offsetScrollbars style={{ padding: '10px' }}>
                                    <Box style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', }}>
                                        <Text fw={400} size="lg">{redacao.text}</Text>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        )}
                        {selectedOption === "stats" && (
                            <>
                                Stats
                            </>
                        )}
                        {selectedOption === "nota" && (
                            <Flex direction='column' align='center'>
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

                                {/* Mudar design talvez */}
                                
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
                            </Flex>
                        )}
                        {selectedOption === "tema" && (
                            <>
                                Tema
                            </>
                        )}
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <NavbarMobileDashboard selectedOption={selectedOption} setSelectedOption={(newOption) => {
                            setOpacity(0);
                            setTimeout(() => {
                                setSelectedOption(newOption);
                                setOpacity(1); 
                            }, 350); 
                        }} />

                    </Grid.Col>
                </Grid>
            )}
        </>
    );
}
