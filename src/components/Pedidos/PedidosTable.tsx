import React from "react";
import type { Pedido } from "../../types/pedido";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface PedidosTableProps {
  pedidos: Pedido[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (pedido: Pedido) => void;
}

const PedidosTable: React.FC<PedidosTableProps> = ({
  pedidos,
  deletingId,
  onDelete,
  onEdit,
}) => {
  return (
    <TableContainer className="mt-4 rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-400">
            {["Cliente", "Status", "Data", "Total (R$)", "Ações"].map(
              (header) => (
                <TableCell
                  key={header}
                  align="center"
                  className="font-bold text-white"
                >
                  {header}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {pedidos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                className="py-6 text-gray-500"
              >
                Nenhum pedido encontrado.
              </TableCell>
            </TableRow>
          ) : (
            pedidos.map((pedido) => (
              <TableRow key={pedido.id} hover className="hover:bg-blue-50">
                {/* Nome do cliente */}
                <TableCell align="center">
                  {pedido.cliente?.nome || "—"}
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  {pedido.status || "—"}
                </TableCell>

                {/* Data */}
                <TableCell align="center">
                  {pedido.data ? pedido.data.split("T")[0] : "—"}
                </TableCell>

                {/* Total */}
                <TableCell align="center">
                  {typeof pedido.total === "number"
                    ? pedido.total.toFixed(2)
                    : "0.00"}
                </TableCell>

                {/* Botões */}
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(pedido)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remover">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(pedido.id)}
                        disabled={deletingId === pedido.id}
                        aria-label={`remover-${pedido.id}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PedidosTable;