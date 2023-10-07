import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";

export default function Redacoes({ redacao }) {

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

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Mais detalhes
      </Button>
    </Card>
  );
}
