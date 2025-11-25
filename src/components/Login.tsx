import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { z } from "zod";
import { loginCliente } from "../services/clienteService";

const emailSchema = z.email();
const passwordSchema = z
  .string()
  .min(4, "A senha deve ter pelo menos 4 caracteres")
  .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número");

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msgSucesso, setMsgSucesso] = useState<string>("");
  const [msgErro, setMsgErro] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    if (!email.trim()) return { isValid: false, message: "Email é obrigatório" };
    const resultado = emailSchema.safeParse(email);
    return {
      isValid: resultado.success,
      message: resultado.success ? "" : "Email inválido",
    };
  };

  const validatePassword = (password: string) => {
    if (!password.trim())
      return { isValid: false, message: "Senha é obrigatória" };
    const resultado = passwordSchema.safeParse(password);
    return {
      isValid: resultado.success,
      message: resultado.success ? "" : resultado.error.issues[0].message,
    };
  };

  const inputsValidos =
    validateEmail(email).isValid && validatePassword(password).isValid;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const dadosCliente = await loginCliente(email, password);

      setMsgSucesso(`Bem vindo(a), ${dadosCliente.nome}!`);
      setMsgErro("");

      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (error: any) {
      // backend envia { error: "mensagem" }
      let mensagem = "Erro ao realizar login. Verifique suas credenciais.";

      if (error?.response?.data?.error) {
        mensagem = error.response.data.error;
      }

      setMsgErro(mensagem);
      setMsgSucesso("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
    >
      <Paper elevation={2} sx={{ p: 3, width: 320 }}>
        <Box textAlign="center" mb={2}>
          <LoginIcon sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
          <Typography variant="h6" component="h2" fontWeight={600} mb={1}>
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Faça login para acessar o sistema
          </Typography>
        </Box>

        {msgSucesso && <Alert severity="success">{msgSucesso}</Alert>}
        {msgErro && <Alert severity="error">{msgErro}</Alert>}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!validateEmail(email).isValid}
            helperText={validateEmail(email).message}
            disabled={isLoading}
          />

          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!validatePassword(password).isValid}
            helperText={validatePassword(password).message}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!inputsValidos || isLoading}
          >
            {isLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                Carregando...
              </Box>
            ) : (
              "Entrar"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
