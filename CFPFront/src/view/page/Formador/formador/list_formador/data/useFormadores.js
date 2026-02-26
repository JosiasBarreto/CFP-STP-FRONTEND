import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { listarFormadores } from "../../../../../../api/formador.api";

export function useFormadores() {
  const [page, setPage] = useState(1);
  const perPage = 15;

  const [filtros, setFiltros] = useState({
    search: "",
    formacao_pedagogica: "",
    dominio_id: "",
    documentos_ok: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["formadores", filtros, page],
    queryFn: () =>
      listarFormadores({
        ...filtros,
        page,
        per_page: 10,
      }),
    keepPreviousData: true,
  });
  useEffect(() => {
    if (response && page > response.pages) {
      setPage(1);
    }
  }, [response, page]);
  const formadores = response?.data || [];
  const totalPages = response?.pages || 0;
  const total = response?.total || 0;
  return {
    filtros,
    setFiltros,
    data: formadores,
    isLoading: isLoading,
    page,
    setPage,
    total,
    perPage,
    pages: totalPages,
  };
}
