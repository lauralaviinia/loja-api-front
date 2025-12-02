import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Types
import type { Pedido } from "../../types/pedido";

// Services 
import { getPedidos, deletePedido } from "../../services/pedidoService";

// Components
import PedidosTable from "./PedidosTable";
import CriarPedidoModal from "./CriarPedidoModal";
import EditPedidoModal from "./EditPedidoModal";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const Pedidos: React.FC = () => {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  // ==============================
  // Buscar pedidos
  // ==============================
  useEffect(() => {
    (async () => {
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Erro ao buscar pedidos.",
          severity: "error",
        });
      }
    })();
  }, []);

  // ==============================
  // Deletar pedido
  // ==============================
  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      await deletePedido(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));

      setSnackbar({
        open: true,
        message: "Pedido deletado com sucesso.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar pedido.",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // Editar pedido
  // ==============================
  const handleOpenEditModal = (pedido: Pedido) => {
    setPedidoEditando(pedido);
  };

  const handleCloseEditModal = () => {
    setPedidoEditando(null);
  };

  const handleSavePedido = (pedidoAtualizado: Pedido) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === pedidoAtualizado.id ? pedidoAtualizado : p))
    );

    setSnackbar({
      open: true,
      message: "Pedido atualizado com sucesso.",
      severity: "success",
    });
  };

  // ==============================
  // Criar pedido
  // ==============================
  const handlePedidoCriado = (novoPedido: Pedido) => {
    setPedidos((prev) => [...prev, novoPedido]);

    setSnackbar({
      open: true,
      message: "Pedido criado com sucesso!",
      severity: "success",
    });
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      p={3}
    >
      <Paper
        elevation={3}
        sx={(theme) => ({
          width: "100%",
          maxWidth: 1100,
          p: 3,
          position: "relative",
          bgcolor:
            theme.palette.mode === "dark" ? "#242424" : "background.paper",
          color: theme.palette.text.primary,
          borderRadius: 2,
        })}
      >
        {/* Botão voltar */}
        <IconButton
          aria-label="voltar"
          onClick={() => navigate("/home")}
          size="small"
          sx={{ position: "absolute", left: 16, top: 16 }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Lista de Pedidos
        </Typography>

        {/* Tabela */}
        <PedidosTable
          pedidos={pedidos}
          deletingId={deletingId}
          onDelete={handleDelete}
          onEdit={handleOpenEditModal}
        />

        {/* Botão novo pedido */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalCriarAberto(true)}
          >
            Novo Pedido
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>

      {/* Modal Editar */}
      <EditPedidoModal
        open={pedidoEditando !== null}
        pedido={pedidoEditando}
        onClose={handleCloseEditModal}
        onSave={handleSavePedido}
      />

      {/* Modal Criar */}
      <CriarPedidoModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onPedidoCriado={handlePedidoCriado}
      />
    </Box>
  );
};

export default Pedidos;
