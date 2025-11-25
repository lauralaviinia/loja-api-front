export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  produtos?: Array<{
    id: number;
    nome: string;
    preco: number;
    estoque: number;
  }>;
}