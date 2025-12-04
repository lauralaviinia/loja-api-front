import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
} from "@mui/material";

import categoriaService from "../../services/categoriaService";
import produtoService from "../../services/produtoService";

import type { Categoria } from "../../types/categoria";
import type { Produto } from "../../types/produto";

interface CriarProdutoModalProps {
  open: boolean;
  onClose: () => void;
  onProdutoCriado: (produto: Produto) => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CriarProdutoModal: React.FC<CriarProdutoModalProps> = ({
  open,
  onClose,
  onProdutoCriado,
}) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [error, setError] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Carregar categorias ao abrir o modal
  useEffect(() => {
    if (!open) return;

    const fetchCategorias = async () => {
      try {
        const lista = await categoriaService.getCategorias();
        setCategorias(lista);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      }
    };

    fetchCategorias();
  }, [open]);

  // Salvar produto
  const handleSalvar = async () => {
    setError("");

    // Validação: nome obrigatório
    if (!nome.trim()) {
      return setError("Informe o nome do produto.");
    }

    // Validação: nome não pode conter apenas números
    if (/^\d+$/.test(nome.trim())) {
      return setError("O nome do produto não pode ser apenas números.");
    }

    // Validação: preço obrigatório
    if (!preco || Number(preco) <= 0) {
      return setError("Informe um preço válido.");
    }

    // Validação: categoria obrigatória
    if (!categoriaId) {
      return setError("Selecione uma categoria.");
    }

    // Validação: descrição não pode ser apenas números (se fornecida)
    if (descricao.trim() !== "" && /^\d+$/.test(descricao.trim())) {
      return setError("A descrição não pode ser apenas números.");
    }

    try {
      setSalvando(true);

      // Formatar preço com 2 casas decimais
      const precoFormatado = parseFloat(Number(preco).toFixed(2));

      const payload = {
        nome: nome.trim(),
        preco: precoFormatado,
        descricao: descricao.trim() === "" ? null : descricao.trim(),
        categoriaId: Number(categoriaId),
        estoque: estoque ? Number(estoque) : 0,
      };

      console.log("Payload enviado:", payload);

      const produtoCriado = await produtoService.createProduto(payload);

      onProdutoCriado(produtoCriado);
      onClose();

      // reset
      setNome("");
      setPreco("");
      setDescricao("");
      setEstoque("");
      setCategoriaId("");
      setError("");
    } catch (err: any) {
      console.error("Erro ao criar produto:", err);
      setError(err?.response?.data?.error || "Erro ao criar produto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          Criar Produto
        </Typography>

        <Stack spacing={2}>
          {/* Nome */}
          <TextField
            label="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />

          {/* Preço */}
          <TextField
            label="Preço"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            fullWidth
            inputProps={{ step: "0.01", min: "0" }}
          />

          {/* Descrição */}
          <TextField
            label="Descrição (opcional)"
            multiline
            rows={2}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
          />

          {/* Estoque */}
          <TextField
            label="Estoque (opcional)"
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            fullWidth
            inputProps={{ min: "0" }}
          />

          {/* Categoria */}
          <TextField
            select
            label="Categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            fullWidth
          >
            {categorias.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.nome}
              </MenuItem>
            ))}
          </TextField>

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSalvar}
            disabled={salvando}
            fullWidth
          >
            {salvando ? "Salvando..." : "Salvar Produto"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CriarProdutoModal;