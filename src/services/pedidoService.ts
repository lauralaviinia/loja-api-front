import axios from "axios";
import type { Pedido } from "../types/pedido";

const API_BASE = "http://localhost:3000";

// ===============================
// Mapeamento
// ===============================

const mapPedido = (data: any): Pedido => {
  return {
    ...data,
    items: data.items || [],
    data: data.data ? data.data : null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as Pedido;
};

// ===============================
// Criar Pedido
// ===============================

export const createPedido = async (dados: {
  clienteId: number;
  data: string;
  items: { produtoId: number; quantidade: number }[];
}): Promise<Pedido> => {
  const res = await axios.post(`${API_BASE}/pedidos`, dados);
  return mapPedido(res.data);
};

// ===============================
// Buscar todos
// ===============================

export const getPedidos = async (): Promise<Pedido[]> => {
  const res = await axios.get(`${API_BASE}/pedidos`);
  return res.data.map((p: any) => mapPedido(p));
};

// ===============================
// Buscar por ID
// ===============================

export const getPedidoById = async (id: number): Promise<Pedido> => {
  const res = await axios.get(`${API_BASE}/pedidos/${id}`);
  return mapPedido(res.data);
};

// ===============================
// Atualizar status do pedido
// ===============================

export const updatePedido = async (
  id: number,
  dados: {
    clienteId?: number;
    status?: string;
    items?: { produtoId: number; quantidade: number }[];
  }
): Promise<Pedido> => {
  const res = await axios.put(`${API_BASE}/pedidos/${id}`, dados);
  return mapPedido(res.data);
};

// ===============================
// Deletar
// ===============================

export const deletePedido = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/pedidos/${id}`);
};

export default {
  createPedido,
  getPedidos,
  getPedidoById,
  updatePedido,
  deletePedido,
};