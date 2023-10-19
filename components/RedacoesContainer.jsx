import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Redacoes from "./Redacoes";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "./../atom/userAtom";
import { Button, Text } from "@mantine/core";
import styles from '../styles/RedacoesContainer.module.css';

export default function RedacoesContainer() {

    const auth = getAuth();
    const [currentUser] = useRecoilState(userState);
    const [redacoes, setRedacoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const currentUserUid = currentUser.uid;

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "redacoes"), where("id", "==", currentUserUid), orderBy("timestamp", "desc")),
            (snapshot) => {
                setRedacoes(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })));
                setIsLoading(false); 
            }
        );

        return () => unsubscribe(); 
    }, []);

    return (
        <>
            {isLoading ? ( 
                <div className={styles.loading}>
                    <Text>Loading...</Text> {/* Mudar depois */}
                </div>
            ) : (
                <div className={styles.containerCard}>
                    {redacoes.length === 0 ? (
                        <div className={styles.noRedacoes}>
                            <Text>Vamos começar a trilha do sucesso? O GUIA vai te acompanhar.</Text>
                        </div>
                    ) : (
                        redacoes.map((redacao) => (
                            <Redacoes key={redacao.id} redacao={redacao} />
                        ))
                    )}
                </div>
            )}
        </>
    );
}
