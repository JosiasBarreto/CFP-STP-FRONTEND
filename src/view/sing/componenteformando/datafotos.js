// Novo componente: SectionDadosPessoais.js
import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useRef, useEffect } from "react";
const DataFotos = ({ formik, preview, setPreview }) => {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (
      formik.values.arquivo_foto &&
      typeof formik.values.arquivo_foto === "string"
    ) {
      setPreview(formik.values.arquivo_foto); // Pode ser URL vinda do back-end
    }
  }, [formik.values.arquivo_foto]);

  // Quando usuário seleciona nova imagem
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("arquivo_foto", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // base64 para preview
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <Col md={3} className="text-center">
        <label
          htmlFor="arquivo_foto"
          className="d-block position-relative"
          style={{ cursor: "pointer" }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Pré-visualização"
              className="img-fluid shadow rounded-circle"
              style={{
                width: 200,
                height: 200,
                objectFit: "cover",
                border: "4px solid #198754" /* Cor success */,
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          ) : (
            <FaUserCircle
              size={180}
              color="#198754"
              className="shadow rounded-circle"
            />
          )}
        </label>

        <Form.Control
          type="file"
          name="arquivo_foto"
          id="arquivo_foto"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
          isInvalid={formik.touched.arquivo_foto && formik.errors.arquivo_foto}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.arquivo_foto}
        </Form.Control.Feedback>

        <small className=" py-1 px-3 rounded d-block mt-2">
          Clique para carregar foto
        </small>
      </Col>
    </>
  );
};

export default DataFotos;
