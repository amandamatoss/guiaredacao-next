import { Card, Text, Badge, Button, Group, Loader, Flex } from "@mantine/core"; // Importe o componente Loader
import { useRouter } from "next/router";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';

export default function Redacoes({ redacao }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar a animação de carregamento

  // Função para pegar o ID do documento
  async function getDocumentId() {
    try {
      setIsLoading(true); // Ative a animação de carregamento

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
    } finally {
      setIsLoading(false); // Desative a animação de carregamento quando a operação estiver concluída
    }
  }

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder maw={250}>
      <Card.Section>
        {/* Conteúdo */}
      </Card.Section>

      <Group mt="md" mb="xs">
        <Text fw={400}>{redacao.timestamp ? redacao.timestamp.toDate().toLocaleDateString() : "..."}</Text>
      </Group>

      {redacao.status === false ? (
        <Badge color="rgba(31, 66, 19, 1)" variant="light">
          Não avaliada
        </Badge>
      ) : (
        <Badge color="rgba(31, 66, 19, 1)" variant="light">
          Avaliada
        </Badge>
      )}

      <Text size="sm" c="dimmed" lineClamp={3} my={5}>
        {redacao.text}
      </Text>

      {/* Renderize a animação de carregamento condicionalmente */}
      {isLoading ? (
        <Flex
        justify="center" // Centraliza o conteúdo verticalmente e horizontalmente
        >
        <Loader size="sm" />
        </Flex>
      ) : (
        <Button
          variant="light"
          color="#144003"
          fullWidth
          mt="md"
          radius="md"
          onClick={getDocumentId}
        >
          Mais detalhes
        </Button>
      )}
    </Card>
  );
}
