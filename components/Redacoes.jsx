import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  Loader,
  Flex,
  Box,
  Divider,
} from "@mantine/core";
import { useRouter } from "next/router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function Redacoes({ redacao, currentUser }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Função para pegar o ID do documento
  async function getDocumentId() {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "redacoes"),
        where("timestamp", "==", redacao.timestamp)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const documentId = doc.id;
        router.push(`/aluno/redacoes/${documentId}`)
      }
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card padding="md" radius="md" withBorder maw={280}>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {redacao.status === false ? (
          <Badge color="gray" variant="filled" radius="sm" size="lg" ml={5}>
            Não avaliada
          </Badge>
        ) : (
          <Badge color="green" variant="filled" radius="sm" size="lg" ml={5}>
            Avaliada
          </Badge>
        )}

        <Text
          lineClamp={3}
          my={5}
          fw={600}
          size="22px"
          mb={144}
          style={{ wordBreak: "break-word" }}
        >
          {redacao.text}
        </Text>
      </Box>

      <Divider my="sm"></Divider>

      {isLoading ? (
        <Flex justify="center">
          <Loader size="sm" />
        </Flex>
      ) : (
        <Button
          variant="transparent"
          color="grey"
          fullWidth
          radius="md"
          onClick={getDocumentId}
        >
          Mais detalhes
        </Button>
      )}
    </Card>
  );
}
