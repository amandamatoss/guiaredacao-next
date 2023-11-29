import { Image, Text, Container, ThemeIcon, Title, SimpleGrid } from '@mantine/core';
import classes from '../styles/SecondaryContainer.module.css';
import { IconTargetArrow } from '@tabler/icons-react';

const data = [
  {
    image: 'auditors',
    title: 'Preciso',
    description: 'Trabalhamos com pessoas reais para ter a maior precisão na sua correção.',
  },
  {
    image: 'lawyers',
    title: 'Acessível',
    description: ' Diversas opções de pagamento com um preço acessível que cabe no seu bolso.',
  },
  {
    image: 'accountants',
    title: 'Completa',
    description: 'Temos uma plataforma completa pra você acompanhar sua evolução.',
  },
  {
    image: <IconTargetArrow />,
    title: 'Others',
    description: 'Phanpy uses its long nose to shower itself',
  },
];

export default function SecondaryContainer() {
  const items = data.map((item) => (
    <div className={classes.item} key={item.image}>
      <ThemeIcon variant="filled" color="rgba(242, 255, 242, 1)" className={classes.itemIcon} size={60} radius="md">
        {item.image}
      </ThemeIcon>

      <div>
        <Text fw={700} fz="lg" className={classes.itemTitle}>
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={800} className={classes.wrapper}>
      <Title className={classes.title} >
      Que tal ver algumas de nossas <span>vantagens?</span>
      </Title>


    <div className={classes.ContainerVantagens}>
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
      </div>
    </Container>
  );
}