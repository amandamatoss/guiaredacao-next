import { Button, Text } from "@mantine/core";
import styles from "../styles/NavbarItens.module.css";
import {
  IconDashboard,
  IconFileDescription,
  IconGraph,
} from "@tabler/icons-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { userState } from "../atom/userAtom";
import { db } from "../firebase";
import { useRouter } from "next/router";

export default function NavbarItens({ setSelectedOption }) {

  // 

  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const auth = getAuth();
  const router = useRouter()
  //
  console.log(currentUser);

  // 

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  function onSignOut() {
    signOut(auth);
    setCurrentUser(null);
    router.push("/");
  }

  return (
    <div className={styles.container}>
      <ul>
        <li onClick={() => handleOptionChange('inicio')}>
          <IconDashboard />
          <Text fw={600}>Inicio</Text>
        </li>
      </ul>
      <ul>
        <li onClick={() => handleOptionChange('redacoes')}>
          <IconFileDescription />
          <Text fw={600}>Redações</Text>
        </li>
      </ul>
      <ul>
        <li onClick={() => handleOptionChange('evolucao')}>
          <IconGraph />
          <Text fw={600}>Evolução</Text>
        </li>
      </ul>
      <ul>
        <li onClick={onSignOut}>
          <IconGraph />
          <Text fw={600}>Log out</Text>
        </li>
      </ul>
    </div>
  );
}
