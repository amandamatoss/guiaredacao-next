import { Button, Text } from "@mantine/core";
import styles from "../styles/NavbarItens.module.css";
import {
  IconDashboard,
  IconFileDescription,
  IconGraph,
} from "@tabler/icons-react";

export default function NavbarItens({ setSelectedOption }) {

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.container}>
      <ul>
        <li onClick={() => handleOptionChange('inicio')}>
          <IconDashboard />
          <Text fw={600}>Inicio</Text>
        </li>
      </ul>
      <ul>
        <li onClick={() => handleOptionChange('redacoes')}>
          <IconFileDescription />
          <Text fw={600}>Redações</Text>
        </li>
      </ul>
      <ul>
        <li onClick={() => handleOptionChange('evolucao')}>
          <IconGraph />
          <Text fw={600}>Evolução</Text>
        </li>
      </ul>
    </div>
  );
}
