import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Pedido, PedidoItem } from "../../types/pedido";
import type { Cliente } from "../../types/cliente";
import type { Produto } from "../../types/produto";

import pedidoService from "../../services/pedidoService";
import clienteService from "../../services/clienteService";
import produtoService from "../../services/produtoService";

interface EditarPedidoModalProps {
  open: boolean;
  pedido: Pedido | null;
  onClose: () => void;
  onSave: (pedidoAtualizado: Pedido) => void;
}

const EditarPedidoModal: React.FC<EditarPedidoModalProps> = ({
  open,
  pedido,
  onClose,
  onSave,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [formData, setFormData] = useState<any>({
    id: 0,
    clienteId: "",
    status: "PENDENTE",
    items: [] as PedidoItem[],
  });

  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // =========================================================
  // Carregar dados ao abrir modal
  // =========================================================
  useEffect(() => {
    if (!open || !pedido) return;

    const load = async () => {
      try {
        const listaClientes = await clienteService.getClientes();
        const listaProdutos = await produtoService.getProdutos();

        setClientes(listaClientes);
        setProdutos(listaProdutos);

        setFormData({
          id: pedido.id,
          clienteId: pedido.clienteId,
          status: pedido.status,
          items: pedido.items.map((it) => ({
            ...it,
            produto: listaProdutos.find((p) => p.id === it.produtoId) || null,
          })),
        });
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    };

    load();
  }, [open, pedido]);

  // =========================================================
  // Total do pedido
  // =========================================================
  const total = formData.items.reduce(
    (acc: number, item: PedidoItem) =>
      acc + item.quantidade * (item.produto?.preco ?? 0),
    0
  );

  // =========================================================
  // Alteração inputs gerais
  // =========================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // =========================================================
  // Adicionar Item
  // =========================================================
  const handleAddItem = () => {
    setErro("");

    if (!produtoId) {
      setErro("Escolha um produto.");
      return;
    }

    const produtoSelect = produtos.find((p) => p.id === Number(produtoId));
    if (!produtoSelect) return;

    const novoItem: PedidoItem = {
      id: Math.random(), // ❗Corrigido para ID único local
      pedidoId: formData.id,
      produtoId: produtoSelect.id,
      quantidade,
      produto: produtoSelect,
    };

    setFormData((prev: any) => ({
      ...prev,
      items: [...prev.items, novoItem],
    }));

    setProdutoId("");
    setQuantidade(1);
  };

  // =========================================================
  // Remover item
  // =========================================================
  const handleRemoveItem = (id: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.filter((item: PedidoItem) => item.id !== id),
    }));
  };

  // =========================================================
  // Alterar quantidade
  // =========================================================
  const handleChangeQtd = (id: number, value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.map((it: PedidoItem) =>
        it.id === id ? { ...it, quantidade: value } : it
      ),
    }));
  };

  // =========================================================
  // Salvar alterações
  // =========================================================
  const handleSave = async () => {
    setErro("");

    if (!formData.clienteId) {
      setErro("Selecione um cliente.");
      return;
    }

    if (formData.items.length === 0) {
      setErro("O pedido deve ter ao menos 1 item.");
      return;
    }

    setSalvando(true);

    try {
      const atualizado = await pedidoService.updatePedido(formData.id, {
        clienteId: Number(formData.clienteId),
        status: formData.status,
        items: formData.items.map((i: PedidoItem) => ({
          produtoId: i.produtoId,
          quantidade: Number(i.quantidade),
        })),
      });

      onSave(atualizado);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      setErro("Erro ao salvar pedido.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Editar Pedido
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Cliente */}
          <TextField
            select
            fullWidth
            label="Cliente"
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
          >
            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nome}
              </MenuItem>
            ))}
          </TextField>

          {/* Status */}
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="PENDENTE">PENDENTE</MenuItem>
            <MenuItem value="PAGO">PAGO</MenuItem>
            <MenuItem value="CANCELADO">CANCELADO</MenuItem>
          </TextField>

          {/* Produtos */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Produto"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
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
              sx={{ width: 120 }}
              value={quantidade}
              onChange={(e) =>
                setQuantidade(Math.max(1, Number(e.target.value)))
              }
            />

            <Button variant="contained" onClick={handleAddItem}>
              Adicionar
            </Button>
          </Box>

          {/* Tabela */}
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
              {formData.items.map((item: PedidoItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.produto?.nome}</TableCell>

                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.quantidade}
                      onChange={(e) =>
                        handleChangeQtd(
                          item.id,
                          Math.max(1, Number(e.target.value))
                        )
                      }
                      sx={{ width: 70 }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    R$ {item.produto?.preco.toFixed(2)}
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

              {formData.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum item no pedido.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Typography fontWeight="bold" textAlign="right" mt={1}>
            Total: R$ {total.toFixed(2)}
          </Typography>

          {erro && (
            <Typography color="error" textAlign="center">
              {erro}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarPedidoModal;