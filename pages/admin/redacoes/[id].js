import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userState } from "../../../atom/userAtom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from '../../../styles/id.module.css'
import { ActionIcon, Badge, Box, Button, ScrollArea, Text } from "@mantine/core";
import nlp from 'compromise'
import { IconArrowLeft } from "@tabler/icons-react";

export default function Post() {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const [sentenceCount, setSentenceCount] = useState(0); 
    const [wordCount, setWordCount] = useState(0); 
    const [letterCount, setLetterCount] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [redacao, setRedacao] = useState({}); 
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
                        const redacaoData = docSnap.data();
                        const redacaoComId = {
                            id: docSnap.id,
                            text: redacaoData.text,
                            status: redacaoData.status,
                            timestamp: redacaoData.timestamp.toDate().toLocaleDateString(),
                            tema: redacaoData.tema,
                        };
                        setRedacao(redacaoComId); 
                    } else {
                        console.log("O documento da redação não foi encontrado.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar o documento da redação:", error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (redacao.text) {
            const doc = nlp(redacao.text);
            const sentences = doc.sentences().out("array");
            const words = redacao.text.split(/\s+/);
            const letters = redacao.text;

            setSentenceCount(sentences.length);
            setWordCount(words.length);
            setLetterCount(letters.length);
        }
    }, [redacao]);

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
                <ActionIcon  style={{ borderRadius: '15px'}}variant="default" size="xl" m={5} onClick={() => router.push('/admin/dashboard')}>
                    <IconArrowLeft />
                </ActionIcon>
                <div className={styles.containerTextBD}>
                    <ScrollArea h={'50vh'}>
                        <Box style={{ maxWidth: '100%', wordBreak: 'break-all', whiteSpace: 'pre-wrap', margin: '10px'}}>
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
                <div>
                    <Text fw={500}>Tema: {redacao.tema}</Text>
                </div>
                <div className={styles.statsOfText}>
                    <Box align="center">
                        <Text fw={800} size={'30px'}>{wordCount} </Text>
                        <Text fw={400}>{wordCount === 1 ? "Palavra" : 'Palavras'}</Text>
                    </Box>
                    <Box align="center">
                        <Text fw={800} size={'30px'}>{letterCount} </Text>
                        <Text fw={400}>{letterCount === 1 ? "Letra" : 'Letras'}</Text>
                    </Box>
                    <Box align="center">
                        <Text fw={800} size={'30px'}>{sentenceCount} </Text>
                        <Text fw={400}>{sentenceCount === 1 ? "Frase" : 'Frases'}</Text>
                    </Box>
                </div>
                <Button onClick={deleteRedacao}>Excluir</Button>
            </div>
        </div>
    );
}
