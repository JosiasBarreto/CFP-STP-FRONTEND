// File: src/view/sing/componenteformando/datafotos.js
import React, { useState, useRef, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import { FaUserCircle, FaCamera, FaTrash } from "react-icons/fa";

const DataFotos = ({ formik, preview, setPreview }) => {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (
      formik.values.arquivo_foto &&
      typeof formik.values.arquivo_foto === "string"
    ) {
      setPreview(formik.values.arquivo_foto);
    }
  }, [formik.values.arquivo_foto, setPreview]);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("arquivo_foto", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Col
      md={2}
      xs={12}
      lg={2}
      xl={2}
      className="d-flex flex-column p-2 align-items-center border shadow rounded-3 mb-4"
    >
      <div
        className="position-relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: "190px", height: "190px" }}
      >
        <label
          htmlFor="arquivo_foto"
          className="d-block h-100 w-100 rounded-circle overflow-hidden shadow-sm border border-2 border-success position-relative"
          style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Pré-visualização"
              className="img-fluid w-100 h-100"
              style={{
                objectFit: "cover",
                transition: "transform 0.3s ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                filter: isHovered ? "brightness(0.7)" : "brightness(1)",
              }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 w-100 bg-light text-success">
              <FaUserCircle
                size={160}
                className={isHovered ? "opacity-75" : ""}
              />
            </div>
          )}

          {/* Overlay Icon visible on hover */}
          <div
            className="position-absolute top-50 start-50 translate-middle text-white pointer-events-none"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              zIndex: 10,
            }}
          >
            <FaCamera size={40} />
          </div>
        </label>
      </div>

      <Form.Control
        type="file"
        name="arquivo_foto"
        id="arquivo_foto"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
        isInvalid={
          !!(formik.touched.arquivo_foto && formik.errors.arquivo_foto)
        }
      />

      <div className="mt-0 text-center">
        <h6 className="text-success fw-bold mb-1">Foto do Formando</h6>
        <small className="text-muted d-block text-italic">
          {isHovered ? "Clique para alterar" : "Formatos: JPG, PNG"}
        </small>

        {formik.touched.arquivo_foto && formik.errors.arquivo_foto && (
          <div className="text-danger small mt-1">
            {formik.errors.arquivo_foto}
          </div>
        )}
      </div>
      <div className="mt-2 text-center">
        {formik.values.arquivo_foto && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              formik.setFieldValue("arquivo_foto", null);
              setPreview(null);
            }}
          >
            
            <FaTrash />
            {/* Icone de lixeira */}
            <span className="ms-1">Remover Foto</span>
          </button>
        )}
      </div>
    </Col>
  );
};

export default DataFotos;
