import React from "react";
import type { Cliente } from "../../types/cliente";
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

interface ClientesTableProps {
  clientes: Cliente[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (cliente: Cliente) => void;
}

const ClientesTable: React.FC<ClientesTableProps> = ({
  clientes,
  deletingId,
  onDelete,
  onEdit,
}) => {
  return (
    <TableContainer className="mt-4 rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-400">
            {["Nome", "Email", "Telefone", "CPF", "Data de Nascimento", "Ações"].map(
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
          {clientes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                className="py-6 text-gray-500"
              >
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            clientes.map((cliente) => (
              <TableRow key={cliente.id} hover className="hover:bg-blue-50">
                <TableCell align="center">{cliente.nome}</TableCell>
                <TableCell align="center">{cliente.email}</TableCell>
                <TableCell align="center">{cliente.telefone || "-"}</TableCell>
                <TableCell align="center">{cliente.cpf}</TableCell>
                <TableCell align="center">
                  {cliente.dataNascimento?.split("T")[0] || "-"}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(cliente)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(cliente.id)}
                        disabled={deletingId === cliente.id}
                        aria-label={`remover-${cliente.id}`}
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

export default ClientesTable;