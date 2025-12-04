export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string | null;
  estoque?: number;
  categoriaId?: number | undefined;
  categoria?: {
    id: number;
    nome: string;
  };
}