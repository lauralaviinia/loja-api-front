export interface Pedido {
  id: number;
  cliente?: {
    id: number;
    nome: string;
    email: string;
  };
  data: string;
  total: number;
  status: string;
  items?: Array<{
    id: number;
    quantidade: number;
    produto?: {
      id: number;
      nome: string;
      preco: number;
      estoque: number;
    };
  }>;
}