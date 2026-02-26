// File: src/view/sing/componenteformando/datafotos.js
import React, { useState, useRef, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import { FaUserCircle, FaCamera } from "react-icons/fa";

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
    <Col md={2} className="d-flex flex-column align-items-center">
      <div
        className="position-relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: "200px", height: "200px" }}
      >
        <label
          htmlFor="arquivo_foto"
          className="d-block h-100 w-100 rounded-circle overflow-hidden shadow-sm border border-4 border-success position-relative"
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
              <FaUserCircle size={160} className={isHovered ? "opacity-75" : ""} />
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
        isInvalid={!!(formik.touched.arquivo_foto && formik.errors.arquivo_foto)}
      />

      <div className="mt-3 text-center">
        <h6 className="text-success fw-bold mb-1">Foto de Perfil</h6>
        <small className="text-muted d-block">
          {isHovered ? "Clique para alterar" : "Formatos: JPG, PNG"}
        </small>
        
        {formik.touched.arquivo_foto && formik.errors.arquivo_foto && (
          <div className="text-danger small mt-1">
            {formik.errors.arquivo_foto}
          </div>
        )}
      </div>
    </Col>
  );
};

export default DataFotos;