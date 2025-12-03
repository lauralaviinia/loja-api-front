import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

import type { Categoria } from "../../types/categoria";
import categoriaService from "../../services/categoriaService";

interface EditCategoriaModalProps {
  open: boolean;
  categoria: Categoria | null;
  onClose: () => void;
  onSave: (categoriaAtualizada: Categoria) => void;
}

const EditCategoriaModal: React.FC<EditCategoriaModalProps> = ({
  open,
  categoria,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    nome: "",
    descricao: "",
  });

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // =========================================================
  // Carregar categoria ao abrir modal
  // =========================================================
  useEffect(() => {
    if (!open || !categoria) return;

    setFormData({
      id: categoria.id,
      nome: categoria.nome ?? "",
      descricao: categoria.descricao ?? "", 
    });

    setErro("");
  }, [open, categoria]);

  // =========================================================
  // Alterar inputs
  // =========================================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement & {
      name: string;
      value: string;
    };

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Salvar alterações
  // =========================================================
  const handleSave = async () => {
    setErro("");

    if (!formData.nome.trim()) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }

    // Nome não pode conter números
    if (/\d/.test(formData.nome)) {
      setErro("O nome da categoria não pode conter números.");
      return;
    }

    // Descrição não pode conter números (se fornecida)
    if (formData.descricao.trim() !== "" && /\d/.test(formData.descricao)) {
      setErro("A descrição não pode conter números.");
      return;
    }

    setSalvando(true);

    try {
      const atualizado = await categoriaService.updateCategoria(formData.id, {
        nome: formData.nome.trim(),
        descricao:
          formData.descricao.trim() === "" ? null : formData.descricao.trim(),
      });

      onSave(atualizado);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setErro("Erro ao salvar categoria.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Editar Categoria
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Nome */}
          <TextField
            fullWidth
            label="Nome da Categoria"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />

          {/* Descrição */}
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            multiline
            rows={3}
            value={formData.descricao}
            onChange={handleChange}
          />

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

export default EditCategoriaModal;