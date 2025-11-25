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
  onClienteCriado: () => void;
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

  const handleSalvar = async () => {
    setError("");

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await clienteService.createCliente({
        nome,
        email,
        cpf,
        telefone,
        senha,
      });

      onClienteCriado();
      onClose();

      setNome("");
      setEmail("");
      setCpf("");
      setTelefone("");
      setDataNascimento("");
      setSenha("");
      setConfirmarSenha("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar cliente.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          Criar Cliente
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            fullWidth
          />

          <TextField
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            fullWidth
          />

          <TextField
            label="Data de Nascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Senha"
            value={senha}
            type="password"
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Confirmar Senha"
            value={confirmarSenha}
            type="password"
            onChange={(e) => setConfirmarSenha(e.target.value)}
            fullWidth
            required
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
            fullWidth
          >
            Salvar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CriarClienteModal;
