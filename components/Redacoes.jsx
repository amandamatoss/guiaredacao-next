import { Card, Text, Badge, Button, Group } from "@mantine/core";
import { useRouter } from "next/router";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';

export default function Redacoes({ redacao }) {
  const router = useRouter();

  // Função para pegar o ID do documento
  async function getDocumentId() {
    try {
      const q = query(collection(db, 'redacoes'), where("timestamp", "==", redacao.timestamp));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const documentId = doc.id; // Pega o ID do documento Firestore
        console.log('ID do Documento:', documentId);

        // Navega para a página de detalhes com o ID do documento como parâmetro
        router.push(`/aluno/redacoes/${documentId}`);
      }
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
    }
  }

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder maw={250}>
      <Card.Section>
        {/*  */}
      </Card.Section>

      <Group mt="md" mb="xs">
        <Text fw={400}>{redacao.timestamp ? redacao.timestamp.toDate().toLocaleDateString() : "..."}</Text>
      </Group>

      {redacao.status === null ? (
        <Badge color="gray" variant="light">
          Não avaliada
        </Badge>
      ) : (
        <Badge color="green" variant="light">
          Avaliada
        </Badge>
      )}

      <Text size="sm" c="dimmed" lineClamp={3} my={5}>
        {redacao.text}
      </Text>

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={getDocumentId}
      >
        Mais detalhes
      </Button>
    </Card>
  );
}
