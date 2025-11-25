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
} from "@mui/material";

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
  const [formData, setFormData] = useState<Cliente>(
    cliente || {
      id: 0,
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      dataNascimento: "",
    }
  );

  const [salvando, setSalvando] = useState(false);

  React.useEffect(() => {
    if (cliente && open) {
      setFormData({
        ...cliente,
        dataNascimento: cliente.dataNascimento?.split("T")[0] || "",
      });
    }
  }, [cliente, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSalvando(true);
    try {
      await updateCliente(formData.id, formData);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente. Tente novamente.");
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
            placeholder="Digite o nome completo"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Digite o email"
          />

          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            placeholder="Digite o CPF"
          />

          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={formData.telefone || ""}
            onChange={handleInputChange}
            placeholder="Digite o telefone"
          />

          <TextField
            fullWidth
            label="Data de Nascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
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

export default EditarClienteModal;