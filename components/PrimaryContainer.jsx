import {
  Container,
  Text,
  Center,
  SimpleGrid,
  Box,
  Grid,
  Title,
  Group,
  Button,
} from "@mantine/core";
import styles from "../styles/PrimaryContainer.module.css";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

export default function PrimaryContainer() {
  return (
    <div className={styles.container}>
      <div className={styles.containerBox}>

        {/* Mobile */}

        <Box hiddenFrom="sm">
          <Title
            order={3}
            fw={900}
            size={32}
            style={{ width: "20ch" }}
          >
            A{" "}
            <Text
              span
              c="blue"
              inherit
              fw={900}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
            >
              ferramenta ideal
            </Text>{" "}
            <br />
            para aprimorar suas habilidades em redação!
          </Title>

          <Text style={{ width: "40ch" }}>
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </Text>
        </Box>

        {/* Tablet / Desktop */}

        <Box visibleFrom="sm">
          <Title
            order={3}
            fw={800}
            size={48}
            style={{ width: "20ch" }}
          >
            A{" "}
            <Text
              span
              c="blue"
              inherit
              fw={800}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
            >
              ferramenta ideal
            </Text>{" "}
            <br />
            para aprimorar suas habilidades em redação!
          </Title>

        </Box>
        <Text style={{ width: "60ch" }}>
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </Text>
        <div className={styles.buttons}>
          <Button
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
            size="md"
            rightSection={<IconArrowRight size={18} />}
          >
            Começar Agora
          </Button>
          <Button size="md" variant="transparent">
            Já faço parte
          </Button>
        </div>
      </div>
      <div className={styles.containerImages}>
        <div className={styles.img1}>
          <img
            src="https://img.freepik.com/fotos-gratis/uma-sala-de-conferencias-com-uma-mesa-e-uma-parede-de-janelas-que-diz-o-escritorio_1340-37385.jpg?w=1380&t=st=1696627566~exp=1696628166~hmac=d236faafa4a3144b28a646c3a866130e4be4e900e61965ca3de00990b492e1c7"
            id="img1"
          />
        </div>
        <div className={styles.img2}>
          <div>
            <img
              src="https://img.freepik.com/fotos-gratis/interior-de-espaco-de-escritorio-moderno_158595-5206.jpg?w=1380&t=st=1696628066~exp=1696628666~hmac=b9c41758bfc14b6ee78dc21da495b268f00ced37bb8d03bef2bec1f6eeb421ad"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://img.freepik.com/fotos-gratis/restaurante-obscura-com-piso-de-madeira_1203-1440.jpg?w=1380&t=st=1696628089~exp=1696628689~hmac=ccaef8d874d9cbc95859e7bfebefa2488f072973e8ddd6fe7fc82ed27a015a9c"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
