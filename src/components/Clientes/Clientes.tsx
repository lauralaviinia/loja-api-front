import React, { useEffect, useState } from "react";
import type { Cliente } from "../../types/cliente";
import { getClientes, deleteCliente } from "../../services/clienteService";
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
import { useNavigate } from "react-router-dom";
import ClientesTable from "./ClientesTable";
import EditarClienteModal from "./EditClienteModal";
import CriarClienteModal from "./CriarClienteModal";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const Clientes: React.FC = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (e) {
        setSnackbar({
          open: true,
          message: "Erro ao buscar clientes.",
          severity: "error",
        });
        console.error(e);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
      setSnackbar({
        open: true,
        message: "Cliente removido com sucesso.",
        severity: "success",
      });
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Erro ao deletar cliente.",
        severity: "error",
      });
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenEditModal = (cliente: Cliente) => {
    setClienteEditando(cliente);
  };

  const handleCloseEditModal = () => {
    setClienteEditando(null);
  };

  const handleSaveCliente = (clienteAtualizado: Cliente) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteAtualizado.id ? clienteAtualizado : c))
    );
    setSnackbar({
      open: true,
      message: "Cliente atualizado com sucesso.",
      severity: "success",
    });
  };

  const handleClienteCriado = (novoCliente: Cliente) => {
    setClientes((prev) => [...prev, novoCliente]);

    setSnackbar({
      open: true,
      message: "Cliente criado com sucesso!",
      severity: "success",
    });
  };

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
          maxWidth: 1000,
          p: 3,
          position: "relative",
          bgcolor:
            theme.palette.mode === "dark" ? "#242424" : "background.paper",
          color: theme.palette.text.primary,
          borderRadius: 2,
        })}
      >
        <IconButton
          aria-label="voltar"
          onClick={() => navigate("/home")}
          size="small"
          sx={{ position: "absolute", left: 16, top: 16 }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Lista de Clientes
        </Typography>

        <ClientesTable
          clientes={clientes}
          deletingId={deletingId}
          onDelete={handleDelete}
          onEdit={handleOpenEditModal}
        />

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            className="uppercase font-bold"
            onClick={() => setModalCriarAberto(true)}
          >
            Novo Cliente
          </Button>
        </Box>

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

      <EditarClienteModal
        open={clienteEditando !== null}
        cliente={clienteEditando}
        onClose={handleCloseEditModal}
        onSave={handleSaveCliente}
      />

      <CriarClienteModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        {...({ onSave: handleClienteCriado } as any)}
      />
    </Box>
  );
};

export default Clientes;
