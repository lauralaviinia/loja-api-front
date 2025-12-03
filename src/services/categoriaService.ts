import axios from "axios";
import type { Categoria } from "../types/categoria";

const API_BASE = "http://localhost:3000";

// ===============================
// Mapeamento
// ===============================

const mapCategoria = (data: any): Categoria => {
  return {
    ...data,
    descricao: data.descricao ?? "", 
    produto: data.produto || [],
  } as Categoria;
};

// ===============================
// Criar Categoria
// ===============================

export const createCategoria = async (dados: {
  nome: string;
  descricao?: string | null; 
}): Promise<Categoria> => {
  const payload: any = {};

  payload.nome = dados.nome.trim();
  if (dados.descricao === undefined) {
    // omit descricao
  } else if (dados.descricao === null) {
    payload.descricao = null;
  } else {
    const d = dados.descricao.trim();
    if (d !== "") payload.descricao = d;
    // if d === "" -> omit on create (optional)
  }

  const res = await axios.post(`${API_BASE}/categorias`, payload);
  return mapCategoria(res.data);
};

// ===============================
// Buscar todas
// ===============================

export const getCategorias = async (): Promise<Categoria[]> => {
  const res = await axios.get(`${API_BASE}/categorias`);
  return res.data.map((c: any) => mapCategoria(c));
};

// ===============================
// Buscar por ID
// ===============================

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const res = await axios.get(`${API_BASE}/categorias/${id}`);
  return mapCategoria(res.data);
};

// ===============================
// Atualizar categoria
// ===============================

export const updateCategoria = async (
  id: number,
  dados: {
    nome?: string;
    descricao?: string | null; 
  }
): Promise<Categoria> => {
  const payload: any = {};

  if (dados.nome !== undefined) {
    payload.nome = dados.nome.trim();
  }

  if (dados.descricao !== undefined) {
    if (dados.descricao === null) {
      payload.descricao = null; // explicitly clear description
    } else {
      const d = dados.descricao.trim();
      payload.descricao = d === "" ? null : d; // empty -> explicit null to clear
    }
  }

  const res = await axios.put(`${API_BASE}/categorias/${id}`, payload);
  return mapCategoria(res.data);
};

// ===============================
// Deletar
// ===============================

export const deleteCategoria = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/categorias/${id}`);
};

export default {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
};