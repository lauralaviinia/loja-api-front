import axios from "axios";
import type { Cliente } from "../types/cliente";

const API_BASE = "http://localhost:3000";

// Remove senha antes de enviar ao front
const mapCliente = (data: any): Cliente => {
  const { senha, ...rest } = data;
  return rest as Cliente;
};

// =======================================
// Criar cliente
// =======================================
export const createCliente = async (dados: {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string | null;
  senha: string;
  dataNascimento?: string | null;
}): Promise<Cliente> => {
  const res = await axios.post(`${API_BASE}/clientes`, dados);
  return mapCliente(res.data);
};

// =======================================
// Login
// =======================================
export const loginCliente = async (email: string, senha: string) => {
  const res = await axios.post(`${API_BASE}/clientes/login`, { email, senha });
  return res.data;
};

// =======================================
// Buscar todos
// =======================================
export const getClientes = async (): Promise<Cliente[]> => {
  const res = await axios.get(`${API_BASE}/clientes`);
  return res.data.map((c: any) => mapCliente(c));
};

// =======================================
// Buscar por ID
// =======================================
export const getClienteById = async (id: number): Promise<Cliente> => {
  const res = await axios.get(`${API_BASE}/clientes/${id}`);
  return mapCliente(res.data);
};

// =======================================
// ATUALIZAR
// =======================================
export const updateCliente = async (
  id: number,
  dados: any
): Promise<Cliente> => {
  const payload: any = {};

  // Envia apenas valores realmente alterados
  if (dados.nome !== undefined) payload.nome = dados.nome;
  if (dados.email !== undefined) payload.email = dados.email;
  if (dados.cpf !== undefined) payload.cpf = dados.cpf;

  // TELEFONE — se "" vira null, se undefined nem envia
  if (dados.telefone !== undefined) {
    payload.telefone = dados.telefone?.trim() === "" ? null : dados.telefone;
  }

  // DATA — mesma lógica
  if (dados.dataNascimento !== undefined) {
    payload.dataNascimento =
      dados.dataNascimento?.trim() === "" ? null : dados.dataNascimento;
  }

  // SENHA — só envia se NÃO estiver vazia
  if (dados.senha && dados.senha.trim() !== "") {
    payload.senha = dados.senha;
  }

  const res = await axios.put(`${API_BASE}/clientes/${id}`, payload);
  return mapCliente(res.data);
};

// =======================================
// Deletar
// =======================================
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
