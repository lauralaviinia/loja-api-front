import React, { useState } from "react";
import type { Cliente } from "../../types/cliente";
import { updateCliente } from "../../services/clienteService";
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

// =======================
// Funções de validação
// =======================
const validarTelefone = (telefone: string) => {
  if (!telefone) return true;
  const apenasNums = telefone.replace(/\D/g, "");
  if (apenasNums.length < 10 || apenasNums.length > 15) {
    return "Telefone deve ter entre 10 e 15 dígitos.";
  }
  return true;
};

const validarDataNascimento = (data: string) => {
  if (!data) return true;

  const d = new Date(data);

  if (isNaN(d.getTime())) {
    return "Data de nascimento inválida.";
  }

  const ano = d.getUTCFullYear();
  if (ano < 1900) {
    return "Data mínima permitida é 01/01/1900.";
  }

  const hoje = new Date();
  if (d > hoje) {
    return "Data de nascimento não pode ser no futuro.";
  }

  return true;
};

interface EditarClienteModalProps {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
  onSave: (clienteAtualizado: Cliente) => void;
}

const EditarClienteModal: React.FC<EditarClienteModalProps> = ({
  open,
  cliente,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
  });

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  React.useEffect(() => {
    if (cliente && open) {
      setFormData({
        ...cliente,
        dataNascimento: cliente.dataNascimento
          ? cliente.dataNascimento.split("T")[0]
          : "",
      });
    }
  }, [cliente, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setErro("");

    // Validações
    const telValido = validarTelefone(formData.telefone);
    if (telValido !== true) {
      setErro(telValido);
      return;
    }

    const dataValida = validarDataNascimento(formData.dataNascimento);
    if (dataValida !== true) {
      setErro(dataValida);
      return;
    }

    setSalvando(true);

    try {
      const clienteAtualizado = await updateCliente(formData.id, {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
      });

      onSave(clienteAtualizado);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setErro("Erro ao salvar cliente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Editar Cliente
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={formData.telefone || ""}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Data de Nascimento"
            name="dataNascimento"
            value={formData.dataNascimento || ""}
            onChange={handleInputChange}
          />

          {erro && (
            <Typography color="error" textAlign="center">
              {erro}
            </Typography>
          )}
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

export default EditarClienteModal;
