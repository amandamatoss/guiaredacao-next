import React, { useState } from 'react';
import { Textarea, Button } from '@mantine/core';

function AvaliacaoInput({ onSave }) {
  const [value, setValue] = useState(""); // Inicialize o estado com uma string vazia

  const handleValueChange = (e) => {
    setValue(e.target.value);
    console.log(value)
  };

  const handleSaveEvaluation = () => {
    onSave(value); // Chame onSave com o valor atual de 'value'
  };

  return (
    <div>
      <Textarea
        value={value}
        onChange={handleValueChange}
        placeholder="Avaliação..."
      />
      <Button onClick={handleSaveEvaluation}>Salvar Avaliação</Button>
    </div>
  );
}

export default AvaliacaoInput;
