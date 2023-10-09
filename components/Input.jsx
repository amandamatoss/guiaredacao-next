import { useEffect, useState } from "react";
import { Textarea, Button, Stepper, Group, Select } from "@mantine/core";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "./../atom/userAtom";

export default function Input() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const auth = getAuth();

  const [currentUser] = useRecoilState(userState);
  const [inputValue, setInputValue] = useState("");
  const [selectedTema, setSelectedTema] = useState(""); // Estado para armazenar o tema selecionado
  const [temas, setTemas] = useState([]); // Estado para armazenar os temas do banco de dados

  const fetchTemas = async () => {
    const temasCollection = collection(db, "temas");
    const temasSnapshot = await getDocs(temasCollection);
    const temasData = temasSnapshot.docs.map((doc) => doc.data());
    setTemas(temasData);
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  const sendPost = async () => {
    // Adicione o documento à coleção "redacoes" com os dados necessários
    await addDoc(collection(db, "redacoes"), {
      id: currentUser.uid,
      text: inputValue,
      tema: selectedTema, 
      timestamp: serverTimestamp(),
      name: currentUser.name,
      status: false,
      avaliacao: "",
    });

    // Limpe o estado da redação e do tema após o envio
    setInputValue("");
    setSelectedTema("");
  };

  // Função para verificar se ambas as etapas foram passadas
  const areBothStepsPassed = active === 2;

  return (
    <div>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Primeiro passo" description="Escolha o tema">
        <select
            value={selectedTema}
            onChange={(e) => setSelectedTema(e.target.value)}
          >
            <option value="" disabled>
              Escolha o tema da sua redação
            </option>
            {temas.map((tema) => (
              <option key={tema.id} value={tema.nome}>
                {tema.nome}
              </option>
            ))}
          </select>
        </Stepper.Step>
        <Stepper.Step label="Segundo passo" description="Escreva sua redação">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>Voltar</Button>
        <Button onClick={areBothStepsPassed ? sendPost : nextStep} disabled={!selectedTema.trim()}>
          {areBothStepsPassed ? "Enviar" : "Proximo"}
        </Button>
      </Group>
    </div>
  );
}
