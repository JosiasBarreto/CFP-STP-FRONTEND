import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Form,
  Row,
  Spinner,
  Alert,
  Badge,
  InputGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getDominios } from "../../../../../../api/listas.api";
import {
  adicionarDominiosFormador,
  obterDominiosFormador,
} from "../../../../../../api/formador.api";

/**
 * StepDominios
 * UX: Pesquisa + Accordion por Área
 */
export default function StepDominios({
  formadorId,
  onNext,
  onBack,
}) {
  const [selecionados, setSelecionados] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  /* 🔹 TODOS os domínios */
  const {
    data: dominios = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dominios"],
    queryFn: getDominios,
  });

  /* 🔹 Domínios do formador (AJUSTADO AO BACKEND) */
  const {
    data: dominiosFormador = [],
    isLoading: loadingFormador,
  } = useQuery({
    queryKey: ["dominios-formador", formadorId],
    queryFn: () => obterDominiosFormador(formadorId),
    
    select: (response) => response?.dominios ?? [],
  });

  /* 🔹 Pré-selecionar domínios existentes */
  useEffect(() => {
    if (
      dominiosFormador.length > 0 &&
      selecionados.length === 0
    ) {
      setSelecionados(dominiosFormador.map((d) => d.id));
    }
  }, [dominiosFormador, selecionados.length]);

  /* 🔹 Pesquisa */
  const dominiosFiltrados = useMemo(() => {
    if (!pesquisa) return dominios;

    const termo = pesquisa.toLowerCase();
    return dominios.filter(
      (d) =>
        d.nome.toLowerCase().includes(termo) ||
        d.area_nome.toLowerCase().includes(termo)
    );
  }, [pesquisa, dominios]);

  /* 🔹 Agrupar por área */
  const dominiosPorArea = useMemo(() => {
    return dominiosFiltrados.reduce((acc, d) => {
      if (!acc[d.area_id]) {
        acc[d.area_id] = {
          area_nome: d.area_nome,
          dominios: [],
        };
      }
      acc[d.area_id].dominios.push(d);
      return acc;
    }, {});
  }, [dominiosFiltrados]);

  /* 🔹 Toggle domínio */
  const toggleDominio = (id) => {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((d) => d !== id)
        : [...prev, id]
    );
  };

  /* 🔹 Guardar (criar / atualizar) */
  const mutation = useMutation({
    mutationFn: adicionarDominiosFormador,
    onSuccess: () => {
      Swal.fire(
        "Sucesso",
        "Domínios atualizados com sucesso",
        "success"
      );
      onNext();
    },
    onError: () => {
      Swal.fire(
        "Erro",
        "Erro ao guardar domínios",
        "error"
      );
    },
  });

  const handleSubmit = () => {
    if (selecionados.length === 0) {
      Swal.fire(
        "Atenção",
        "Selecione pelo menos um domínio",
        "warning"
      );
      return;
    }

    mutation.mutate({
      formadorId,
      dominios: selecionados,
    });
  };

  /* 🔹 Estados */
  if (isLoading || loadingFormador)
    return <Spinner animation="border" />;

  if (isError)
    return (
      <Alert variant="danger">
        Erro ao carregar domínios
      </Alert>
    );

  return (
    <>
      <h5 className="mb-3">
        Seleção de Domínios do Formador
      </h5>

      {dominiosFormador.length > 0 && (
        <Alert variant="info">
          ℹ️ Este formador já possui domínios associados.
          Pode adicionar ou remover conforme necessário.
        </Alert>
      )}

      {/* 🔍 Pesquisa */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Pesquisar domínio ou área..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <InputGroup.Text>🔍</InputGroup.Text>
      </InputGroup>

      {Object.keys(dominiosPorArea).length === 0 && (
        <Alert variant="warning">
          Nenhum domínio encontrado
        </Alert>
      )}

      {/* 📂 Accordion por área */}
      <Accordion alwaysOpen>
        {Object.entries(dominiosPorArea).map(
          ([areaId, area]) => {
            const totalSelecionados =
              area.dominios.filter((d) =>
                selecionados.includes(d.id)
              ).length;

            return (
              <Accordion.Item
                eventKey={areaId}
                key={areaId}
              >
                <Accordion.Header>
                  {area.area_nome}
                  {totalSelecionados > 0 && (
                    <Badge
                      bg="success"
                      className="ms-2"
                    >
                      {totalSelecionados}
                    </Badge>
                  )}
                </Accordion.Header>

                <Accordion.Body>
                  <Row>
                    {area.dominios.map((d) => (
                      <Col
                        md={6}
                        lg={4}
                        key={d.id}
                        className="mb-2"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`dominio-${d.id}`}
                          label={d.nome}
                          checked={selecionados.includes(
                            d.id
                          )}
                          onChange={() =>
                            toggleDominio(d.id)
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            );
          }
        )}
      </Accordion>

      {/* ⏭ Navegação */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="secondary"
          onClick={onBack}
        >
          ⬅ Voltar
        </Button>

        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading
            ? "A guardar..."
            : "Guardar e Continuar ➡"}
        </Button>
      </div>
    </>
  );
}
