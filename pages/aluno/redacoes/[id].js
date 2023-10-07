import { useRouter } from "next/router";
import RedacoesContainer from "../../../components/RedacoesContainer";
import { useRecoilState } from "recoil";
import { userState } from "../../../atom/userAtom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from '../../../styles/id.module.css'
import { ScrollArea } from "@mantine/core";

export default function Post() {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
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
                            };
                            setRedacao(redacaoComId); // Armazena os dados da redação no estado
                        } else {
                            console.log("Você não tem permissão para acessar esta redação.");
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

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!currentUser) {
        return <p>Você não tem permissão para acessar este arquivo.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerText}>
                <ScrollArea h={'97vh'} w={'70vh'}>
                    <h2 style={{ whiteSpace: "pre-wrap" }}>{redacao.text}</h2>
                </ScrollArea>
            </div>
            <div>

            </div>
        </div>
    );
}
