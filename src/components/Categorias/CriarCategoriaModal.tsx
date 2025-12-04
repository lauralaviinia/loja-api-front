import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";

import categoriaService from "../../services/categoriaService";

interface CriarCategoriaModalProps {
  open: boolean;
  onClose: () => void;
  onCategoriaCriada: (categoria: any) => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CriarCategoriaModal: React.FC<CriarCategoriaModalProps> = ({
  open,
  onClose,
  onCategoriaCriada,
}) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setError("");

    if (!nome.trim()) {
      setError("O nome da categoria é obrigatório.");
      return;
    }

    // Nome deve conter pelo menos 4 letras
    if (nome.trim().length < 4) {
      setError("O nome da categoria deve conter no mínimo 4 letras.");
      return;
    }

    // Nome não deve conter números
    if (/\d/.test(nome)) {
      setError("O nome da categoria não pode conter números.");
      return;
    }

    // Descrição deve conter no mínimo 4 letras (se fornecida)
    if (descricao.trim() !== "" && descricao.trim().length < 4) {
      setError("A descrição deve conter no mínimo 4 letras.");
      return;
    }

    // Descrição não pode conter números (se fornecida)
    if (descricao.trim() !== "" && /\d/.test(descricao)) {
      setError("A descrição não pode conter números.");
      return;
    }

    try {
      setSalvando(true);

      const novaCategoria = await categoriaService.createCategoria({
        nome: nome.trim(),
        descricao: descricao.trim() === "" ? undefined : descricao.trim(),
      });

      onCategoriaCriada(novaCategoria);
      onClose();

      // reset
      setNome("");
      setDescricao("");
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || "Erro ao criar categoria.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          Criar Categoria
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nome da Categoria"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <TextField
            label="Descrição"
            multiline
            rows={3}
            fullWidth
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

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
            {salvando ? "Salvando..." : "Salvar Categoria"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CriarCategoriaModal;