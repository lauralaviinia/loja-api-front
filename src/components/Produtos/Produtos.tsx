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
  TextField,
  MenuItem,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Types
import type { Produto } from "../../types/produto";
import type { Categoria } from "../../types/categoria";

// Services 
import {
  getProdutos,
  deleteProduto,
} from "../../services/produtoService";
import categoriaService from "../../services/categoriaService";

// Components
import ProdutosTable from "./ProdutosTable";
import CriarProdutoModal from "./CriarProdutoModal";
import EditProdutoModal from "./EditProdutoModal";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const Produtos: React.FC = () => {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  // ==============================
  // Buscar produtos
  // ==============================
  useEffect(() => {
    (async () => {
      try {
        const data = await getProdutos();
        setProdutos(data);
        const cats = await categoriaService.getCategorias();
        setCategorias(cats);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Erro ao buscar produtos.",
          severity: "error",
        });
      }
    })();
  }, []);

  // ==============================
  // Deletar produto
  // ==============================
  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      await deleteProduto(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));

      setSnackbar({
        open: true,
        message: "Produto deletado com sucesso.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar produto.",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // Editar produto
  // ==============================
  const handleOpenEditModal = (produto: Produto) => {
    setProdutoEditando(produto);
  };

  const handleCloseEditModal = () => {
    setProdutoEditando(null);
  };

  const handleSaveProduto = (produtoAtualizado: Produto) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p))
    );

    setSnackbar({
      open: true,
      message: "Produto atualizado com sucesso.",
      severity: "success",
    });
  };

  // ==============================
  // Criar produto
  // ==============================
  const handleProdutoCriado = (novoProduto: Produto) => {
    setProdutos((prev) => [...prev, novoProduto]);

    setSnackbar({
      open: true,
      message: "Produto criado com sucesso!",
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
          Lista de Produtos
        </Typography>

        {/* Tabela */}
        {/* Filtro por categoria */}
        <Box mb={2} display="flex" justifyContent="flex-end">
          <TextField
            select
            size="small"
            label="Filtrar categoria"
            value={filtroCategoriaId}
            onChange={(e) => setFiltroCategoriaId(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {categorias.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.nome}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <ProdutosTable
          produtos={
            filtroCategoriaId
              ? produtos.filter(
                  (p) => String(p.categoriaId ?? p.categoria?.id ?? "") === filtroCategoriaId
                )
              : produtos
          }
          deletingId={deletingId}
          onDelete={handleDelete}
          onEdit={handleOpenEditModal}
        />

        {/* Botão novo */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={() => setModalCriarAberto(true)}>
            Novo Produto
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
      <EditProdutoModal
        open={produtoEditando !== null}
        produto={produtoEditando}
        onClose={handleCloseEditModal}
        onSave={handleSaveProduto}
      />

      {/* Modal Criar */}
      <CriarProdutoModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onProdutoCriado={handleProdutoCriado}
      />
    </Box>
  );
};

export default Produtos;

