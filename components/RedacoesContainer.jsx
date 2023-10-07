import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Redacoes from "./Redacoes";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "./../atom/userAtom";

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
    <div>
      {redacoes.map((redacao) => (
        <Redacoes key={redacao.id} redacao={redacao} />
      ))}
    </div>
  );
}

