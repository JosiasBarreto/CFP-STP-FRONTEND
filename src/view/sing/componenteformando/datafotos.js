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
      <Col md={3} className="text-center border border-1 rounded-3 p-3">
        <label htmlFor="arquivo_foto" style={{ cursor: "pointer" }}>
          {preview ? (
            <img
              src={preview}
              alt="Pré-visualização"
              className="img-fluid  shadow"
              style={{ width: 180, height: 180, objectFit: "cover" }}
            />
          ) : (
            <FaUserCircle size={180} color="#6c757d" />
          )}
        </label>

        <Form.Control
        
        controlId="FOTO"
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

        <small className="text-muted d-block mt-2">
          Clique para carregar foto
        </small>
      </Col>

 
    </>
  );
};

export default DataFotos;
