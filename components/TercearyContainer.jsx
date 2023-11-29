import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { IconGauge, IconUser, IconCookie } from "@tabler/icons-react";
import classes from "../styles/TercearyContainer.module.css";
import { IconCircleCheck } from '@tabler/icons-react';

export default function TercearyContainer() {
  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Temos os melhores <span>planos</span> para você!
      </Title>

      <div className={classes.containerCards}>
      <Card shadow="md" radius="md" className={classes.card} padding="xl">
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">Básico</Text>
        <Text fw={500} size="36px">R$ 9.99</Text>
        <Text fz="sm" c="dimmed" mt="sm"></Text>
        <Button  variant="transparent" color="#ffffff" className={classes.button}>
            Assinar plano
          </Button>
          <Text fw={500} size="13px" mt={20}> CARACTERÍSTICAS</Text>
          <Text size="10px" mt="8px">Tudo no plano básico</Text>
          <div className={classes.divCaracteristicas}>
          <IconCircleCheck style={{color: "#144003", marginTop: "10px"}}/>
          <Text mt={10} ml={5}>hwquihweuvbwv</Text>
          </div>
          <div className={classes.divCaracteristicas} >
          <IconCircleCheck style={{color: "#144003", marginTop: "10px"}}/>
           <Text mt={10} ml={5}>vwohviwbvkja</Text>
          </div>
          <div className={classes.divCaracteristicas} >
          <IconCircleCheck style={{color: "#144003", marginTop: "10px"}}/>
          <Text mt={10} ml={5}>ljanvjkabah</Text>
          </div>
      </Card>

      <Card shadow="md" radius="md" className={classes.card} padding="xl">
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">Padrão</Text>
        <Text fw={500} size="36px"> R$ 29.99</Text>
        <Text fz="sm" c="dimmed" mt="sm"></Text>
        <Button  variant="transparent" color="#144003" className={classes.button}>
        Assinar plano
          </Button>
          <Text fw={500} size="13px" mt={20}> CARACTERÍSTICAS</Text>
          <Text size="10px" mt="8px">Tudo no plano premium</Text>
          <div className={classes.divCaracteristicas}>
          <IconCircleCheck style={{color: "#ffffff", marginTop: "10px"}}/>
          <Text mt={10} ml={5}>hwquihweuvbwv</Text>
          </div>
          <div className={classes.divCaracteristicas}>
          <IconCircleCheck style={{color: "#ffffff", marginTop: "10px"}}/>
           <Text mt={10} ml={5}>vwohviwbvkja</Text>
          </div>
          <div className={classes.divCaracteristicas}>
          <IconCircleCheck style={{color: "#ffffff", marginTop: "10px"}}/>
          <Text mt={10} ml={5}>ljanvjkabah</Text>
          </div>
          
      </Card>

      <Card shadow="md" radius="md" className={classes.card} padding="xl">
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">Premium</Text>
        <Text fw={500} size="36px"> R$ 49.99</Text>
        <Text fz="sm" c="dimmed" mt="sm"></Text>
        <Button  variant="transparent" color="#ffffff" className={classes.button}>
        Assinar plano
          </Button>
          <Text fw={500} size="13px" mt={20}> CARACTERÍSTICAS</Text>
          <Text size="10px" mt="8px">Tudo no plano padrão</Text>

          <div className={classes.divCaracteristicas}>
          <IconCircleCheck style={{color: "#144003", marginTop: "10px"}}/>
          <Text mt={10} ml={5}>hwquihweuvbwv</Text>
          </div>
          <div className={classes.divCaracteristicas}>
          <IconCircleCheck style={{color: "#144003", marginTop: "10px"}}/>
           <Text mt={10} ml={5}>vwohviwbvkja</Text>
          </div>
          <div className={classes.divCaracteristicas}>
          <IconCircleCheck style={{color: "#144003", marginTop: "10px"}}/>
          <Text mt={10} ml={5}>ljanvjkabah</Text>
          </div>
          
      </Card>
      </div>

         
        
    </Container>
    
  );
}
