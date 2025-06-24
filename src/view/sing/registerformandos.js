import React from "react";
import { FiSave, FiEdit, FiXCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Form, Col, Row, FloatingLabel, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";

import { ButtonS } from "../../component/Buttons.js/CustomButton";

import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchCursosAno, fetchProgramas, LastIdFormando } from "./function";
import { Qprograma } from "../../api/urls/nameQuery";

import DadosFormandos from "./componenteformando/dadosformandos";
import { useRegistrarFormando } from "../../api/routes/formandos/registerformandos";
import { useEditarFormando } from "../../api/routes/formandos/updateformandos";
import { useNavigate } from 'react-router-dom';


  
const Registerformandos = () => {
  const token = localStorage.getItem("token");
  const [preview, setPreview] = useState(null);
  const location = useLocation();
  const [dadosEditaveis, setDadosEditaveis] = useState(location.state?.dadosFormando || {});
const navigate = useNavigate();

  const resetarLocation = () => {
    navigate('.', { state: { dadosFormando: {} }, replace: true });
  };
  // Atualizado para React Query v5
  const { data, isLoading, isFetching } = useQuery({
    queryKey: Qprograma,
    queryFn: () => fetchProgramas(token),
    refetchInterval: 300000, // 5 minutos
    refetchOnWindowFocus: false, // Recarrega quando a janela ganha foco
    refetchOnReconnect: true, // Recarrega quando a conexão é restabelecida
    refetchOnMount: false, // Não recarrega ao montar o componente
    
   
  });
  
  const { data: lastid  } = useQuery({
    queryKey: "lastid",

    queryFn: () => LastIdFormando(token),
  });
  const resetarDados = () => {
    
    setDadosEditaveis(location.state?.dadosFormando.current);
  };

  // Quando formik tem uma foto existente (edição)

  useEffect(() => {
    if (dadosEditaveis) {
      
      // Extrair as opções de cursos antes de definir os valores
      const primeiraOpcao =
        dadosEditaveis.cursos_inscritos?.find((c) => c.opcao === "1") || {};
      const segundaOpcao =
        dadosEditaveis.cursos_inscritos?.find((c) => c.opcao === "2") || {};
     

      // Criar objeto de valores convertidos
      const valoresConvertidos = {
        nome: dadosEditaveis.nome || "",
        nomepai: dadosEditaveis.nome_pai || "",
        nomemae: dadosEditaveis.nome_mae || "",
        sexo: dadosEditaveis.sexo || "",
        datanascimento: dadosEditaveis.data_nascimento || "",
        telefone: dadosEditaveis.contacto || "",
        telefone2: dadosEditaveis.contacto_opcional || "",
        nif: dadosEditaveis.nif || "",
        morada: dadosEditaveis.zona || "",
        nacionalidade: dadosEditaveis.nacionalidade || "",
        email: dadosEditaveis.email || "",
        numero_bi: dadosEditaveis.bi || "",
        distrito: dadosEditaveis.distrito || "",
        naturalidade: dadosEditaveis.naturalidade || "",
        estadocivil: dadosEditaveis.estado_civil || "",
        profissao: dadosEditaveis.ocupacao || "",
        experiencia: dadosEditaveis.experiencia_profissional || "",
        habilitacao: dadosEditaveis.habilitacao_literaria || "",
        arquivo_indentficacao: dadosEditaveis.arquivo_identificacao || "",
        agregadofamiliar: dadosEditaveis.agregado || 0,
        anoexecucao: dadosEditaveis.ano || new Date().getFullYear(),
        observacao: dadosEditaveis.observacao || "",
        // Cursos e inscrição
        curso_primeiraopcao: primeiraOpcao.curso_id ?? "",
        id_curso_inscricao1: primeiraOpcao.id_curso_incricao ?? "",
        curso_segundaopcao: segundaOpcao.curso_id ?? "",
        id_curso_inscricao2: segundaOpcao.id_curso_incricao ?? "",
        situacao: dadosEditaveis.status || "",
        ocupacao: dadosEditaveis.ocupacao || "",
        motivo: dadosEditaveis.motivo_inscricao || "",
        arquivo_foto: dadosEditaveis.foto_url || "",
        inscricao: dadosEditaveis.incricao_id || lastid?.id || 0,
        processo: dadosEditaveis.processo || "",
        programa: primeiraOpcao.id_programa ?? "",
        data: dadosEditaveis.data_criacao
          ? new Date(dadosEditaveis.data_criacao).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      };

      // Atualizar os valores no Formik
      Object.keys(valoresConvertidos).forEach((campo) => {
        formik.setFieldValue(campo, valoresConvertidos[campo]);
      });
    } else {
      formik.setFieldValue("inscricao", lastid + 1);
    }
  }, [dadosEditaveis, lastid]);

  const validationSchema = Yup.object().shape({
    inscricao: Yup.number(),
    processo: Yup.string(),
    nome: Yup.string().required("Nome do Formando é obrigatório"),
    nomepai: Yup.string(),
    nomemae: Yup.string(),
    sexo: Yup.string().required("Sexo é obrigatório"),
    datanascimento: Yup.date().required("Data de Nascimento é obrigatória"),
    telefone: Yup.string().required("Contacto é obrigatório"),
    telefone2: Yup.string(),
    nif: Yup.string(),
    morada: Yup.string().required("Morada é obrigatória"),
    nacionalidade: Yup.string(),
    email: Yup.string().email("Email inválido"), // ✨ pode validar email aqui
    numero_bi: Yup.string()
      .required("Número do Identificação é obrigatório")
      .max(9, "Número de Identificação inválido"),
    distrito: Yup.string().required("Distrito é obrigatório"),
    naturalidade: Yup.string(),
    estadocivil: Yup.string().required("Estado Civil é obrigatório"),
    profissao: Yup.string(),
    experiencia: Yup.string(),
    habilitacao: Yup.string().required("Habilitação é obrigatória"),
    arquivo_indentficacao: Yup.string().required(
      "Arquivo de Identificação é obrigatório"
    ),
    agregadofamiliar: Yup.number(), // ✅ precisa dos parênteses
    anoexecucao: Yup.number()
      .required("Ano de Execução é obrigatório")
      .min(2001, "Ano de Execução inválido")
      .max(new Date().getFullYear(), "Ano de Execução inválido"),
    curso_primeiraopcao: Yup.number().required("Curso é obrigatório"),
    curso_segundaopcao: Yup.number().notOneOf(
      [Yup.ref("curso_primeiraopcao")],
      "A segunda opção não pode ser igual à primeira"
    ),
    situacao: Yup.string(),
    ocupacao: Yup.string(),
    motivo: Yup.string(),
    arquivo_foto: Yup.string(),
    data: Yup.date(),
    programa: Yup.number(),
    observacao: Yup.string(),
    id_curso_inscricao1: Yup.number(),
    id_curso_inscricao2: Yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      nome: "",
      nomepai: "",
      nomemae: "",
      sexo: "",
      datanascimento: "",
      telefone: "",
      nif: "",
      morada: "",
      nacionalidade: "Santomense",
      email: "",
      numero_bi: "",
      distrito: "",
      naturalidade: "Conceição São Tomé",
      estadocivil: "",
      profissao: "",
      experiencia: "",
      habilitacao: "",
      arquivo_indentficacao: "C.I.C.C",
      agregadofamiliar: 0,
      anoexecucao: new Date().getFullYear(),
      curso_primeiraopcao: "",
      curso_segundaopcao: "",
      situacao: "",
      ocupacao: "",
      motivo: "",
      arquivo_foto: "",
      data: new Date().toISOString().split("T")[0],

      processo: 0,
      programa: 0,
      telefone2: "",
      observacao: "",
      id_curso_inscricao1: 0,
      id_curso_inscricao2: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        await mutation.mutateAsync(values);
      } finally {
        setSubmitting(false);
        
      }
    },
  });
  const mutation = useRegistrarFormando(token, formik, setPreview);
  const editarMutation = useEditarFormando(token, setPreview, formik, setDadosEditaveis, resetarDados);
  const {
    data: cursos,
    isLoadingcurso,
    isFetchingcurso,
  } = useQuery({
    queryKey: ["cursos", formik.values.anoexecucao],
    queryFn: () =>
      fetchCursosAno(token, { ano_execucao: formik.values.anoexecucao }),
    enabled: formik.values.anoexecucao?.toString().length >= 4,
  });

  const cursosFiltradosPorPrograma = React.useMemo(() => {
    if (!cursos || !formik.values.programa) return cursos || [];

    const programaId = parseInt(formik.values.programa, 10); // conversão aqui

    return cursos.filter((curso) => curso.programa_id === programaId);
  }, [cursos, formik.values.programa]);
 useEffect(() => {
  if (!dadosEditaveis && lastid?.id) {
    const novaInscricao = lastid;
    console.log("Setando inscrição:", novaInscricao);
    formik.setFieldValue("inscricao", novaInscricao);
  }
}, [lastid, dadosEditaveis, formik]);


  return (
    <>
      <div md={12} xs={12} className="p-3 bg-white border-1 rounded shadow ">
        <Row className="d-flex justify-content-center align-items-center  mt-1 mb-3 " >
          <p className="text-success fw-bolder fs-5 border-2 border-bottom border-success">
            REGISTOS DOS FORMANDOS
          </p>
        </Row>

        <DadosFormandos
          formik={formik}
          preview={preview}
          setPreview={setPreview}
        />

        <Row md={12} xs={12}>
          <Col md={4}>
            <FloatingLabel
              
              className="mb-4 w-auto"
              label="Formação Profissional"
            >
              <Form.Control
                className="input_left_color p-2"
                as={"textarea"}
                type="text"
                rows={4}
                name="profissao"
                id="profissao"
                placeholder="Digite a Formação Profissional"
                value={formik.values.profissao}
                onChange={formik.handleChange}
                isInvalid={formik.touched.profissao && formik.errors.profissao}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.profissao}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={4}>
            <FloatingLabel
              
              className="mb-4 w-auto"
              label="Experiência Profissional"
            >
              <Form.Control
                className="input_left_color p-2"
                as={"textarea"}
                type="text"
                rows={4}
                name="experiencia"
                id="experiencia"
                placeholder="Digite a Experiência Profissional"
                value={formik.values.experiencia}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.experiencia && formik.errors.experiencia
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.experiencia}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              
              className="mb-4 w-auto"
              label="Motivo"
            >
              <Form.Control
                className="input_left_color p-2"
                as={"textarea"}
                rows={4}
                name="motivo"
                id="motivo"
                placeholder="Digite o Motivo"
                value={formik.values.motivo}
                onChange={formik.handleChange}
                isInvalid={formik.touched.motivo && formik.errors.motivo}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.motivo}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row md={12} xs={12}>
          <Col md={4}>
            <FloatingLabel
              
              className="mb-4 w-auto"
              label="Programa"
            >
              <Form.Select
                className="input_left_color p-2"
                name="programa"
                id="programa"
                value={formik.values.programa}
                onChange={formik.handleChange}
                isInvalid={formik.touched.programa && formik.errors.programa}
              >
                <option value="">Selecione o Programa</option>
                {data &&
                  data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.programa}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={4}>
            <FloatingLabel
              
              className="mb-4 w-auto"
              label="Curso Primeira Opção"
            >
              <Form.Select
                className="input_left_color p-2"
                name="curso_primeiraopcao"
                id="curso_primeiraopcao"
                value={formik.values.curso_primeiraopcao}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.curso_primeiraopcao &&
                  formik.errors.curso_primeiraopcao
                }
                disabled={isLoadingcurso || isFetchingcurso}
              >
                {isLoadingcurso || isFetchingcurso ? (
                  <option value="">A processar...</option>
                ) : cursosFiltradosPorPrograma.length === 0 ? (
                  <option value="">Nenhum curso disponível</option>
                ) : (
                  <>
                    <option value="">Selecione o Curso</option>
                    {cursosFiltradosPorPrograma.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.acao !== "defaultvalue" ? `${item.acao} ` : ""}
                        {item.nome}
                      </option>
                    ))}
                  </>
                )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.curso_primeiraopcao}
              </Form.Control.Feedback>
              <Form.Control
             style={{ display: "none" }}
            className="input_left_color p-2"
            type="text"
            name="ocupacao"
            id="ocupacao"
            placeholder="Digite a ocupação"
            value={formik.values.id_curso_inscricao1}
            onChange={formik.handleChange}
            isInvalid={
              formik.touched.id_curso_inscricao1 &&
              formik.errors.id_curso_inscricao1
            }id_curso_incricao1
          />
            </FloatingLabel>
           
          </Col>
          <Col md={4}>
            <FloatingLabel
              
              className="mb-4 w-auto"
              label="Curso Segunda Opção"
            >
              <Form.Select
                className="input_left_color p-2"
                name="curso_segundaopcao"
                id="curso_segundaopcao"
                value={formik.values.curso_segundaopcao}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.curso_segundaopcao &&
                  formik.errors.curso_segundaopcao
                }
                disabled={isLoadingcurso || isFetchingcurso} // desativa durante o loading
              >
                {isLoadingcurso || isFetchingcurso ? (
                  <option value="">A processar...</option>
                ) : (
                  <>
                    <option value="">Selecione o Curso</option>
                    {cursos &&
                      cursos.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.acao !== "defaultvalue" ? `${item.acao} ` : ""}
                          {item.nome}
                        </option>
                      ))}
                  </>
                )}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {formik.errors.curso_segundaopcao}
              </Form.Control.Feedback>
            </FloatingLabel>
            <Form.Control
              style={{ display: "none" }}
              className="input_left_color p-2"
              type="text"
              name="ocupacao"
              id="ocupacao"
              placeholder="Digite a ocupação"
              value={formik.values.id_curso_inscricao2}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.id_curso_inscricao2 &&
                formik.errors.id_curso_inscricao2
              }
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FloatingLabel
              
              className="mb-4 w-auto"
              label="Observação"
            >
              <Form.Control
                className="input_left_color p-2"
                as={"textarea"}
                rows={4}
                name="observacao"
                id="observacao"
                placeholder="Comente as observação"
                value={formik.values.observacao}
                onChange={formik.handleChange}
                isInvalid={formik.touched.observacao && formik.errors.observacao}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.observacao}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="g-3 mt-0 d-flex justify-content-end align-items-center">
          <Col xs="auto">
            <Button
              variant="secondary"
              className="d-flex align-items-center gap-2 px-3"
              onClick={() => {
                formik.resetForm();
                resetarDados();
                resetarLocation();
              }}
            >
              <FiXCircle size={18} />
              Limpar
            </Button>
          </Col>
          {location.state?.dadosFormando && (
            <Col xs="auto">
              <ButtonS
                texto={
                  <span className="d-flex align-items-center gap-2">
                    <FiEdit size={18} />
                    Editar
                  </span>
                }
                variant="success"
                loadIfn={formik.isSubmitting}
                onClick={() => {
                  editarMutation.mutate({
                    valores: formik.values,
                  });
                  
                }}
                disabled={formik.isSubmitting}
              />
            </Col>
          )}
          {!location.state?.dadosFormando && (
            <Col xs="auto">
              <ButtonS
                texto={
                  <span className="d-flex align-items-center gap-2">
                    <FiSave size={18} />
                    Registrar
                  </span>
                }
                variant="success"
                loadIfn={formik.isSubmitting}
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
              />
            </Col>
          )}

          <Col xs={12}>
            <Form.Text className="text-muted mt-2">
              {formik.isSubmitting && "A processar... "}
              {formik.isValidating && "A validar... "}
              {formik.isSubmitting && formik.isValidating && "A processar..."}
            </Form.Text>
          </Col>
        </Row>
      </div>

      <ToastContainer />
    </>
  );
};

export default Registerformandos;
