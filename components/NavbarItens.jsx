import { Box, Divider, Stack, Text } from "@mantine/core";
import { IconCalendarEvent, IconChartBar, IconDashboard, IconFileDescription, IconPencil } from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";

export default function NavbarItens({ setSelectedOption , selectedOption, openModal, sidebarCollapsed }) {
  const { hovered, ref } = useHover();

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <Stack mt={10} style={{ width: sidebarCollapsed ? "70px" : "230px", transition: "width 0.3s", width: '100%' }}>
      <Box
        onClick={() => handleOptionChange("inicio")}
        style={{
          cursor: "pointer",
          display: "flex",
          padding: "10px",
          backgroundColor: selectedOption === "inicio" ? 'rgba(211, 211, 211, 0.4)' : "transparent",
        }}
      >
        <IconDashboard
          size={24}
          style={{ color: selectedOption === "inicio" ? "green" : "inherit" }}
        />
        {!sidebarCollapsed && (
          <Text style={{ marginLeft: 10, color: selectedOption === "inicio" ? "green" : "inherit" }}>Início</Text>
        )}
      </Box>

      <Box
        onClick={() => handleOptionChange("redacoes")}
        style={{
          cursor: "pointer",
          display: "flex",
          padding: "10px",
          backgroundColor: selectedOption === "redacoes" ? "rgba(211, 211, 211, 0.4)" : "transparent",
        }}
      >
        <IconFileDescription
          size={24}
          style={{ color: selectedOption === "redacoes" ? "green" : "inherit" }}
        />
        {!sidebarCollapsed && (
          <Text style={{ marginLeft: 10, color: selectedOption === "redacoes" ? "green" : "inherit" }}>Redações</Text>
        )}
      </Box>

      <Box
        onClick={() => handleOptionChange("evolucao")}
        style={{
          cursor: "pointer",
          display: "flex",
          padding: "10px",
          backgroundColor: selectedOption === "evolucao" ? "rgba(211, 211, 211, 0.4)" : "transparent",
        }}
      >
        <IconChartBar
          size={24}
          style={{ color: selectedOption === "evolucao" ? "green" : "inherit" }}
        />
        {!sidebarCollapsed && (
          <Text style={{ marginLeft: 10, color: selectedOption === "evolucao" ? "green" : "inherit" }}>Evolução</Text>
        )}
      </Box>

      <Box
        onClick={() => handleOptionChange("agendamento")}
        style={{
          cursor: "pointer",
          display: "flex",
          padding: "10px",
          backgroundColor: selectedOption === "agendamento" ? "rgba(211, 211, 211, 0.4)" : "transparent",
        }}
      >
        <IconCalendarEvent
          size={24}
          style={{ color: selectedOption === "agendamento" ? "green" : "inherit" }}
        />
        {!sidebarCollapsed && (
          <Text style={{ marginLeft: 10, color: selectedOption === "agendamento" ? "green" : "inherit" }}>Agendamento</Text>
        )}
      </Box>

      <Divider />
      {/* <Box style={{ padding: !sidebarCollapsed ? '0 15px 0 15px' : '0 5px 0 5px'}}>
        <Button
          size='lg'
          radius={sidebarCollapsed ? 'md' : 'lg'}
          ref={ref}
          fullWidth
          leftSection={<IconPencil size={24} />}
          onClick={openModal}
          style={{
            background: !hovered ? 'rgba(144, 238, 144, 0.5)' : 'rgba(144, 238, 144, 1)',
            color: 'green',
            transition: '0.3s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
            padding: sidebarCollapsed ? '0 0 0 11px' : '0'
          }}
        >
          Redigir
        </Button>
      </Box> */}
    </Stack>
  );
}
