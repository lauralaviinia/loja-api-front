import axios from "axios";
import type { Produto } from "../types/produto";

const API_BASE = "http://localhost:3000";

// Buscar todos os produtos
export const getProdutos = async (): Promise<Produto[]> => {
  const res = await axios.get<Produto[]>(`${API_BASE}/produtos`);
  return res.data;
};

// Deletar um produto pelo ID
export const deleteProduto = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/produtos/${id}`);
};

// Atualizar um produto existente
export const updateProduto = async (
  id: number,
  dados: Produto
): Promise<Produto> => {
  const res = await axios.put<Produto>(`${API_BASE}/produtos/${id}`, dados);
  return res.data;
};

export default {
  getProdutos,
  deleteProduto,
  updateProduto,
};
