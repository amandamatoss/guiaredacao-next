import { Container, Grid, Image, Paper, RingProgress, Skeleton, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';

export default function Inicio({ session, mediaNotasRedacoes, notasRedacoes }) {
    const child = <Skeleton height={140} radius="md" animate={false} />;
    const [temas, setTemas] = useState([]);

    const fetchTemas = async () => {
        const temasCollection = collection(db, "temas");
        const temasSnapshot = await getDocs(temasCollection);
        const temasData = temasSnapshot.docs.map((doc) => doc.data());
        setTemas(temasData);
    };

    useEffect(() => {
        fetchTemas();
    }, []);

    const mappedMedia = mediaNotasRedacoes / 10;

    return (
        <Container size='xl'>
            <Grid>
                <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 8 }}>
                    <Paper withBorder h={'100%'} p={15} radius="md">
                    <Text fw={800}>Seja bem-vindo, {session?.user.name.trim().split(" ")[0].charAt(0).toUpperCase() + session?.user.name.trim().split(" ")[0].slice(1)} 😁</Text>
                        {notasRedacoes.length === 0 ? (
                            <Text>Escreva sua primeira redação conosco. Escolha o tema da sua preferência, escreva e deixe que o GUIA resolve o resto!</Text>
                        ) : (
                            <Text>Vamos praticar a sua redação? Escolha o tema da sua preferência, escreva e deixe que o GUIA resolve o resto!</Text>
                        )}
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 4 }} style={{ height: '200px'}}>
                    <Carousel
                        withIndicators
                        loop
                        style={{
                            border: '1px solid transparent',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            height: '100%',
                            flex: 1,
                        }}
                    >
                        {temas.map((tema, index) => (
                            <Carousel.Slide key={index}>
                                    <Image src={tema.image} style={{
                                        filter: 'brightness(45%)',
                                        height: '100%',
                                        width: '100%',
                                    }} />
                                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                        <Text size="md" c="gray">Temas Disponíveis</Text>
                                        <Text size="sm" c="white">{tema.nome}</Text>
                                    </div>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 4, md: 4 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 4, md: 4 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 4, md: 4 }}>
                    <Paper
                        withBorder
                        p={15}
                        radius="md"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text fw={600} style={{ textAlign: 'center' }}>Média das suas redações</Text>
                        <RingProgress
                            roundCaps
                            sections={[{ value: mappedMedia, color: 'green' }]}
                            label={
                                <Text fw={700} ta="center" size="xl">
                                    {mediaNotasRedacoes}
                                </Text>
                            }
                        />
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 4 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 8 }}>{child}</Grid.Col>
            </Grid>
        </Container>
    )
}
