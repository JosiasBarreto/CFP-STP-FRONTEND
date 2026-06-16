import React, {
    useState,
    useEffect,
  } from "react";
  
  import {
    Card,
    Button,
    Modal,
    Form,
    FloatingLabel,
    Row,
    Col,
    Pagination,
  } from "react-bootstrap";
  
  import { useFormik } from "formik";
  
  import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    ToastContainer,
    toast,
  } from "react-toastify";
  
  import TableComponente from "./TableComponente";
  
  import {
    fetchComponentes,
    registarComponente,
    atualizarComponente,
    deleteComponente,
  } from "./services";
  
  import { QCOMPONENTE } from "./queryKeys";
  
  import { componenteSchema } from "./validation";
import { BsPlusCircle } from "react-icons/bs";
  
  function RegisterComponente() {
    const token =
      localStorage.getItem("token");
  
    const queryClient =
      useQueryClient();
  
    const [show, setShow] =
      useState(false);
  
    const [editingId, setEditingId] =
      useState(null);
  
    const [page, setPage] =
      useState(1);
  
    const [searchNome, setSearchNome] =
      useState("");
  
    const [debouncedSearch, setDebouncedSearch] =
      useState("");
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchNome);
      }, 500);
  
      return () =>
        clearTimeout(timer);
    }, [searchNome]);
  
    const { data, isLoading } =
      useQuery({
        queryKey: [
          ...QCOMPONENTE,
          page,
          debouncedSearch,
        ],
  
        queryFn: () =>
          fetchComponentes(
            token,
            page,
            15,
            debouncedSearch
          ),
      });
  
    const mutation = useMutation({
      mutationFn: async (values) => {
        if (editingId) {
          return atualizarComponente(
            editingId,
            values,
            token
          );
        }
  
        return registarComponente(
          values,
          token
        );
      },
  
      onSuccess: () => {
        
  
        queryClient.invalidateQueries({
          queryKey: QCOMPONENTE,
        });
        toast.success(
          editingId
            ? "Componente atualizado"
            : "Componente criado"
        );
  
        fecharModal();
      },
  
      onError: (error) => {
        toast.error(
          error?.response?.data?.error ||
            "Erro ao processar"
        );
      },
    });
  
    const formik = useFormik({
      initialValues: {
        nome: "",
        descricao: "",
      },
  
      validationSchema:
        componenteSchema,
  
      onSubmit: async (
        values,
        { setSubmitting }
      ) => {
        await mutation.mutateAsync(
          values
        );
  
        setSubmitting(false);
      },
    });
  
    const abrirNovo = () => {
      setEditingId(null);
  
      formik.resetForm();
  
      setShow(true);
    };
  
    const editar = (item) => {
      setEditingId(item.ID);
  
      formik.setValues({
        nome: item.nome,
        descricao:
          item.descricao || "",
      });
  
      setShow(true);
    };
  
    const fecharModal = () => {
      setShow(false);
  
      formik.resetForm();
  
      setEditingId(null);
    };
  
    const remover = async (id) => {
      const confirmar =
        window.confirm(
          "Deseja remover este componente?"
        );
  
      if (!confirmar) return;
  
      try {
        await deleteComponente(
          id,
          token
        );
  
       
  
        queryClient.invalidateQueries({
          queryKey: QCOMPONENTE,
        });
        toast.success(
          "Componente removido"
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.error
        );
      }
    };
  
    return (
      <>
        <ToastContainer />
        <Card className="shadow p-3 mb-3">
          <Row>
            <Col md={4}>
              <Form.Control
                placeholder="Pesquisar componente..."
                value={searchNome}
                onChange={(e) =>
                  setSearchNome(
                    e.target.value
                  )
                }
              />
            </Col>
  
            <Col md={2}>
              <Button
                variant="success"
                onClick={abrirNovo}
              >
                <BsPlusCircle />
                {" Adicionar"}
              </Button>
            </Col>
  
            <Col
              md={6}
              className="text-end"
            >
              <h5>
                Total:
                {" "}
                {data?.total || 0}
              </h5>
            </Col>
          </Row>
        </Card>
  
        <Card className="shadow p-3">
          <TableComponente
            data={data}
            editar={editar}
            remover={remover}
          />
  
          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev
              disabled={page === 1}
              onClick={() =>
                setPage(page - 1)
              }
            />
  
            <Pagination.Item active>
              {page}
            </Pagination.Item>
  
            <Pagination.Next
              disabled={
                page === data?.pages
              }
              onClick={() =>
                setPage(page + 1)
              }
            />
          </Pagination>
        </Card>
  
        <Modal
          show={show}
          onHide={fecharModal}
          centered
        >
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>
              {editingId
                ? "Editar"
                : "Novo"}{" "}
              Componente
            </Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <Form
              onSubmit={
                formik.handleSubmit
              }
            >
              <FloatingLabel
                label="Nome"
                className="mb-4"
              >
                <Form.Control
                className="input_left_color p-2"
                  name="nome"
                  value={
                    formik.values.nome
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </FloatingLabel>
  
              <FloatingLabel
                label="Descrição"
              >
                <Form.Control
                  className="input_left_color "
                  as="textarea"
                  style={{
                    height: "140px",
                  }}
                  name="descricao"
                  value={
                    formik.values
                      .descricao
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </FloatingLabel>
  
              <div className="mt-3 text-end">
                <Button
                  variant="secondary"
                  onClick={
                    fecharModal
                  }
                >
                  Fechar
                </Button>
  
                <Button
                  className="ms-2"
                  type="submit"
                  variant="success"
                >
                  {editingId
                    ? "Atualizar"
                    : "Guardar"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
  
      
      </>
    );
  }
  
  export default RegisterComponente;