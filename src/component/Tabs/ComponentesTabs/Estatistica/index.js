import React from 'react';
import { Card, Row, Col, Container, Table, Badge } from 'react-bootstrap';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8', '#20c997', '#fd7e14'];

const TurmaDetalhesBootstrap = ({ turma }) => {
  if (!turma) return <p className="text-danger">Dados da turma não disponíveis.</p>;

  const {
    curso_info = {},
    distrito = {},
    estatisticas_inscricoes = {},
    faixa_etaria = {},
    habilitacao = {},
    sexo = {},
  } = turma;

  const faixaEtariaData = Object.entries(faixa_etaria).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
  }));

  const sexoData = Object.entries(sexo).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
  }));

  const distritoData = Object.entries(distrito).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
  }));

  return (
    <div className="my-2">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{turma.curso_info?.nome_curso}</h5>
          <Badge bg="light" text="dark">
            {curso_info.programa} - {curso_info.acao}
          </Badge>
        </Card.Header>

        <Card.Body>
          {/* Seção Informações Gerais */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="border-0 bg-light h-100 p-3">
                <h6 className="text-primary">Informações do Curso</h6>
                <p><strong>Início:</strong> {curso_info.data_inicio}</p>
                <p><strong>Término:</strong> {curso_info.data_termino}</p>
                <p><strong>Duração:</strong> {curso_info.duracao} meses</p>
                <p><strong>Horário:</strong> {curso_info.horario} - {curso_info.horario_termino}</p>
                <p><strong>Local:</strong> {curso_info.local_realizacao}</p>
                <p><strong>Alunos por turma:</strong> {curso_info.alunos_por_turma}</p>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 bg-light h-100 p-3">
                <h6 className="text-primary">Estatísticas de Inscrição</h6>
                <Table size="sm" striped hover responsive>
                  <tbody>
                    <tr><td>Total de Inscritos</td><td>{estatisticas_inscricoes.total_inscritos}</td></tr>
                    <tr><td>Selecionados</td><td>{estatisticas_inscricoes.selecionados}</td></tr>
                    <tr><td>Não Selecionados</td><td>{estatisticas_inscricoes.nao_selecionados}</td></tr>
                    <tr><td>Primeira Opção</td><td>{estatisticas_inscricoes.primeira_opcao}</td></tr>
                    <tr><td>Segunda Opção</td><td>{estatisticas_inscricoes.segunda_opcao}</td></tr>
                    <tr><td>Desistentes</td><td>{estatisticas_inscricoes.desistidos}</td></tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>

          <hr className="my-4" />

          {/* Seção Gráficos: Sexo e Faixa Etária */}
          <Row className="mb-3">
            <Col md={3}>
              <Card className="p-3">
                <h6 className="text-center text-secondary">Distribuição por Sexo</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={sexoData} dataKey="value" nameKey="name" outerRadius={80}>
                      {sexoData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="p-3">
                <h6 className="text-center text-secondary">Faixa Etária</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={faixaEtariaData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Seção Distrito */}
          <Card className="p-3">
            <h6 className="text-center text-secondary">Distribuição por Distrito</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distritoData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TurmaDetalhesBootstrap;
