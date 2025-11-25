import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ThemeToggleFloating from "./components/ThemeToggleFloating";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";

// Componentes
import Clientes from "./components/Clientes/Clientes";
import Produtos from "./components/Produtos/Produtos";
//import Categoria from "./components/Categoria/Categoria";
//import Pedidos from "./components/Pedidos/Pedidos";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = createTheme({ palette: { mode } });

  const toggleColorMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeToggleFloating toggleColorMode={toggleColorMode} mode={mode} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/produtos" element={<Produtos/>} />
          {/* <Route path="/categoria" element={<Categoria/>} /> */}
          {/* <Route path="/pedidos" element={<Pedidos/>} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;