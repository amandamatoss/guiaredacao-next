import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userState } from "../../../atom/userAtom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from "../../../styles/id.module.css";
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Divider,
    ScrollArea,
    Text,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Accordion } from "@mantine/core";

export default function Post() {
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const [loading, setLoading] = useState(true);
    const [redacao, setRedacao] = useState({});
    const [avaliarClicked, setAvaliarClicked] = useState(false);
    const [avaliacao, setAvaliacao] = useState("");
    const [notasAv, setNotasAv] = useState([null, null, null, null, null]);
    const competenciaValores = [0, 40, 80, 120, 160, 200];

    const auth = getAuth();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchUser = async () => {
                    const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCurrentUser(docSnap.data());
                    }
                    setLoading(false);
                };
                fetchUser();
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (id) {
            const redacaoRef = doc(db, "redacoes", id);

            getDoc(redacaoRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const redacaoData = docSnap.data();
                        const redacaoComId = {
                            id: docSnap.id,
                            text: redacaoData.text,
                            status: redacaoData.status,
                            timestamp: redacaoData.timestamp.toDate().toLocaleDateString(),
                            tema: redacaoData.tema,
                            notas: redacaoData.notas,
                        };
                        setRedacao(redacaoComId);
                    } else {
                        console.log("O documento da redação não foi encontrado.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar o documento da redação:", error);
                });
        }
    }, [id]);

    const AvaliarClick = () => {
        setAvaliarClicked(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const redacaoRef = doc(db, "redacoes", id);

        try {
            await updateDoc(redacaoRef, {
                avaliacao: avaliacao,
                notas: notasAv,
                status: true, // Marque a redação como avaliada
            });
            setAvaliarClicked(false)
            router.reload()
        } catch (error) {
            console.error("Erro ao atualizar o documento da redação:", error);
        }
    };


    const handleNotaChange = (e, index) => {
        const newNotas = [...notasAv];
        newNotas[index] = parseInt(e.target.value, 10);
        setNotasAv(newNotas);
    };


    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!currentUser) {
        return <p>Você não tem permissão para acessar este arquivo.</p>;
    }

    return (
        <div className={styles.container}>
            <ActionIcon
                style={{
                    borderRadius: "15px",
                    position: "absolute",
                    top: "0",
                    left: "0",
                }}
                variant="default"
                size="xl"
                m={5}
                onClick={() => router.push("/admin/dashboard")}
            >
                <IconArrowLeft />
            </ActionIcon>
            <div className={styles.containerText}>
                {/* Por tema da redação */}
                <ScrollArea h={"50vh"}>
                    <Box
                        style={{
                            maxWidth: "100%",
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                            margin: "10px",
                        }}
                    >
                        {redacao.text}
                    </Box>
                </ScrollArea>
            </div>
            <div className={styles.containerInfo}>
                {avaliarClicked ? (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Avaliação"
                                value={avaliacao}
                                onChange={(e) => setAvaliacao(e.target.value)}
                            />
                            <div>
                                {[1, 2, 3, 4, 5].map((competencia, index) => (
                                    <div key={index}>
                                        <label>Competência {competencia}</label>
                                        <select
                                            value={notasAv[index]}
                                            onChange={(e) => handleNotaChange(e, index)}
                                        >
                                            {competenciaValores.map((valor) => (
                                                <option key={valor} value={valor}>
                                                    {valor}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <button type="submit">Salvar Avaliação</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className={styles.dateAndStatusGroup}>
                            <Text fw={600}>{redacao.timestamp}</Text>
                            {redacao.status === false ? (
                                <Badge color="gray" variant="light">
                                    Não avaliada
                                </Badge>
                            ) : (
                                <Badge color="green" variant="light">
                                    Avaliada
                                </Badge>
                            )}
                        </div>
                        {redacao.notas && redacao.notas.length > 0 && (
                            <div>
                                <Divider my="sm"/>
                                <Text>Sua nota</Text>
                                <Text
                                    fw={800}
                                    size="22px"
                                    ml={5}
                                    display="flex"
                                    style={{ alignItems: "end" }}
                                >
                                    <Text fw={800} size="36px">
                                        {redacao.notas.reduce((acc, nota) => acc + nota, 0)}
                                    </Text>
                                    /1000
                                </Text>
                            </div>
                        )}
                        <Divider my="sm"/>
                        <div style={{ width: "100%"}}>
                            <Accordion>
                                <Accordion.Item label="Accordion Item 1" value="instrucoes">
                                    <Accordion.Control>Notas por competência</Accordion.Control>
                                    <Accordion.Panel>
                                        <Box style={{ backgroundColor: '#f1efe8', borderRadius: '10px', padding: '5px'}}>
                                        {redacao.notas && redacao.notas.length > 0 ? (
                                            redacao.notas.map((nota, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        gap: "10px",
                                                        marginLeft: "10px",
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 600 }}>
                                                        Competência {index + 1}
                                                    </span>
                                                    <span>{nota}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <Text>Você ainda não avaliou essa redação.</Text>
                                        )}
                                        </Box>
                                    </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item label="Accordion Item 2" value="motivador">
                                    <Accordion.Control>Informações da redação</Accordion.Control>
                                    <Accordion.Panel>
                                        <Box
                                            style={{
                                                backgroundColor: "#f1efe8",
                                                padding: "10px",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            <Text fw={400} size="16px">
                                                Tema: {redacao.tema}
                                            </Text>
                                            <Text>Exemplo:</Text>
                                            <Text>Exemplo:</Text>
                                        </Box>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </div>
                )}
                {avaliarClicked ? null : <Button onClick={AvaliarClick}>Avaliar</Button>}
            </div>

        </div>
    );
}
