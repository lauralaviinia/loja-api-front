import axios from "axios";
import type { Produto } from "../types/produto";

// Buscar todos os produtos
export const getProdutos = async (): Promise<Produto[]> => {
  const res = await axios.get<Produto[]>(`${API_BASE}/produtos`);
  return res.data;
};

// Criar um novo produto
export const createProduto = async (dados: {
  nome: string;
  preco: number;
  descricao?: string | null;
  categoriaId: number;
  estoque?: number;
}): Promise<Produto> => {
  const payload: any = {
    nome: dados.nome,
    preco: dados.preco,
    categoriaId: dados.categoriaId,
    estoque: dados.estoque ?? 0, // Padrão: 0 se não fornecido
  };

  // Inclui descrição apenas se fornecida e não for null
  if (dados.descricao !== undefined && dados.descricao !== null) {
    payload.descricao = dados.descricao;
  }

  // Validação extra: categoriaId deve ser número válido (não permitir criação sem categoria)
  if (dados.categoriaId === undefined || typeof dados.categoriaId !== "number" || isNaN(dados.categoriaId)) {
    const err = { response: { data: { error: "Categoria inválida" } } };
    console.error("Bloqueando criação: categoria inválida", err.response.data);
    throw err;
  }

  try {
    const res = await axios.post<Produto>(`${API_BASE}/produtos`, payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

// Deletar um produto pelo ID
export const deleteProduto = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/produtos/${id}`);
};

// Atualizar um produto existente
export const updateProduto = async (
  id: number,
  dados: {
    nome?: string;
    preco?: number;
    descricao?: string | null;
    estoque?: number;
    categoriaId?: number | undefined;
  }
): Promise<Produto> => {
  const payload: any = {};
  if (dados.nome !== undefined) payload.nome = dados.nome;
  if (dados.preco !== undefined) payload.preco = dados.preco;
  if (dados.descricao !== undefined) {
    
    payload.descricao = dados.descricao === null ? "" : dados.descricao;
  }
  if (dados.estoque !== undefined) payload.estoque = dados.estoque;
  if (dados.categoriaId !== undefined) payload.categoriaId = dados.categoriaId;

  try {
    const res = await axios.put<Produto>(`${API_BASE}/produtos/${id}`, payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export default {
  getProdutos,
  createProduto,
  deleteProduto,
  updateProduto,
};
