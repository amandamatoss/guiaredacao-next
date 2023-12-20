import { Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from '../styles/PrimaryContainer.module.css';
import Landing from '../public/landing.svg'
import Image from 'next/image'

export default function HeroBullets() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>Plataforma</span> que <br /> vai otimizar seus estudos sobre redação!
          </Title>
          <Text c="dimmed" mt="md">
            Mudar subtitulo  Mudar subtitulo  Mudar subtitulo  Mudar subtitulo  Mudar subtitulo Mudar subtitulo Mudar subtitulo Mudar subtitulo Mudar subtitulo Mudar subtitulo Mudar subtitulo
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl" color='#144003'>
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Sem burocracia</b> – Assim que criar sua conta já pode começar a usar a plataforma
            </List.Item>
            <List.Item>
              <b>Rapidez e eficiência</b> – Sabemos que você tem pressa, por isso nos adiantamos
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control} color='#144003'>
              Comece agora
            </Button>
            <Button variant="default" radius="xl" size="md" className={classes.control}>
              Saber mais
            </Button>
          </Group>
        </div>
        <Image src={Landing} className={classes.image} />
      </div>
    </Container>
  );
}