import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userState } from "../../../atom/userAtom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from '../../../styles/id.module.css'
import { Accordion, ActionIcon, Badge, Box, Button, Divider, ScrollArea, Text } from "@mantine/core";
import nlp from 'compromise'
import { IconArrowLeft } from "@tabler/icons-react";

export default function Post() {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const [sentenceCount, setSentenceCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [letterCount, setLetterCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [redacao, setRedacao] = useState({});
    const [notas, setNotas] = useState([])
    const auth = getAuth();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchUser = async () => {
                    const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCurrentUser(docSnap.data());
                    }
                    setLoading(false);
                };
                fetchUser();
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {

        if (id) {

            const redacaoRef = doc(db, "redacoes", id);

            getDoc(redacaoRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {

                        // verificar se o doc existe e puxar a data
                        const redacaoData = docSnap.data();

                        if (currentUser && currentUser.uid === redacaoData.id) {
                            const redacaoComId = {
                                id: docSnap.id,
                                text: redacaoData.text,
                                status: redacaoData.status,
                                timestamp: redacaoData.timestamp.toDate().toLocaleDateString(),
                                tema: redacaoData.tema,
                                notas: redacaoData.notas,
                            };
                            setRedacao(redacaoComId);
                            setNotas(redacaoData.notas);
                        } else {
                            router.push('/aluno/dashboard')
                        }
                    } else {
                        console.log("O documento da redação não foi encontrado.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar o documento da redação:", error);
                });
        }
    }, [id, currentUser]);


    const deleteRedacao = async () => {
        try {
            const redacaoRef = doc(db, "redacoes", id);
            await deleteDoc(redacaoRef);
            router.push('/aluno/dashboard');
        } catch (error) {
            console.error("Erro ao excluir redação:", error);
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!currentUser) {
        return <p>Você não tem permissão para acessar este arquivo.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerText}>
                <ActionIcon style={{ borderRadius: '15px' }} variant="default" size="xl" m={5} onClick={() => router.push('/aluno/dashboard')}>
                    <IconArrowLeft />
                </ActionIcon>
                {/* Por tema da redação */}
                <div className={styles.containerTextBD}>
                    <ScrollArea h={'50vh'} >
                        <Box style={{ maxWidth: '100%', wordBreak: 'break-all', whiteSpace: 'pre-wrap', margin: '10px' }}>
                            {redacao.text}
                        </Box>
                    </ScrollArea>
                </div>
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
                <div style={{ width: '80%' }}>
                    <Accordion>
                        <Accordion.Item label="Accordion Item 1" value="instrucoes">
                            <Accordion.Control>Notas por competência</Accordion.Control>
                            <Accordion.Panel>
                                {notas.map((nota, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginLeft: '10px', marginRight: '10px'}}>
                                        <span style={{ fontWeight: 700}}>Competência {index + 1}</span>
                                        <span>{nota}</span>
                                    </div>
                                ))}
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item label="Accordion Item 2" value="motivador">
                            <Accordion.Control>Informações da redação</Accordion.Control>
                            <Accordion.Panel>
                                Roger
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <Button onClick={deleteRedacao}>Excluir</Button>
            </div>
        </div>
    );
}
