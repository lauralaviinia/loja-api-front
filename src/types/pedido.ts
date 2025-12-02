// Representa um item dentro do pedido
export interface PedidoItem {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;

  // Relacionamento retornado do backend
  produto?: {
    id: number;
    nome: string;
    preco: number;
  };
}

// Representa o pedido completo
export interface Pedido {
  id: number;
  clienteId: number;
  data: string; // ISO string (ex: "2025-02-01T12:00:00.000Z")
  total: number;
  status: string;

  // Cliente relacionado
  cliente?: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
  };

  // Itens do pedido
  items: PedidoItem[];
}
