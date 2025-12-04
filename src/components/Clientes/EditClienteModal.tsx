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

// Validar nome
const validarNome = (nome: string) => {
  if (!nome.trim()) return "Nome é obrigatório.";
  
  if (/\d/.test(nome)) {
    return "Nome não pode conter números.";
  }
  
  const apenasLetras = nome.replace(/\s/g, "");
  if (apenasLetras.length < 4) {
    return "Nome deve ter no mínimo 4 letras.";
  }
  
  return true;
};

// Validar email
const validarEmail = (email: string) => {
  if (!email.trim()) return "Email é obrigatório.";
  
  if (/^\d+$/.test(email)) {
    return "Email não pode ser apenas números.";
  }
  
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return "Email inválido. Use o formato: usuario@exemplo.com";
  }
  
  return true;
};

// Validar CPF
const validarCpf = (cpf: string) => {
  if (!cpf.trim()) return "CPF é obrigatório.";
  
  const apenasNums = cpf.replace(/\D/g, "");
  
  if (apenasNums !== cpf.trim() && cpf.trim().length > 0) {
    return "CPF deve conter apenas números.";
  }
  
  if (apenasNums.length !== 11) {
    return "CPF deve ter exatamente 11 dígitos.";
  }
  
  return true;
};

// Validar senha
const validarSenha = (senha: string) => {
  if (!senha.trim()) return "Senha é obrigatória.";
  
  if (senha.length < 4) {
    return "A senha deve ter pelo menos 4 caracteres.";
  }
  
  if (!/[a-zA-Z]/.test(senha)) {
    return "A senha deve conter pelo menos uma letra.";
  }
  
  if (!/[0-9]/.test(senha)) {
    return "A senha deve conter pelo menos um número.";
  }
  
  return true;
};

// Validar telefone (opcional)
const validarTelefone = (telefone: string) => {
  if (!telefone) return true;

  const apenasNums = telefone.replace(/\D/g, "");

  if (apenasNums.length < 10 || apenasNums.length > 15) {
    return "Telefone deve ter entre 10 e 15 dígitos.";
  }

  return true;
};

// Validar data de nascimento (opcional)
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

// =======================
// Interface do componente
// =======================

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

  // =======================
  // Estado do formulário
  // =======================

  const [formData, setFormData] = useState<any>({
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // =======================
  // Preencher formulário ao abrir
  // =======================

  React.useEffect(() => {
    if (cliente && open) {
      setFormData({
        ...cliente,
        // Formatar data para input date
        dataNascimento: cliente.dataNascimento
          ? cliente.dataNascimento.split("T")[0]
          : "",
      });
    }
  }, [cliente, open]);

  // =======================
  // Atualiza valores do formulário
  // =======================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =======================
  // Salvar alterações
  // =======================

  const handleSave = async () => {
    setErro("");

    // Validar nome
    const nomeValido = validarNome(formData.nome);
    if (nomeValido !== true) {
      setErro(nomeValido);
      return;
    }

    // Validar email
    const emailValido = validarEmail(formData.email);
    if (emailValido !== true) {
      setErro(emailValido);
      return;
    }

    // Validar CPF
    const cpfValido = validarCpf(formData.cpf);
    if (cpfValido !== true) {
      setErro(cpfValido);
      return;
    }

    // Validar senha (se fornecida)
    if (formData.senha && formData.senha.trim()) {
      const senhaValida = validarSenha(formData.senha);
      if (senhaValida !== true) {
        setErro(senhaValida);
        return;
      }
    }

    // Validar telefone (se fornecido)
    const telValido = validarTelefone(formData.telefone);
    if (telValido !== true) {
      setErro(telValido);
      return;
    }

    // Validar data de nascimento (se fornecida)
    const dataValida = validarDataNascimento(formData.dataNascimento);
    if (dataValida !== true) {
      setErro(dataValida);
      return;
    }

    setSalvando(true);

    try {
      // Montar payload (conjunto de dados) de atualização 
      const payload: any = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
      };

      // Incluir senha apenas se fornecida
      if (formData.senha && formData.senha.trim()) {
        payload.senha = formData.senha;
      }

      // Atualizar cliente via API
      const clienteAtualizado = await updateCliente(formData.id, payload);

      onSave(clienteAtualizado);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setErro("Erro ao salvar cliente.");
    } finally {
      setSalvando(false);
    }
  };

  // =======================
  // Renderização do modal
  // =======================

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

          <TextField
            fullWidth
            type="password"
            label="Nova Senha (deixe em branco para manter)"
            name="senha"
            value={formData.senha || ""}
            onChange={handleInputChange}
            helperText="Obrigatório: 4+ caracteres, com letra e número"
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