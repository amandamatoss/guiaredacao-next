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
        <Container my="md">
            <Grid>
                <Grid.Col span={{ base: 12, xs: 4 }}>
                    <Paper withBorder h={'100%'} p={15} radius="md">
                        <Text fw={800}>Seja bem vindo, {session.user.name} 😁</Text>
                        <Text>Lorem ipsum, lkansdqda asdqdw,as sad sad,sa, d,w, da,sd,s,dqwdasda </Text>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 8 }}>
                    <Carousel
                        withIndicators
                        height={200}
                        draggable={false}
                        style={{
                            border: '1px solid transparent', 
                            borderRadius: '10px',
                            overflow: 'hidden' 
                        }}
                    >
                        {temas.map((tema, index) => (
                            <Carousel.Slide key={index}>
                                <div style={{ position: 'relative' }}>
                                    <Image src={tema.image} style={{
                                        filter: 'brightness(45%)',
                                    }} />
                                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                        <Text size="md" c="gray">Temas Disponíveis</Text>
                                        <Text size="sm" c="white">{tema.nome}</Text>
                                    </div>
                                </div>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 9 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>
                    <Paper
                        withBorder
                        h={'100%'}
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

                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>{child}</Grid.Col>
            </Grid>
        </Container>
    )
}
