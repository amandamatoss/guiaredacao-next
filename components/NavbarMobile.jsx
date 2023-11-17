import { Box, Grid } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconChartBar, IconFileDescription, IconHome } from "@tabler/icons-react";

export default function NavbarMobile({ setSelectedOption, selectedOption}) {

    const { hovered, ref } = useHover();

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <Grid grow style={{ position: 'fixed', bottom: 0, zIndex: 1000, width: '100%', backgroundColor: 'white'}}>
            <Grid.Col align="center" span={4} onClick={(e) => handleOptionChange('inicio')} style={{ backgroundColor: selectedOption === "inicio" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0', borderRight: '1px solid grey'}}>
                <Box>
                    <IconHome size={20} style={{ color: selectedOption === "inicio" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
            <Grid.Col align="center" span={4} onClick={(e) => handleOptionChange('redacoes')} style={{ backgroundColor: selectedOption === "redacoes" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0', borderRight: '1px solid grey'}}>
                <Box>
                    <IconFileDescription size={20} style={{ color: selectedOption === "redacoes" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
            <Grid.Col align="center" span={4} onClick={(e) => handleOptionChange('evolucao')} style={{ backgroundColor: selectedOption === "evolucao" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0', borderRight: '1px solid grey'}}>
                <Box>
                    <IconChartBar size={20} style={{ color: selectedOption === "evolucao" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
            <Grid.Col align="center" span={4} onClick={(e) => handleOptionChange('agendamento')} style={{ backgroundColor: selectedOption === "agendamento" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0'}}>
                <Box>
                    <IconChartBar size={20} style={{ color: selectedOption === "agendamento" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
        </Grid>
    );
}
