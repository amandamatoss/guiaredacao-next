import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Redacoes from "./Redacoes";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "./../atom/userAtom";
import { Button, Text } from "@mantine/core";
import styles from '../styles/RedacoesContainer.module.css'

export default function RedacoesContainer() {

    const auth = getAuth();
    const [currentUser] = useRecoilState(userState);
    const [redacoes, setRedacoes] = useState([]);
    const currentUserUid = currentUser.uid

  useEffect(() =>
    onSnapshot(
      query(collection(db, "redacoes"), where("id", "==", currentUserUid), orderBy("timestamp", "desc")),
      (snapshot) => {
        setRedacoes(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Pega todos os dados do documento
        })));
      }
    ), []
  );

  return (
    <>
    <Text fw={800} size={'24px'} ml={20}>Minhas redações</Text>
    <div className={styles.containerCard}>
      {redacoes.map((redacao) => (
        <Redacoes key={redacao.id} redacao={redacao} />
      ))}
    </div>
    </>
  );
}

