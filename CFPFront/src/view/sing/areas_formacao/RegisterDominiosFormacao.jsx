import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  FloatingLabel,
  Modal,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { FaSitemap } from "react-icons/fa";
import { ButtonS } from "../../../component/Buttons.js/CustomButton";


import TableDominio from "./tabledominio";
import { CreateDominioFormacao, DeleteDominioFormacao, fetchAreasFormacao, fetchDominiosFormacao, UpdateDominioFormacao } from "./fuction_areas_formacao";
import { QAreasFormacao, QDominiosFormacao } from "../../../api/urls/nameQuery";


function RegisterDominiosFormacao() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const [contagem, setContagem] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [dominioId, setDominioId] = useState(null);

  // ✅ Buscar Domínios
  const { data: dominios, isLoading, isFetching } = useQuery({
    queryKey: [QDominiosFormacao],
    queryFn: () => fetchDominiosFormacao(token),
    refetchOnWindowFocus: false,
  });

  // ✅ Buscar Áreas (para o dropdown)
  const { data: areas } = useQuery({
    queryKey: [QAreasFormacao],
    queryFn: () => fetchAreasFormacao(token),
    refetchOnWindowFocus: false,
  });

  // ✅ Validação
  const validationSchema = Yup.object({
    nome: Yup.string()
      .required("O nome do domínio é obrigatório")
      .min(2, "O nome é muito curto"),
    area_id: Yup.string().required("Selecione uma área de formação"),
  });

  // ✅ Formik
  const formik = useFormik({
    initialValues: { nome: "", area_id: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        id: modoEdicao ? dominioId : undefined,
        nome: values.nome,
        area_id: parseInt(values.area_id),
      };

      await mutation.mutateAsync(payload);
      resetForm();
      setModalShow(false);
    },
  });

  // ✅ Mutação (criar/editar)
  const mutation = useMutation({
    mutationFn: async (dominio) =>
      modoEdicao
        ? await UpdateDominioFormacao(dominio, token)
        : await CreateDominioFormacao(dominio, token),

    onSuccess: () => {
      queryClient.invalidateQueries([QDominiosFormacao]);
      Swal.fire({
        title: "Sucesso!",
        text: modoEdicao
          ? "Domínio atualizado com sucesso!"
          : "Domínio registrado com sucesso!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    },

    onError: (error) => {
      Swal.fire({
        title: "Erro!",
        text:
          error?.response?.data?.mensagem ||
          "Falha ao salvar o domínio de formação.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    },
  });

  // ✅ Eliminar domínio
  const deletarDominio = async (id) => {
    Swal.fire({
      title: "Tens certeza?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await DeleteDominioFormacao(id, token);
          await queryClient.invalidateQueries([QDominiosFormacao]);

          Swal.fire({
            title: "Eliminado!",
            text: response.mensagem || "Domínio eliminado com sucesso!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            title: "Erro!",
            text:
              error?.data?.erro ||
              error?.data?.mensagem ||
              "Não é possível eliminar este domínio.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  // ✅ Carregar domínio no modal (edição)
  const carregarDominio = (id, nome, area_id) => {
    setDominioId(id);
    setModoEdicao(true);
    formik.setValues({ nome, area_id: area_id?.toString() || "" });
    setModalShow(true);
  };

  // ✅ Abrir modal novo
  const abrirModal = () => {
    formik.resetForm();
    setDominioId(null);
    setModoEdicao(false);
    setModalShow(true);
  };
// ✅ Contagem direta (sem animação)
useEffect(() => {
    if (dominios) {
      setContagem(dominios.length);
    }
  }, [dominios]);

  return (
    <div className="container-fluid">
      {/* Header */}
      <Row className="d-flex justify-content-between bg-success p-2 shadow mb-1 rounded">
        <h4 className="text-white">
          <FaSitemap className="m-2" /> Domínios de Formação ({contagem})
        </h4>
      </Row>

      {/* Modal */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header className="bg-success text-white rounded-top">
          <Modal.Title>
            <FaSitemap className="me-2" />
            {modoEdicao ? "Editar Domínio" : "Novo Domínio"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate onSubmit={formik.handleSubmit}>
            {/* Nome */}
            <FloatingLabel
              controlId="formNomeDominio"
              label="Nome do Domínio de Formação"
              className="mb-4"
            >
              <Form.Control
                type="text"
                name="nome"
                placeholder="Digite o nome do domínio"
                value={formik.values.nome}
                onChange={formik.handleChange}
                isInvalid={formik.touched.nome && formik.errors.nome}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.nome}
              </Form.Control.Feedback>
            </FloatingLabel>

            {/* Área */}
            <FloatingLabel
              controlId="formArea"
              label="Área de Formação"
              className="mb-4"
            >
              <Form.Select
                name="area_id"
                value={formik.values.area_id}
                onChange={formik.handleChange}
                isInvalid={formik.touched.area_id && formik.errors.area_id}
              >
                <option value="">Selecione uma área</option>
                {areas?.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.area_id}
              </Form.Control.Feedback>
            </FloatingLabel>

            {/* Botões */}
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setModalShow(false)}>
                Fechar
              </Button>
              <ButtonS
                texto={modoEdicao ? "Atualizar" : "Registar"}
                variant="success"
                type="submit"
                loadIf={formik.isSubmitting}
              />
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Tabela / Lista */}
      <TableDominio
        carregarDominio={carregarDominio}
        deletarDominio={deletarDominio}
        datas={dominios}
        isLoading={isLoading}
        isFetching={isFetching}
        funcao={abrirModal}
        contagem={contagem}
      />
    </div>
  );
}

export default RegisterDominiosFormacao;
