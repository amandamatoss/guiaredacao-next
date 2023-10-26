import React, { useEffect, useState } from "react";
import {
  Textarea,
  Button,
  Stepper,
  Group,
  Select,
  Text,
  Box,
  Paper,
  Divider,
} from "@mantine/core"; // Certifique-se de importar o componente 'Select' de Mantine
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import compromise from "compromise";
import { useMediaQuery } from "@mantine/hooks";
import { Accordion } from "@mantine/core";
import { useSession } from "next-auth/react";

export default function Input({ isOpen, close }) {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const { data: session } = useSession()

  const [inputValue, setInputValue] = useState("");
  const [selectedTema, setSelectedTema] = useState("");
  const [temas, setTemas] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const fetchTemas = async () => {
    const temasCollection = collection(db, "temas");
    const temasSnapshot = await getDocs(temasCollection);
    const temasData = temasSnapshot.docs.map((doc) => doc.data());
    setTemas(temasData);
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  useEffect(() => {
    const formattedData = temas.map((tema) => ({
      label: tema.nome,
      value: tema.nome,
    }));
    setSelectData(formattedData);
  }, [temas]);

  const analyzeText = (text) => {
    const doc = compromise(text);

    const characterCount = text.length;

    const sentences = doc.sentences().out("array");

    const paragraphCount = text.trim() === "" ? 0 : text.split("\n").length;

    const words = text.trim() === "" ? [] : text.split(/\s+/);
    const wordCount = words.length;

    setCharacterCount(characterCount);
    setSentenceCount(sentences.length);
    setParagraphCount(paragraphCount);
    setWordCount(wordCount);
  };

  useEffect(() => {
    analyzeText(inputValue);
  }, [inputValue]);

  const sendPost = async () => {
    if (inputValue.length < 300) {
      alert("A redação deve conter pelo menos 300 caracteres.");
      return;
    }

    await addDoc(collection(db, "redacoes"), {
      id: session.user.id,
      text: inputValue,
      tema: selectedTema,
      timestamp: serverTimestamp(),
      name: session.user.name,
      status: false,
      avaliacao: "",
      email: session.user.email,
    });

    setInputValue("");
    setSelectedTema("");
    close();
  };

  const isMobile = useMediaQuery("(max-width: 576px)");

  const areBothStepsPassed = active === 2;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Stepper
        style={{ width: "90%" }}
        orientation={isMobile ? "vertical" : "horizontal"}
        active={active}
        onStepClick={setActive}
        color="green"
      >
        <Stepper.Step label="Primeiro passo" description="Escolha o tema">
          <Select
            value={selectedTema}
            onChange={(value) => setSelectedTema(value)}
            label="Qual o tema de hoje?"
            placeholder="Escolha o tema da sua preferência"
            data={selectData}
          />
        </Stepper.Step>
        <Stepper.Step label="Segundo passo" description="Escreva sua redação">
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "0.3fr 0.7fr",
              gap: "64px",
              justifyContent: "center",
            }}
          >
            <Paper
              my={5}
              style={{
                border: "1px solid black",
                borderRadius: "10px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Text fw={800} size="24px">
                Tema escolhido
              </Text>
              <Text fw={800} size="30px">{selectedTema}</Text>
              <Divider />
              <Box>
                <Accordion>
                  <Accordion.Item label="Accordion Item 1" value="instrucoes">
                    <Accordion.Control>Instruções</Accordion.Control>
                    <Accordion.Panel>
                      Instruções para serem criadas
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item label="Accordion Item 2" value="motivador">
                    <Accordion.Control>Textos motivadores</Accordion.Control>
                    <Accordion.Panel>
                      {temas.find((tema) => tema.nome === selectedTema)?.motivador}
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Box>
            </Paper>
            <Box>
              <Text fw={800} mb={5}>
                Sua redação
              </Text>
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                variant="unstyled"
                autosize
                minRows={20}
                maxRows={20}
                style={{
                  width: "100%",
                  border: "1px solid black",
                  borderRadius: "10px",
                }}
                placeholder="Digite sua redação"
                pl={10}
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
              />
              {active === 1 && inputValue.length < 300 && (
                <Text mt={2} c="gray" align="end">
                  Mínimo de 300 caracteres.
                </Text>
              )}
            </Box>
          </Box>
        </Stepper.Step>
        <Stepper.Completed>
          <Text fw={500} align="center">
            Tudo pronto, podemos enviar sua redação?
          </Text>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Voltar
        </Button>
        <Button
          color="green"
          onClick={areBothStepsPassed ? sendPost : nextStep}
          disabled={
            !selectedTema ||
            (active === 1 && (inputValue.length < 300 || !inputValue.trim()))
          }
        >
          {areBothStepsPassed ? "Enviar" : "Próximo"}
        </Button>
      </Group>
    </div>
  );
}
