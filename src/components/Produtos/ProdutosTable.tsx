import React from "react";
import type { Produto } from "../../types/produto";

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

interface ProdutosTableProps {
  produtos: Produto[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (produto: Produto) => void;
}

const ProdutosTable: React.FC<ProdutosTableProps> = ({
  produtos,
  deletingId,
  onDelete,
  onEdit,
}) => {
  return (
    <TableContainer className="mt-4 rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-400">
            {["Nome", "Preço (R$)", "Descrição", "Categoria", "Ações"].map((header) => (
              <TableCell
                key={header}
                align="center"
                className="font-bold text-white"
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {produtos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                className="py-6 text-gray-500"
              >
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            produtos.map((produto) => (
              <TableRow key={produto.id} hover className="hover:bg-blue-50">
                {/* Nome */}
                <TableCell align="center">{produto.nome}</TableCell>

                {/* Preço */}
                <TableCell align="center">
                  {produto.preco.toFixed(2)}
                </TableCell>

                {/* Descrição */}
                <TableCell align="center">
                  {produto.descricao || "—"}
                </TableCell>

                {/* Categoria */}
                <TableCell align="center">
                  {produto.categoria?.nome || "—"}
                </TableCell>

                {/* Ações */}
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(produto)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remover">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(produto.id)}
                        disabled={deletingId === produto.id}
                        aria-label={`remover-${produto.id}`}
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

export default ProdutosTable;