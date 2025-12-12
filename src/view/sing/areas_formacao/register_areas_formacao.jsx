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
import { FaLayerGroup } from "react-icons/fa";
import { ButtonS } from "../../../component/Buttons.js/CustomButton";
import {
  CreateAreasFormacao,
  DeleteAreaFormacao,
  fetchAreasFormacao,
  UpdateAreaformacoes,
} from "./fuction_areas_formacao";
import Tablearea from "./tablearea";
import { QAreasFormacao } from "../../../api/urls/nameQuery";

function RegisterAreasFormacao() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const [contagem, setContagem] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [areaId, setAreaId] = useState(null);

  // ✅ Consulta com React Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QAreasFormacao],
    queryFn: () => fetchAreasFormacao(token),
    refetchOnWindowFocus: false,
  });

  // ✅ Validação com Yup
  const validationSchema = Yup.object({
    nome: Yup.string()
      .required("O nome da área de formação é obrigatório")
      .min(3, "O nome é muito curto"),
  });

  // ✅ Formik
  const formik = useFormik({
    initialValues: { nome: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        id: modoEdicao ? areaId : undefined,
        nome: values.nome,
      };

      await mutation.mutateAsync(payload);
      resetForm();
      setModalShow(false);
    },
  });

  // ✅ Mutação (criar/editar)
  const mutation = useMutation({
    mutationFn: async (area) =>
      modoEdicao
        ? await UpdateAreaformacoes(area, token)
        : await CreateAreasFormacao(area, token),

    onSuccess: (response) => {
      queryClient.invalidateQueries([QAreasFormacao]);
      Swal.fire({
        title: "Sucesso!",
        text: modoEdicao
          ? "Área de formação atualizada com sucesso!"
          : "Área de formação registrada com sucesso!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    },

    onError: (error) => {
      Swal.fire({
        title: "Erro!",
        text: error?.response?.data?.mensagem || "Falha ao salvar a área.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    },
  });

  // ✅ Eliminar Área
  const deletarArea = async (id) => {
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
          const response = await DeleteAreaFormacao(id, token);
          await queryClient.invalidateQueries([QAreasFormacao]);

          Swal.fire({
            title: "Eliminado!",
            text: response.mensagem || "Área eliminada com sucesso!",
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
              "Não é possível eliminar esta área (possui domínios associados).",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  // ✅ Carregar área no modal (edição)
  const carregarArea = (id, nome) => {
    setAreaId(id);
    setModoEdicao(true);
    formik.setValues({ nome });
    setModalShow(true);
  };

  // ✅ Reset Modal
  const abrirModal = () => {
    formik.resetForm();
    setAreaId(null);
    setModoEdicao(false);
    setModalShow(true);
  };

  // ✅ Contagem animada
  useEffect(() => {
    if (data) {
      let count = 0;
      const timer = setInterval(() => {
        if (count < data.length) {
          setContagem(++count);
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [data]);

  return (
    <div className="container-fluid">
      {/* Header */}
      <Row className="d-flex justify-content-between bg-success p-0 shadow mb-1 rounded">
        <h4 className="text-white">
          <FaLayerGroup className="m-2" /> Áreas de Formação ({contagem})
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
            <FaLayerGroup className="me-2" />
            {modoEdicao ? "Editar Área de Formação" : "Nova Área de Formação"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <FloatingLabel
              controlId="formNomeArea"
              label="Nome da Área de Formação"
              className="mb-4 mt-2"
            >
              <Form.Control
                type="text"
                name="nome"
                placeholder="Digite o nome da área"
                value={formik.values.nome}
                onChange={formik.handleChange}
                isInvalid={formik.touched.nome && formik.errors.nome}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.nome}
              </Form.Control.Feedback>
            </FloatingLabel>

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
      <Tablearea
        carregarArea={carregarArea}
        deletarArea={deletarArea}
        datas={data}
        isLoading={isLoading}
        isFetching={isFetching}
        funcao={abrirModal}
        contagem={contagem}
      />
    </div>
  );
}

export default RegisterAreasFormacao;
