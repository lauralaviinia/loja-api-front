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
          <TableRow className="bg-gray-800">
            {["Nome", "Preço", "Descrição", "Estoque", "Categoria ID", "Ações"].map(
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
          {produtos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                className="py-6 text-gray-500"
              >
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            produtos.map((produto) => (
              <TableRow key={produto.id} hover className="hover:bg-blue-50">
                <TableCell align="center">{produto.nome}</TableCell>
                <TableCell align="center">
                  R$ {produto.preco?.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  {produto.descricao || "-"}
                </TableCell>
                <TableCell align="center">{produto.estoque}</TableCell>
                <TableCell align="center">{produto.categoriaId}</TableCell>

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
