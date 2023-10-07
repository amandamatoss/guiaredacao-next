import { useEffect, useState } from "react";
import { Textarea, Button } from "@mantine/core";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "./../atom/userAtom";

export default function Input() {

const auth = getAuth();

  const [currentUser] = useRecoilState(userState);
  const [inputValue, setInputValue] = useState("");
  console.log(currentUser);
  console.log(inputValue);

  const sendPost = async () => {

    const docRef = await addDoc(collection(db, "redacoes"), {
      id: currentUser.uid,
      text: inputValue,
      timestamp: serverTimestamp(),
      name: currentUser.name,
    });

  };

  return (
    <div>

      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={sendPost} disabled={!inputValue.trim()}>
        submit
      </Button>

    </div>
  );
}
