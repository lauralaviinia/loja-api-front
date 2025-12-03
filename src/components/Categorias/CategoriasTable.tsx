import React from "react";
import type { Categoria } from "../../types/categoria";
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

interface CategoriasTableProps {
  categorias: Categoria[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (categoria: Categoria) => void;
}

const CategoriasTable: React.FC<CategoriasTableProps> = ({
  categorias,
  deletingId,
  onDelete,
  onEdit,
}) => {
  return (
    <TableContainer className="mt-4 rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-400">
            {["Nome", "Descrição", "Produtos", "Ações"].map((header) => (
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
          {categorias.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
                className="py-6 text-gray-500"
              >
                Nenhuma categoria encontrada.
              </TableCell>
            </TableRow>
          ) : (
            categorias.map((categoria) => (
              <TableRow key={categoria.id} hover className="hover:bg-blue-50">
                {/* Nome */}
                <TableCell align="center">{categoria.nome}</TableCell>

                {/* Descrição */}
                <TableCell align="center">
                  {categoria.descricao || "—"}
                </TableCell>

                {/* Número de produtos */}
                <TableCell align="center">
                  {categoria.produto ? categoria.produto.length : 0}
                </TableCell>

                {/* Ações */}
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(categoria)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remover">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(categoria.id)}
                        disabled={deletingId === categoria.id}
                        aria-label={`remover-${categoria.id}`}
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

export default CategoriasTable;