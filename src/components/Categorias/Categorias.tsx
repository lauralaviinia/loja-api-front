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
import type { Categoria } from "../../types/categoria";

// Services
import {
  getCategorias,
  deleteCategoria,
} from "../../services/categoriaService";

// Components
import CategoriasTable from "./CategoriasTable";
import CriarCategoriaModal from "./CriarCategoriaModal";
import EditCategoriaModal from "./EditCategoriaModal";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const Categorias: React.FC = () => {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  // ==============================
  // Buscar categorias
  // ==============================
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Erro ao buscar categorias.",
          severity: "error",
        });
      }
    })();
  }, []);

  // ==============================
  // Deletar categoria
  // ==============================
  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));

      setSnackbar({
        open: true,
        message: "Categoria deletada com sucesso.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar categoria.",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // Editar categoria
  // ==============================
  const handleOpenEditModal = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
  };

  const handleCloseEditModal = () => {
    setCategoriaEditando(null);
  };

  const handleSaveCategoria = (categoriaAtualizada: Categoria) => {
    setCategorias((prev) =>
      prev.map((c) => (c.id === categoriaAtualizada.id ? categoriaAtualizada : c))
    );

    setSnackbar({
      open: true,
      message: "Categoria atualizada com sucesso.",
      severity: "success",
    });
  };

  // ==============================
  // Criar categoria
  // ==============================
  const handleCategoriaCriada = (novaCategoria: Categoria) => {
    setCategorias((prev) => [...prev, novaCategoria]);

    setSnackbar({
      open: true,
      message: "Categoria criada com sucesso!",
      severity: "success",
    });
  };

  // ==============================
  // Render
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
          Lista de Categorias
        </Typography>

        {/* Tabela */}
        <CategoriasTable
          categorias={categorias}
          deletingId={deletingId}
          onDelete={handleDelete}
          onEdit={handleOpenEditModal}
        />

        {/* Botão criar */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalCriarAberto(true)}
          >
            Nova Categoria
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
      <EditCategoriaModal
        open={categoriaEditando !== null}
        categoria={categoriaEditando}
        onClose={handleCloseEditModal}
        onSave={handleSaveCategoria}
      />

      {/* Modal Criar */}
      <CriarCategoriaModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onCategoriaCriada={handleCategoriaCriada}
      />
    </Box>
  );
};

export default Categorias;