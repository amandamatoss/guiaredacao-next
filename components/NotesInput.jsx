import React, { useState } from 'react';
import { Button, Text } from '@mantine/core';

function NotesInput({ defaultNotes, onSave }) {
  const [notes, setNotes] = useState(defaultNotes);

  const handleNoteChange = (index, value) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  return (
    <div>
      <Text size="xl">Notas</Text>
      <div>
        {notes.map((note, index) => (
          <input
            key={index}
            type="number"
            value={note}
            onChange={(e) => handleNoteChange(index, parseInt(e.target.value))}
            min={20}
            max={200}
          />
        ))}
      </div>
    </div>
  );
}

export default NotesInput;
