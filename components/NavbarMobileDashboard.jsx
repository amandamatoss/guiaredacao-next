import { Box, Grid } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconAlignJustified, IconChartBar, IconFileDescription, IconFileStar } from "@tabler/icons-react";

export default function NavbarMobileDashboard({ setSelectedOption, selectedOption }) {

    const { hovered, ref } = useHover();

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <Grid grow style={{ position: 'fixed', bottom: 0, zIndex: 1000, width: '100%', backgroundColor: 'white', cursor: 'pointer'}}>
            <Grid.Col align="center" span={3} onClick={(e) => handleOptionChange('redacao')} style={{ backgroundColor: selectedOption === "redacao" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0', borderRight: '1px solid grey'}}>
                <Box>
                    <IconFileDescription size={20} style={{ color: selectedOption === "redacao" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
            <Grid.Col align="center" span={3} onClick={(e) => handleOptionChange('stats')} style={{ backgroundColor: selectedOption === "stats" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0', borderRight: '1px solid grey'}}>
                <Box>
                    <IconChartBar size={20} style={{ color: selectedOption === "stats" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
            <Grid.Col align="center" span={3} onClick={(e) => handleOptionChange('nota')} style={{ backgroundColor: selectedOption === "nota" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0', borderRight: '1px solid grey'}}>
                <Box>
                    <IconFileStar size={20} style={{ color: selectedOption === "nota" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
            <Grid.Col align="center" span={3} onClick={(e) => handleOptionChange('tema')} style={{ backgroundColor: selectedOption === "tema" ? 'rgba(211, 211, 211, 0.4)' : "transparent", padding: '20px 0 20px 0'}}>
                <Box>
                    <IconAlignJustified size={20} style={{ color: selectedOption === "tema" ? "green" : "inherit" }}/>
                </Box>
            </Grid.Col>
        </Grid>
    );
}
