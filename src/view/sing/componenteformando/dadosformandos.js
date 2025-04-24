// Novo componente: SectionDadosPessoais.js
import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
const DadosFormandos = ({ formik, preview, setPreview }) => {
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
      <Row md={12} xs={12}>
                <Col md={9}>
                  <FloatingLabel
                    controlId="formBasiNome1"
                    className="mb-4 w-auto"
                    label="Nome do Nome"
                    md={8}
                  >
                    <Form.Control
                      className="input_left_color p-2"
                      type="text"
                      name="nome"
                      id="nome"
                      placeholder="Digite o Nome"
                      value={formik.values.nome}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.nome && formik.errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.nome}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="formBasiNome"
                    className="mb-4 w-auto"
                    label="Nome do Pai"
                  >
                    <Form.Control
                      className="input_left_color p-2"
                      type="text"
                      name="nomepai"
                      id="nomepai"
                      placeholder="Digite o Nome do Pai"
                      value={formik.values.nomepai}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.nomepai && formik.errors.nomepai}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.nomepai}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="formBasiNome2"
                    className="mb-4 w-auto"
                    label="Nome da Mãe"
                  >
                    <Form.Control
                      className="input_left_color p-2"
                      type="text"
                      name="nomemae"
                      id="nomemae"
                      placeholder="Digite o Nome da Mãe"
                      value={formik.values.nomemae}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.nomemae && formik.errors.nomemae}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.nomemae}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
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
                    type="file"
                    name="arquivo_foto"
                    id="arquivo_foto"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                    isInvalid={
                      formik.touched.arquivo_foto && formik.errors.arquivo_foto
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.arquivo_foto}
                  </Form.Control.Feedback>
      
                  <small className="text-muted d-block mt-2">
                    Clique para carregar foto
                  </small>
                </Col>
              </Row>
              <Row md={12} xs={12}>
          <Col md={3}>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Número do BI"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="numero_bi"
                id="numero_bi"
                placeholder="Digite o Número do BI"
                value={formik.values.numero_bi}
                onChange={formik.handleChange}
                isInvalid={formik.touched.numero_bi && formik.errors.numero_bi}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.numero_bi}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="arquivo de Identificação"
            >
              <Form.Select
                className="input_left_color p-2"
                name="arquivo_indentficacao"
                id="arquivo_indentficacao"
                value={formik.values.arquivo_indentficacao}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.arquivo_indentficacao &&
                  formik.errors.arquivo_indentficacao
                }
              >
                <option value="">Selecione o Arquivo de Identificação</option>
                <option value="C.I.C.C">C.I.C.C</option>
                <option value="Cédula">Cédula</option>
                <option value="Passaporte">Passaporte</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.arquivo_indentficacao}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Sexo"
            >
              <Form.Select
                className="input_left_color p-2"
                name="sexo"
                id="sexo"
                value={formik.values.sexo}
                onChange={formik.handleChange}
                isInvalid={formik.touched.sexo && formik.errors.sexo}
              >
                <option value="">Selecione o Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.sexo}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Email"
            >
              <Form.Control
                className="input_left_color p-2"
                type="email"
                name="email"
                id="email"
                placeholder="Digite o Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={formik.touched.email && formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="NIF"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="nif"
                id="nif"
                placeholder="Digite o NIF"
                value={formik.values.nif}
                onChange={formik.handleChange}
                isInvalid={formik.touched.nif && formik.errors.nif}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.nif}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Data de Nascimento"
            >
              <Form.Control
                className="input_left_color p-2"
                type="date"
                name="datanascimento"
                id="datanascimento"
                placeholder="Digite a Data de Nascimento"
                value={formik.values.datanascimento}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.datanascimento && formik.errors.datanascimento
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.datanascimento}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasesiNome"
              className="mb-4 w-auto"
              label="Estado Civil"
            >
              <Form.Select
                className="input_left_color p-2"
                name="estadocivil"
                id="estadocivil"
                value={formik.values.estadocivil}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.estadocivil && formik.errors.estadocivil
                }
              >
                <option value="">Selecione o Estado Civil</option>
                <option value="Solteiro">Solteiro(a)</option>
                <option value="Casado">Casado(a)</option>
                <option value="Divorciado">Divorciado(a)</option>
                <option value="Viúvo">Viúvo(a)</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.estadocivil}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Habilitação"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="habilitacao"
                id="habilitacao"
                placeholder="Digite a Habilitação"
                value={formik.values.habilitacao}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.habilitacao && formik.errors.habilitacao
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.habilitacao}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Contacto"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="telefone"
                id="telefone"
                placeholder="Digite o Contacto"
                value={formik.values.telefone}
                onChange={formik.handleChange}
                isInvalid={formik.touched.telefone && formik.errors.telefone}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.telefone}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Distrito"
            >
              <Form.Select
                className="input_left_color p-2"
                name="distrito"
                id="distrito"
                value={formik.values.distrito}
                onChange={formik.handleChange}
                isInvalid={formik.touched.distrito && formik.errors.distrito}
              >
                <option value="">Selecione o Distrito</option>
                <option value="Água Grande">Água Grande</option>
                <option value="Lobata">Lobata</option>
                <option value="Mé-zochi">Mé-zochi</option>
                <option value="Lembá">Lembá</option>
                <option value="Cantagalo">Cantagalo</option>
                <option value="Caué">Caué</option>
                <option value="RAP">Região Autônoma de Príncipe</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.distrito}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Morada"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="morada"
                id="morada"
                placeholder="Digite a Morada"
                value={formik.values.morada}
                onChange={formik.handleChange}
                isInvalid={formik.touched.morada && formik.errors.morada}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.morada}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="ocupação"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="ocupacao"
                id="ocupacao"
                placeholder="Digite a ocupação"
                value={formik.values.ocupacao}
                onChange={formik.handleChange}
                isInvalid={formik.touched.ocupacao && formik.errors.ocupacao}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.ocupacao}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Naturalidade"
            >
              <Form.Select
                className="input_left_color p-2"
                name="naturalidade"
                id="naturalidade"
                value={formik.values.naturalidade}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.naturalidade && formik.errors.naturalidade
                }
              >
                <option value="Conceição São Tomé">Conceição São Tomé</option>

                <option value="Lembá">Neves</option>
                <option value="Cantagalo">Caué</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.naturalidade}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="nacionalidade"
            >
              <Form.Select
                className="input_left_color p-2"
                name="nacionalidade"
                id="nacionalidade"
                value={formik.values.nacionalidade}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.nacionalidade && formik.errors.nacionalidade
                }
              >
                <option value="">Selecione a Nacionalidade</option>
                <option value="Santomense">Santomense</option>
                <option value="Angolano">Angolano</option>
                <option value="Angolano">Caboverdiano</option>
                <option value="Angolano">Moçambicano</option>
                <option value="portugues">portugues</option>
                <option value="portugues">Outros</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.nacionalidade}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Agregado Familiar"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="agregadofamiliar"
                id="agregadofamiliar"
                placeholder="Digite o Agregado Familiar"
                value={formik.values.agregadofamiliar}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.agregadofamiliar &&
                  formik.errors.agregadofamiliar
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.agregadofamiliar}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="formBasiNome"
              className="mb-4 w-auto"
              label="Outros Contacto"
            >
              <Form.Control
                className="input_left_color p-2"
                name="telefone2"
                id="telefone2"
                type="number"
                value={formik.values.telefone2}
                onChange={formik.handleChange}
                isInvalid={formik.touched.telefone2 && formik.errors.telefone2}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.telefone2}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
    </>
  );
};

export default DadosFormandos;