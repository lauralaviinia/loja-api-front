import axios from "axios";
import type { Cliente } from "../types/cliente";

const API_BASE = "http://localhost:3000"; // hook

// Criar cliente
export const createCliente = async (dados: {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha: string;
}): Promise<Cliente> => {
  const res = await axios.post(`${API_BASE}/clientes`, dados);
  return res.data;
};

// Login cliente
export const loginCliente = async (email: string, senha: string) => {
  const res = await axios.post(`${API_BASE}/clientes/login`, { email, senha });
  return res.data;
};

// Buscar todos
export const getClientes = async (): Promise<Cliente[]> => {
  const res = await axios.get(`${API_BASE}/clientes`);
  return res.data;
};

// Buscar por ID
export const getClienteById = async (id: number): Promise<Cliente> => {
  const res = await axios.get(`${API_BASE}/clientes/${id}`);
  return res.data;
};

// Atualizar cliente
export const updateCliente = async (
  id: number,
  dados: Partial<Cliente>
): Promise<Cliente> => {

  const payload = { ...dados };

  // Só envia senha se realmente houver alteração
  if (!payload.senha || payload.senha === "") {
    delete payload.senha;
  }

  const res = await axios.put(`${API_BASE}/clientes/${id}`, payload);
  return res.data;
};

// Deletar cliente
export const deleteCliente = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/clientes/${id}`);
};

export default {
  createCliente,
  loginCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};
