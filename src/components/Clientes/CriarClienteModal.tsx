import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import clienteService from "../../services/clienteService";

interface CriarClienteModalProps {
  open: boolean;
  onClose: () => void;
  onClienteCriado: (cliente: any) => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

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

const CriarClienteModal: React.FC<CriarClienteModalProps> = ({
  open,
  onClose,
  onClienteCriado,
}) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [error, setError] = useState("");

  const resetForm = () => {
    setNome("");
    setEmail("");
    setCpf("");
    setTelefone("");
    setDataNascimento("");
    setSenha("");
    setConfirmarSenha("");
    setError("");
  };

  const handleSalvar = async () => {
    setError("");

    // Senhas iguais
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    // Telefone válido
    const telValido = validarTelefone(telefone);
    if (telValido !== true) {
      setError(telValido);
      return;
    }

    // Data válida
    const dataValida = validarDataNascimento(dataNascimento);
    if (dataValida !== true) {
      setError(dataValida);
      return;
    }

    try {
      const novoCliente = await clienteService.createCliente({
        nome,
        email,
        cpf,
        telefone,
        senha,
        dataNascimento,
      });

      onClienteCriado(novoCliente);
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Erro ao criar cliente."
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          Criar Cliente
        </Typography>

        <Stack spacing={2}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />

          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />

          <TextField label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} fullWidth />

          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth />

          <TextField 
            label="Data de Nascimento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            fullWidth
          />

          <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} fullWidth />

          <TextField
            label="Confirmar Senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            fullWidth
          />

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}

          <Button variant="contained" color="primary" onClick={handleSalvar} fullWidth>
            Salvar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CriarClienteModal;
