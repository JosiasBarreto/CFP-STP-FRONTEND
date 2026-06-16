import React from "react";
import {
  Dropdown,
  ToastContainer,
  Modal,
  FloatingLabel,
  Form,
  Button,
} from "react-bootstrap";

import { FaUserCircle, FaSignOutAlt, FaEdit, FaKey } from "react-icons/fa";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../api/urls";
import Swal from "sweetalert2";
const UserMenu = ({ userName, onLogout, onEditProfile, onChangePassword }) => {
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);

  // =========================
  // FORM EDITAR PERFIL
  // =========================
  const profileFormik = useFormik({
    enableReinitialize: true,

    initialValues: {
      nome: userName?.nome || "",
      email: userName?.email || "",
    },

    validationSchema: Yup.object({
      nome: Yup.string().required("Nome é obrigatório"),

      email: Yup.string()
        .email("Email inválido")
        .required("Email é obrigatório"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.put(API_URL + "/api/user/profile", values);

        setShowProfileModal(false);
        profileFormik.resetForm();
        Swal.fire({
          icon: "success",
          title: "Perfil atualizado com sucesso!",
          text: response.data.message || "Atualização bem-sucedida.",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro ao atualizar perfil",
          text: error.response?.data?.message || "Tente novamente mais tarde.",
        });
      }
    },
  });

  // FORM ALTERAR SENHA
  // =========================
  const passwordFormik = useFormik({
    initialValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    },

    validationSchema: Yup.object({
      senhaAtual: Yup.string().required("A senha atual é obrigatória"),

      novaSenha: Yup.string()
        .min(6, "Mínimo de 6 caracteres")
        .required("Nova senha obrigatória"),

      confirmarSenha: Yup.string()
        .oneOf([Yup.ref("novaSenha")], "As senhas não coincidem")
        .required("Confirme a senha"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          API_URL + "/users/update_password",
          {
            email: userName?.email,
            id: userName?.id,
            senhaAtual: values.senhaAtual,
            nova_senha: values.novaSenha,
          }
        );

          Swal.fire({
          icon: "success",
          title: "Senha alterada com sucesso!",
          text: response.data.message || "Alteração bem-sucedida.",
        });

        resetForm();
        setShowPasswordModal(false);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro ao alterar senha",
          text: error.response?.data?.message || "Tente novamente mais tarde.",
        });
      }
    },
  });

  return (
    <>
      <Dropdown align="end">
        <ToastContainer />

        <Dropdown.Toggle
          variant="light"
          id="dropdown-user"
          className="d-flex align-items-center border-0 shadow-sm px-3 py-2"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "2rem",
          }}
        >
          <FaUserCircle size={24} className="me-2 text-success" />

          <span className="fw-semibold">{userName?.nome}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="shadow-sm mt-2 border-0 rounded-4">
          <Dropdown.Item onClick={() => setShowProfileModal(true)} disabled >
            <FaEdit className="me-2 text-info" />
            Editar Informações
          </Dropdown.Item>

          <Dropdown.Item onClick={() => setShowPasswordModal(true)}>
            <FaKey className="me-2 text-warning" />
            Redefinir Senha
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item onClick={onLogout} className="text-secondary">
            <FaSignOutAlt className="me-2" />
            Sair
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* ===================================== */}
      {/* MODAL EDITAR PERFIL */}
      {/* ===================================== */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <FaUserCircle className="me-2" />
            Editar Perfil
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form onSubmit={profileFormik.handleSubmit}>
            <FloatingLabel label="Nome" className="mb-4">
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="nome"
                placeholder="Nome"
                value={profileFormik.values.nome}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                isInvalid={
                  profileFormik.touched.nome && !!profileFormik.errors.nome
                }
              />

              <Form.Control.Feedback type="invalid">
                {profileFormik.errors.nome}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Email" className="mb-3">
              <Form.Control
                className="input_left_color p-2"
                type="email"
                name="email"
                placeholder="Email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                isInvalid={
                  profileFormik.touched.email && !!profileFormik.errors.email
                }
              />

              <Form.Control.Feedback type="invalid">
                {profileFormik.errors.email}
              </Form.Control.Feedback>
            </FloatingLabel>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowProfileModal(false)}
              >
                Fechar
              </Button>

              <Button variant="success" type="submit">
                Salvar Alterações
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ===================================== */}
      {/* MODAL ALTERAR SENHA */}
      {/* ===================================== */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>
            <FaKey className="me-2" />
            Redefinir Senha
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form onSubmit={passwordFormik.handleSubmit}>
            <FloatingLabel label="Senha Atual" className="mb-3">
              <Form.Control
                type="password"
                name="senhaAtual"
                placeholder="Senha Atual"
                value={passwordFormik.values.senhaAtual}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                isInvalid={
                  passwordFormik.touched.senhaAtual &&
                  !!passwordFormik.errors.senhaAtual
                }
              />

              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.senhaAtual}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Nova Senha" className="mb-3">
              <Form.Control
                type="password"
                name="novaSenha"
                placeholder="Nova Senha"
                value={passwordFormik.values.novaSenha}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                isInvalid={
                  passwordFormik.touched.novaSenha &&
                  !!passwordFormik.errors.novaSenha
                }
              />

              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.novaSenha}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Confirmar Senha" className="mb-3">
              <Form.Control
                type="password"
                name="confirmarSenha"
                placeholder="Confirmar Senha"
                value={passwordFormik.values.confirmarSenha}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                isInvalid={
                  passwordFormik.touched.confirmarSenha &&
                  !!passwordFormik.errors.confirmarSenha
                }
              />

              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.confirmarSenha}
              </Form.Control.Feedback>
            </FloatingLabel>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancelar
              </Button>

              <Button variant="warning" type="submit">
                Alterar Senha
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserMenu;
