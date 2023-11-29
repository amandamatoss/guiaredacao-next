import { Button, Text } from "@mantine/core";
import { useRouter } from "next/router";

export default function ErrorPage() {

    const router = useRouter()
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Text size="xl">404 - Página não encontrada</Text>
      <Button onClick={() => router.push('/')}>Voltar a pagina inicial</Button>
    </div>
  );
}