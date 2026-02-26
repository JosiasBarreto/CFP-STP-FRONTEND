import React, { useMemo, useState } from "react";
import {
  Table,
  Badge,
  Button,
  Pagination,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { FaEye, FaCheckCircle, FaTimesCircle, FaSort } from "react-icons/fa";
import FormadorDetailsModal from "./details/FormadorDetailsModal";

export default function FormadoresTable({
  data = [],
  onView,
  page,
  setPage,
  perPage,
  setPerPage,
  total,
  pages,
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "nome",
    direction: "asc",
  });
  const [showModal, setShowModal] = useState(false);
const [formadorSelecionado, setFormadorSelecionado] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((f) =>
      f.nome?.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!aValue || !bValue) return 0;

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (Array.isArray(aValue)) {
        return sortConfig.direction === "asc"
          ? aValue.length - bValue.length
          : bValue.length - aValue.length;
      }

      return 0;
    });

    return filtered;
  }, [data, search, sortConfig]);

  if (loading) {
    return <div className="text-center py-5">A carregar dados...</div>;
  }

  return (
    <Row className="bg-white p-2 rounded-3 shadow-sm mt-1">
      {/* CONTROLOS */}
      

      {/* TABELA */}
      <Table hover responsive className="align-middle mb-0">
        <thead>
          <tr>
            <th role="button" onClick={() => handleSort("codigo")}>Código <FaSort/></th>
            <th role="button" onClick={() => handleSort("nome")}>
              Nome <FaSort />
            </th>
            <th>Áreas</th>
            <th>Habilitação</th>
            <th role="button" onClick={() => handleSort("distrito")}>
              Distrito <FaSort />
            </th>
            <th>Pedagogia</th>
            
            <th className="text-end">Ações</th>
          </tr>
        </thead>

        <tbody>
          {filteredAndSortedData.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-muted py-4">
                Nenhum formador encontrado
              </td>
            </tr>
          )}

          {filteredAndSortedData.map((f) => {
            const habilitacao =
              f.formacoes?.find(
                (x) => x.tipo_formacao?.categoria === "Habilitação Literária"
              )?.tipo_formacao?.nome || "-";

            return (
              <tr key={f.id}>
                <td className="fw-semibold">{f.codigo}</td>
                <td>{f.nome}</td>

                <td>
                  {f.areas_formacao?.slice(0, 2).map((a, i) => (
                    <Badge bg="success" key={i} className="me-1 ">
                      {a}
                    </Badge>
                  ))}
                  {f.areas_formacao?.length > 2 && (
                    <Badge bg="light" text="dark">
                      +{f.areas_formacao.length - 2}
                    </Badge>
                  )}
                </td>

                <td>{habilitacao}</td>
                <td>{f.distrito}</td>

                <td>
                  <Badge bg={f.formacao_pedagogica ? "success" : "secondary"}>
                    {f.formacao_pedagogica ? "Sim" : "Não"}
                  </Badge>
                </td>

                

                <td className="text-end">
                <Button
  size="sm"
  variant="outline-primary"
  onClick={() => {
    setFormadorSelecionado(f);
    setShowModal(true);
  }}
>
  Ver detalhes
</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* PAGINAÇÃO */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Mostrando {filteredAndSortedData.length} de {total} formadores
        </div>

        {pages > 1 && (
          <Pagination>
            <Pagination.Prev
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            />
            {[...Array(pages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
            />
          </Pagination>
        )}
      </div>
      <FormadorDetailsModal
  show={showModal}
  onHide={() => setShowModal(false)}
  formador={formadorSelecionado}
/>
    </Row>
  );
}
