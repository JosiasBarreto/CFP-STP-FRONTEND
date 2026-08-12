import React, { useState } from "react";
import { Tabs, Tab, Button, Col, Badge, Card, Row } from "react-bootstrap";
import { BuscarTurma, BuscarTurmadocumentos } from "../../view/sing/function";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TurmaDetalhesBootstrap from "./ComponentesTabs/Estatistica";
import axios from "axios";
import { saveAs } from "file-saver";
import { API_URL } from "../../api/urls";
import BadgeDisplay from "./ComponentesTabs/gerarcrachar";
import DocumentosPorTurma from "./ComponentesTabs/gerarcrachar";
import CracharGenerations from "./ComponentesTabs/Crachar";
import Gerarcontrato from "./ComponentesTabs/Gerar_contratos";
import GerarSeguro from "./ComponentesTabs/Gerar_seguros";
import { data } from "react-router-dom";
import { FaGraduationCap, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import QuadrosFormandos from "./ComponentesTabs/Gerar_quadros";
import QuadrosAvaliacao from "./ComponentesTabs/Gerar_avaliacao";
import GerarPresenca from "./ComponentesTabs/Gerar_presenca";
import FormandosTable from "./ComponentesTabs/index_files";
import GerarSelecionado from "./ComponentesTabs/Gerar_ficha_selecionados";

const TabsCustom = ({ searchParams, datas }) => {
  const [key, setKey] = useState("estatistica");
  const token = localStorage.getItem("token");

  const gerarDocumentos = async () => {};

  return (
    <div className="bg-light p-3 rounded">
      <Tabs
        id="custom-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-1"
      >
        <Tab eventKey="ficha-sumario" title="Dados formandos">
          <FormandosTable formandos={datas} />
        </Tab>
        <Tab eventKey="estatistica" title="Estatística">
          <Button variant="primary" onClick={gerarDocumentos}>
            Quadro dos formandos
          </Button>
        </Tab>
        <Tab eventKey="frequencia" title="Listagem de Frequência">
          {datas.map((item) => (
            <Row
              key={item.incricao_id}
              md={12}
              lg={12}
              xs={12}
              className="shadow-lg border-1 rounded-3 h-100 mb-3"
            >
              <Col xs={12} md={2} className="text-center p-3">
                <img
                  src={
                    item.foto_url ||
                    "https://tse2.mm.bing.net/th/id/OIP.ZnWcaa3QttHXFa7xjap_vAHaHa?cb=iwp2&rs=1&pid=ImgDetMain"
                  } // Usa a imagem padrão se não houver foto
                  alt={`Foto de ${item.nome}`}
                  className="rounded-circle border shadow-sm"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    marginRight: "1rem",
                  }}
                />
              </Col>
              <Col md={5} xs={12} className="">
                <div className="flex-grow-1">
                  <h5 className="text-success fw-bold mb-1">{item.nome}</h5>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Badge
                      bg="success-subtle"
                      className="fw-medium px-3 py-1 rounded-pill text-success"
                    >
                      {item.processo}
                    </Badge>
                    <Badge
                      bg="success-subtle"
                      className="fw-medium px-3 py-1 rounded-pill text-success"
                    ></Badge>
                    <Badge
                      bg="success-subtle"
                      className="fw-medium px-3 py-1 rounded-pill text-success"
                    >
                      {item.sexo}
                    </Badge>
                    {item.cursos_inscritos.map((curso, index) => {
                      const isSuplente = curso.status === "suplente";
                      const isMatriculado = !!curso.matricula_id;
                      const isFeminino = item.sexo === "Feminino";
                      const statusMatricula =
                        item?.status_matricula.toLowerCase();

                      let badgeText = "Pendente";
                      let badgeBg = "info-subtle";
                      let badgeTextColor = "text-info";

                      if (statusMatricula === "inativo") {
                        badgeText = "Desistente";
                        badgeBg = "danger-subtle";
                        badgeTextColor = "text-danger";
                      } else if (isSuplente) {
                        badgeText = "Em Espera";
                        badgeBg = "warning-subtle";
                        badgeTextColor = "text-warning";
                      } else if (isMatriculado) {
                        badgeText = isFeminino ? "Matriculada" : "Matriculado";
                        badgeBg = "primary-subtle";
                        badgeTextColor = "text-primary";
                      }

                      return (
                        <Badge
                          key={`status-${index}`}
                          bg={badgeBg}
                          className={`fw-medium px-3 py-1 rounded-pill ${badgeTextColor}`}
                        >
                          Status: {badgeText}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </Tab>
        <Tab eventKey="quadros-formandos" title="Fichas e Quadro dos Formandos">
          <Row md={12} xs={12} className="mb-3 justify-content-start mt-3">
            <QuadrosFormandos datas={searchParams} />
            <GerarPresenca datas={searchParams} data={datas} />
            <GerarSelecionado datas={searchParams} data={datas} />

            <QuadrosAvaliacao datas={searchParams} />
          </Row>
        </Tab>
        <Tab eventKey="contrato" title="Contrato">
          <Gerarcontrato datas={searchParams} />
        </Tab>
        <Tab eventKey="seguro" title="Seguro">
          <GerarSeguro datas={searchParams} />
        </Tab>
        <Tab eventKey="crachar" title="Crachár">
          <CracharGenerations datas={searchParams} />
        </Tab>
        <Tab eventKey="relatorio" title="Relatório">
          Conteúdo do Relatório
        </Tab>
      </Tabs>
    </div>
  );
};

export default TabsCustom;
