import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import clienteService from "../../services/clienteService";
import produtoService from "../../services/produtoService";
import pedidoService from "../../services/pedidoService";

import type { Cliente } from "../../types/cliente";
import type { Produto } from "../../types/produto";
import type { PedidoItem } from "../../types/pedido";

interface CriarPedidoModalProps {
  open: boolean;
  onClose: () => void;
  onPedidoCriado: (pedido: any) => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CriarPedidoModal: React.FC<CriarPedidoModalProps> = ({
  open,
  onClose,
  onPedidoCriado,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [items, setItems] = useState<PedidoItem[]>([]);
  const [error, setError] = useState("");

  // Carregar clientes e produtos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listaClientes = await clienteService.getClientes();
        const listaProdutos = await produtoService.getProdutos();

        setClientes(listaClientes);
        setProdutos(listaProdutos);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    if (open) fetchData();
  }, [open]);

  // Adicionar item ao pedido
  const handleAddItem = () => {
    setError("");

    if (!produtoId) {
      setError("Selecione um produto.");
      return;
    }

    if (quantidade < 1) {
      setError("Quantidade deve ser maior que 0.");
      return;
    }

    const produto = produtos.find((p) => p.id === Number(produtoId));
    if (!produto) return;

    const novoItem: PedidoItem = {
      id: Date.now(),
      pedidoId: 0,
      produtoId: produto.id,
      quantidade,
      produto,
    };

    setItems((prev) => [...prev, novoItem]);

    setProdutoId("");
    setQuantidade(1);
  };

  // Remover item
  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Calcular total
  const total = items.reduce(
    (acc, item) => acc + item.quantidade * (item.produto?.preco || 0),
    0
  );

  // Salvar pedido
  const handleSalvar = async () => {
    setError("");

    if (!clienteId) {
      setError("Selecione um cliente.");
      return;
    }

    if (items.length === 0) {
      setError("Adicione ao menos 1 item ao pedido.");
      return;
    }

    try {
      const itemsPayload = items.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
      }));

      const payload = {
        clienteId: Number(clienteId),
        data: new Date().toISOString(),
        items: itemsPayload,
      };

      console.log("Payload enviado:", payload);

      const pedidoCriado = await pedidoService.createPedido(payload);

      onPedidoCriado(pedidoCriado);
      onClose();

      // reset
      setClienteId("");
      setItems([]);
      setProdutoId("");
      setQuantidade(1);
      setError("");

    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || "Erro ao criar pedido.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={2}>
          Criar Pedido
        </Typography>

        <Stack spacing={2}>
          {/* Cliente */}
          <TextField
            select
            label="Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            fullWidth
          >
            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nome}
              </MenuItem>
            ))}
          </TextField>

          {/* Produto */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Produto"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              fullWidth
            >
              {produtos.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nome} — R$ {p.preco.toFixed(2)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              label="Qtd"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              sx={{ width: 120 }}
            />

            <Button variant="contained" onClick={handleAddItem}>
              Adicionar
            </Button>
          </Stack>

          {/* Tabela de itens */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="center">Qtd</TableCell>
                <TableCell align="center">Preço</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Remover</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.produto?.nome}</TableCell>
                  <TableCell align="center">{item.quantidade}</TableCell>
                  <TableCell align="center">
                    R$ {(item.produto?.preco || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    R$ {(item.quantidade * (item.produto?.preco || 0)).toFixed(
                      2
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum item adicionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Total */}
          <Typography mt={1} fontWeight="bold" textAlign="right">
            Total: R$ {total.toFixed(2)}
          </Typography>

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSalvar}
            fullWidth
          >
            Salvar Pedido
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CriarPedidoModal;
