import { Container, Text, Center } from "@mantine/core";
import classes from "../styles/Solucao.module.css";
import { useTypewriter } from "react-simple-typewriter";

export default function Solucao() {
  const [texto] = useTypewriter({
    words: ["A solução que você precisava para seus estudos! 🎉"],
    typeSpeed: 70,
  });

  return (
   

    <Center>
      <Text size="60px">{texto}</Text>
      </Center>
  );
}
