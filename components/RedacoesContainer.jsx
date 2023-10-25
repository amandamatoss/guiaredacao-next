import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Redacoes from "./Redacoes";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { Button, Text } from "@mantine/core";
import styles from '../styles/RedacoesContainer.module.css';
import { useSession } from 'next-auth/react'

export default function RedacoesContainer() {
    const { data: session } =  useSession()
    const [redacoes, setRedacoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let isAdmin = false

    useEffect(() => {
        const fetchUserIsAdmin = async () => {
            if (session) {
                try {
                    const userDocRef = doc(db, "users", session.user.email);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        // Verifique se o documento do usuário existe
                        const userData = userDocSnapshot.data();
                        isAdmin = userData.isAdmin; // Acesse o campo "isAdmin"
                    }
                } catch (error) {
                    console.error("Erro ao buscar informações de usuário:", error);
                }
            }

            setIsLoading(false);
        };

        fetchUserIsAdmin(); // Chame a função para buscar isAdmin assim que a sessão estiver pronta
    }, [session]);

    useEffect(() => {
        let unsubscribe;

        if (isAdmin) {
            // Se for administrador, busca todas as redações
            unsubscribe = onSnapshot(
                query(collection(db, "redacoes"), orderBy("timestamp", "desc")),
                (snapshot) => {
                    setRedacoes(snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })));
                    setIsLoading(false); 
                }
            );
        } else {
            // Se não for administrador, busca apenas as redações do usuário atual
            unsubscribe = onSnapshot(
                query(collection(db, "redacoes"), where("email", "==", session.user.email), orderBy("timestamp", "desc")),
                (snapshot) => {
                    setRedacoes(snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })));
                    setIsLoading(false); 
                }
            );
        }

        return () => unsubscribe(); 
    }, [session, isAdmin]);

    return (
        <>
            {isLoading ? ( 
                <div className={styles.loading}>
                    <Text>Loading...</Text> {/* Mudar depois */}
                </div>
            ) : (
                <div className={styles.containerCard}>
                    {redacoes.length === 0 ? (
                        <div>
                            <Text>Vamos começar a trilha do sucesso? O GUIA vai te acompanhar.</Text>
                        </div>
                    ) : (
                        redacoes.map((redacao) => (
                            <Redacoes key={redacao.id} redacao={redacao} session={session}/>
                        ))
                    )}
                </div>
            )}
        </>
    );
}
