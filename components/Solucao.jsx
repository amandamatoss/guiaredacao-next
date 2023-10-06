import { Container, Text, Center, SimpleGrid, Box } from "@mantine/core";
import styles from "../styles/Solucao.module.css";
import { useTypewriter } from "react-simple-typewriter";

export default function Solucao() {
  const [texto] = useTypewriter({
    words: ["A solução que você precisava para seus estudos! 🎉"],
    typeSpeed: 70,
  });

  return (
    <div className={styles.containerGrid}>

      <div className={}> 

      </div>
      <div>

      </div>

    </div>
  );
}
