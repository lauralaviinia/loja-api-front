import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";

import type { Produto } from "../../types/produto";
import type { Categoria } from "../../types/categoria";

import produtoService from "../../services/produtoService";
import categoriaService from "../../services/categoriaService";

interface EditarProdutoModalProps {
  open: boolean;
  produto: Produto | null;
  onClose: () => void;
  onSave: (produtoAtualizado: Produto) => void;
}

const EditarProdutoModal: React.FC<EditarProdutoModalProps> = ({
  open,
  produto,
  onClose,
  onSave,
}) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    nome: "",
    preco: "",
    descricao: "",
    estoque: "",
    categoriaId: "",
  });
  const [initialFormData, setInitialFormData] = useState({
    id: 0,
    nome: "",
    preco: "",
    descricao: "",
    estoque: "",
    categoriaId: "",
  });

  // ======================================
  // Carregar dados ao abrir modal
  // ======================================
  useEffect(() => {
    if (!open || !produto) return;

    const load = async () => {
      try {
        const listaCategorias = await categoriaService.getCategorias();
        setCategorias(listaCategorias);

        const loaded = {
          id: produto.id,
          nome: produto.nome,
          preco: String(produto.preco),
          descricao: produto.descricao ?? "",
          estoque: String(produto.estoque ?? 0),
          categoriaId: produto.categoriaId ? String(produto.categoriaId) : "",
        };

        setFormData(loaded);
        setInitialFormData(loaded);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    };

    load();
  }, [open, produto]);

  // ======================================
  // Alterar campos
  // ======================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // Salvar alterações
  // ======================================
  const handleSave = async () => {
    setErro("");

    if (!formData.nome.trim()) return setErro("O nome é obrigatório.");
    if (!formData.preco || Number(formData.preco) <= 0)
      return setErro("Preço inválido.");

    // Validação: nome não pode ser apenas números
    if (/^\d+$/.test(formData.nome.trim())) {
      return setErro("O nome do produto não pode ser apenas números.");
    }

    // Validação: descrição não pode ser apenas números (se fornecida)
    if (formData.descricao.trim() !== "" && /^\d+$/.test(formData.descricao.trim())) {
      return setErro("A descrição não pode ser apenas números.");
    }

    // Validação: categoria obrigatória (não permitir editar para sem categoria)
    if (!formData.categoriaId) {
      return setErro("Selecione uma categoria.");
    }

    setSalvando(true);

    try {
      const payload: any = {
        nome: formData.nome,
        preco: Number(formData.preco),
        categoriaId: formData.categoriaId ? Number(formData.categoriaId) : undefined,
      };

      // incluir descrição apenas se o usuário alterou
      if (formData.descricao !== initialFormData.descricao) {
        payload.descricao = formData.descricao.trim() === "" ? null : formData.descricao.trim();
      }

      // incluir estoque apenas se alterado
      if (String(Number(formData.estoque || 0)) !== String(Number(initialFormData.estoque || 0))) {
        payload.estoque = formData.estoque ? Number(formData.estoque) : 0;
      }

      const atualizado = await produtoService.updateProduto(formData.id, payload);

      onSave(atualizado);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setErro("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>Editar Produto</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Nome"
            name="nome"
            fullWidth
            value={formData.nome}
            onChange={handleChange}
          />

          <TextField
            label="Preço"
            name="preco"
            type="number"
            fullWidth
            value={formData.preco}
            onChange={handleChange}
            inputProps={{ step: "0.01", min: "0" }}
          />

          <TextField
            label="Descrição"
            name="descricao"
            multiline
            rows={2}
            fullWidth
            value={formData.descricao}
            onChange={handleChange}
          />

          <TextField
            label="Estoque"
            name="estoque"
            type="number"
            fullWidth
            value={formData.estoque}
            onChange={handleChange}
            inputProps={{ min: "0" }}
          />

          <TextField
            select
            label="Categoria"
            name="categoriaId"
            fullWidth
            value={formData.categoriaId}
            onChange={handleChange}
          >
            {categorias.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.nome}
              </MenuItem>
            ))}
          </TextField>

          {erro && (
            <Typography color="error" textAlign="center">
              {erro}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button variant="contained" onClick={handleSave} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarProdutoModal;