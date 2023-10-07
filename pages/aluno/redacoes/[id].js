import { useRouter } from "next/router";
import RedacoesContainer from "../../../components/RedacoesContainer";
import { useRecoilState } from "recoil";
import { userState } from "../../../atom/userAtom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from '../../../styles/id.module.css'
import { Badge, Box, Group, ScrollArea, Text } from "@mantine/core";
import nlp from 'compromise'

export default function Post() {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const [sentenceCount, setSentenceCount] = useState(0); // Estado para armazenar a contagem de frases
    const [wordCount, setWordCount] = useState(0); // Estado para armazenar a contagem de palavras
    const [letterCount, setLetterCount] = useState(0); // Estado para armazenar a contagem de letras
    const [loading, setLoading] = useState(true);
    const [redacao, setRedacao] = useState({}); // Estado para armazenar os dados da redação
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
        // Verifique se há um ID de documento válido
        if (id) {
            // Crie uma referência ao documento da redação no Firestore
            const redacaoRef = doc(db, "redacoes", id);

            // Busque os dados do documento
            getDoc(redacaoRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        // Se o documento existe, obtenha o texto e o ID da redação
                        const redacaoData = docSnap.data();

                        // Verifique se o ID do usuário atual é igual ao ID na redação
                        if (currentUser && currentUser.uid === redacaoData.id) {
                            const redacaoComId = {
                                id: docSnap.id,
                                text: redacaoData.text,
                                status: redacaoData.status,
                                timestamp: redacaoData.timestamp.toDate().toLocaleDateString(),
                            };
                            setRedacao(redacaoComId); // Armazena os dados da redação no estado
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
    }, [id, currentUser]); // Execute esta função quando o ID da rota ou o currentUser mudar

    useEffect(() => {
        // Verifique se há um texto de redação válido
        if (redacao.text) {
            // Use a biblioteca compromise para analisar o texto
            const doc = nlp(redacao.text);

            // Extraia as frases do texto
            const sentences = doc.sentences().out("array");

            // Extraia as palavras do texto
            const words = redacao.text.split(/\s+/);

            // Calcule a contagem de letras (removendo espaços)
            const letters = redacao.text.replace(/\s/g, "");

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
                <ScrollArea h={'50vh'}>
                    <Text style={{ whiteSpace: 'pre-wrap' }} fw={500} mr={50} ml={5} my={5}>{redacao.text}</Text>
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
