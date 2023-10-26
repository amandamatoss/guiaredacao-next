import React, { useState } from "react";
import { Box, Text } from "@mantine/core";
import { IconDashboard, IconFileDescription, IconGraph } from "@tabler/icons-react";
import { useMediaQuery } from '@mantine/hooks';

export default function NavbarItens({ setSelectedOption }) {
  const [selected, setSelected] = useState("inicio");
  const isMobile = useMediaQuery("(max-width: 576px)");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setSelected(option);
  };

  return (
    <Box
      position="fixed"
      display={isMobile ? "flex" : undefined}
      justifyContent={isMobile ? "space-between" : "space-between"}
    >
      <Box
        onClick={() => handleOptionChange("inicio")}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          padding: "6px",
          backgroundColor: selected === "inicio" ? "green" : "transparent",
          width: isMobile ? "30%" : "auto", // Ajuste da largura para 30% no modo móvel
          marginBottom: isMobile ? 0 : 10,
          borderRadius: '4px',
        }}
      >
        <IconDashboard
          size={24}
          style={{ marginRight: isMobile ? 0 : 8, color: selected === "inicio" ? "white" : "inherit" }}
        />
        {!isMobile && <Text style={{ marginLeft: 4, color: selected === "inicio" ? "white" : "inherit" }}>Início</Text>}
      </Box>

      <Box
        onClick={() => handleOptionChange("redacoes")}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          padding: "6px",
          backgroundColor: selected === "redacoes" ? "green" : "transparent",
          width: isMobile ? "30%" : "auto", // Ajuste da largura para 30% no modo móvel
          marginBottom: isMobile ? 0 : 10,
          borderRadius: '4px'
        }}
      >
        <IconFileDescription
          size={24}
          style={{ marginRight: isMobile ? 0 : 8, color: selected === "redacoes" ? "white" : "inherit" }}
        />
        {!isMobile && <Text style={{ marginLeft: 4, color: selected === "redacoes" ? "white" : "inherit" }}>Redações</Text>}
      </Box>

      <Box
        onClick={() => handleOptionChange("evolucao")}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          padding: "6px",
          backgroundColor: selected === "evolucao" ? "green" : "transparent",
          width: isMobile ? "30%" : "auto", // Ajuste da largura para 30% no modo móvel
          marginBottom: isMobile ? 0 : 10,
          borderRadius: '4px'
        }}
      >
        <IconGraph
          size={24}
          style={{ marginRight: isMobile ? 0 : 8, color: selected === "evolucao" ? "white" : "inherit" }}
        />
        {!isMobile && <Text style={{ marginLeft: 4, color: selected === "evolucao" ? "white" : "inherit" }}>Evolução</Text>}
      </Box>
    </Box>
  );
}
