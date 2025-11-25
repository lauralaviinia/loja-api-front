import React, { useState, useEffect } from "react";
import type { Produto } from "../../types/produto";
import { updateProduto } from "../../services/produtoService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

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
  const [formData, setFormData] = useState<Produto>(
    produto || {
      id: 0,
      nome: "",
      preco: 0,
      descricao: "",
      estoque: 0,
      categoriaId: 0,
    }
  );

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (produto && open) {
      setFormData(produto);
    }
  }, [produto, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "preco" || name === "estoque" || name === "categoriaId"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    setSalvando(true);
    try {
      const atualizado = await updateProduto(formData.id, formData);
      onSave(atualizado);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Editar Produto
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Digite o nome do produto"
          />

          <TextField
            fullWidth
            label="Preço"
            name="preco"
            type="number"
            value={formData.preco}
            onChange={handleInputChange}
            placeholder="Digite o preço"
          />

          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder="Digite a descrição"
          />

          <TextField
            fullWidth
            label="Estoque"
            name="estoque"
            type="number"
            value={formData.estoque}
            onChange={handleInputChange}
            placeholder="Digite a quantidade em estoque"
          />

          <TextField
            fullWidth
            label="Categoria ID"
            name="categoriaId"
            type="number"
            value={formData.categoriaId}
            onChange={handleInputChange}
            placeholder="Digite o ID da categoria"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarProdutoModal;
