import {
  Card,
  Text,
  Badge,
  Button,
  Loader,
  Flex,
  Box,
  Divider,
  Modal,
  Group,
  Container,
  Grid,
} from "@mantine/core";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { useHover } from "@mantine/hooks";
import {
  IconAlignLeft,
  IconClockHour3,
  IconPencil,
  IconTrashX,
} from "@tabler/icons-react";

export default function Redacoes({ redacao }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notas, setNotas] = useState([]);
  const { hovered, ref } = useHover();

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
        router.push(`/aluno/redacoes/${documentId}`);
      }
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteClick() {
    setIsDeleteModalOpen(true); // Abre o modal de confirmação
  }

  async function handleConfirmDelete() {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "redacoes"),
        where("timestamp", "==", redacao.timestamp)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];

        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false); // Fecha o modal de confirmação após a exclusão
    }
  }

  return (
    <Card padding="md" radius="md" withBorder maw={300}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          gap: "10px",
          height: "100%",
        }}
        onClick={getDocumentId}
        ref={ref}
      >
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
          fw={400}
          size="18px"
          style={{ wordBreak: "break-word" }}
        >
          {redacao.text}
        </Text>

        
          <Group gap={6} style={{ display: "flex", alignItems: "flex-start" }}>
            <IconAlignLeft size={18} />
            <Text style={{ flex: "1" }}>{redacao.tema}</Text>
          </Group>
          <Group gap={4} style={{ display: "flex", alignItems: "center" }}>
            <IconPencil size={18} style={{ color: "green" }} />
            <Text>900</Text>
          </Group>
          <Group gap={4} style={{ display: "flex", alignItems: "flex-end" }}>
            <IconClockHour3 size={18} style={{ color: "green" }} />
            <Text>
              {redacao.timestamp?.toDate().toLocaleDateString()},{" "}
              {redacao.timestamp
                ?.toDate()
                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </Group>
        </Box>

      <Divider my="sm"></Divider>

      {isLoading ? (
        <Flex justify="center">
          <Loader size="sm" />
        </Flex>
      ) : (
        <>
          <Button
            variant="transparent"
            color="grey"
            radius="md"
            leftSection={<IconTrashX size={18} />}
            onClick={handleDeleteClick}
            ref={ref}
            style={{
              backgroundColor: hovered ? "gray" : "white",
              color: hovered ? "white" : "gray",
              transition: "0.3s",
            }}
          >
            Excluir
          </Button>
          <Modal
            title="Excluir sua redação?"
            opened={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            size="sm"
            centered
            transitionProps={{ transition: "fade", duration: 200 }}
          >
            <Box>
              <Text mb={15}>
                Tem certeza que quer excluir a sua redação permanentemente? Isso
                não poderá ser revertido!
              </Text>
              <Group justify="end">
                <Button
                  color="red"
                  onClick={handleConfirmDelete}
                  color="red"
                  variant="default"
                >
                  Confirmar
                </Button>
                <Button
                  variant="filled"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancelar
                </Button>
              </Group>
            </Box>
          </Modal>
        </>
      )}
    </Card>

  );
}
