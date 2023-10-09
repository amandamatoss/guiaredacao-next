import { useRouter } from "next/router";
import RedacoesContainer from "../../../components/RedacoesContainer";
import { useRecoilState } from "recoil";
import { userState } from "../../../atom/userAtom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from '../../../styles/id.module.css'
import { ActionIcon, Badge, Box, ScrollArea, Text } from "@mantine/core";
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

                        // verificar se o doc existe e puxar a data
                        const redacaoData = docSnap.data();

                        if (currentUser && currentUser.uid === redacaoData.id) {
                            const redacaoComId = {
                                id: docSnap.id,
                                text: redacaoData.text,
                                status: redacaoData.status,
                                timestamp: redacaoData.timestamp.toDate().toLocaleDateString(),
                            };
                            setRedacao(redacaoComId); 
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

    useEffect(() => {
        
        if (redacao.text) {

            // Use a biblioteca compromise para analisar o texto
            const doc = nlp(redacao.text);

            // Extraia as frases do texto
            const sentences = doc.sentences().out("array");

            // Extraia as palavras do texto
            const words = redacao.text.split(/\s+/);

            // Calcule a contagem de letras (removendo espaços)
            const letters = redacao.text;

            // Defina as contagens nos estados
            setSentenceCount(sentences.length);
            setWordCount(words.length);
            setLetterCount(letters.length);
        }
    }, [redacao]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!currentUser) {
        return <p>Você não tem permissão para acessar este arquivo.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerText}>
                <ActionIcon  style={{ borderRadius: '15px'}}variant="default" size="xl" m={5} onClick={() => router.push('/aluno/dashboard')}>
                    <IconArrowLeft />
                </ActionIcon>
                <div className={styles.containerTextBD}>
                <ScrollArea h={'50vh'}>
                    <Text style={{ whiteSpace: 'pre-wrap' }} fw={500} mr={50} ml={5} my={5}>{redacao.text}</Text>
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
            </div>
        </div>
    );
}
