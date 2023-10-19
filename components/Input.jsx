import React, { useEffect, useState } from 'react';
import { Textarea, Button, Stepper, Group, Select, Text, Box, Accordion, Paper } from '@mantine/core'; // Certifique-se de importar o componente 'Select' de Mantine
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { userState } from './../atom/userAtom';
import compromise from 'compromise';
import { useMediaQuery } from '@mantine/hooks';
import styles from '../styles/Input.module.css'

export default function Input({ isOpen, close }) {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const auth = getAuth();

  const [currentUser] = useRecoilState(userState);
  const [inputValue, setInputValue] = useState('');
  const [selectedTema, setSelectedTema] = useState('');
  const [temas, setTemas] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const fetchTemas = async () => {
    const temasCollection = collection(db, 'temas');
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

    const sentences = doc.sentences().out('array');

    const paragraphCount = text.trim() === '' ? 0 : text.split('\n').length;

    const words = text.trim() === '' ? [] : text.split(/\s+/);
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
      alert('A redação deve conter pelo menos 300 caracteres.');
      return;
    }

    await addDoc(collection(db, 'redacoes'), {
      id: currentUser.uid,
      text: inputValue,
      tema: selectedTema,
      timestamp: serverTimestamp(),
      name: currentUser.name,
      status: false,
      avaliacao: '',
    });

    setInputValue('');
    setSelectedTema('');
    close();
  };


  const isMobile = useMediaQuery('(max-width: 576px)');

  const areBothStepsPassed = active === 2;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Stepper
        style={{ width: '90%' }}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        active={active}
        onStepClick={setActive}
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
          <Box style={{ display: 'grid', gridTemplateColumns: '0.3fr 0.7fr', gap: '64px', justifyContent: 'center' }}>
            <Paper>
              <Text fw={800} size='24px'>Informações</Text>
              <Box className='acordion'>

              </Box>
            </Paper>
            <Box>
              <Text>Sua redação</Text>
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autosize
                minRows={20}
                maxRows={20}
                style={{ width: '100%' }}
              />
              {active === 1 && inputValue.length < 300 && (
                <Text mt={2} color="gray" align="end">
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
          onClick={areBothStepsPassed ? sendPost : nextStep}
          disabled={
            !selectedTema.trim() ||
            (active === 1 && (inputValue.length < 300 || !inputValue.trim()))
          }
        >
          {areBothStepsPassed ? 'Enviar' : 'Próximo'}
        </Button>
      </Group>
    </div>
  );
}
