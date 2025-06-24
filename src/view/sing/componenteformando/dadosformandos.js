// Novo componente: SectionDadosPessoais.js
import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";

import {  useEffect } from "react";

import Cabecalhos from "./dadoscabeçalhos";
import DataFotos from "./datafotos";
const DadosFormandos = ({ formik, preview, setPreview }) => {
  

  
  useEffect(() => {
    const bi = formik.values.numero_bi;
    formik.setFieldValue("processo", bi ? `CFP${bi}` : "");
  }, [formik.values.numero_bi]);

  
  return (
    <>
      <Row md={12} xs={12}>
        <Col md={7}>
          <Cabecalhos formik={formik} />
          <FloatingLabel
            className="mb-4 w-auto"
            label="Nome do Completo"
         
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
              
              minLength={2}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nome}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel
          
            className="mb-4 w-100"
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
         
            className="mb-4 w-100"
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
        <Col md={2} className="">
          <FloatingLabel
         
            className="mb-4 w-auto"
            label="Nº do Identificação(BI)"
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
              maxLength={9}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.numero_bi}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
          
            className="mb-4 w-auto"
            label="Arq. de Identificação"
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
              <option value="">Selecione</option>
              <option value="C.I.C.C">C.I.C.C</option>
              <option value="Cédula">Cédula</option>
              <option value="Passaporte">Passaporte</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.arquivo_indentficacao}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
           
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
              maxLength={9}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nif}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
           
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
        </Col>
        <DataFotos formik={formik} preview={preview} setPreview={setPreview}  />
        
      </Row>

      <Row md={12} xs={12}>
        <Col md={3}>
        <FloatingLabel
           
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
              maxLength={13}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.telefone}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
          
            className="mb-4 w-auto"
            label="Outros Contacto"
          >
            <Form.Control
              className="input_left_color p-2"
              name="telefone2"
              id="telefone2"
              type="number"
              maxLength={13}
              value={formik.values.telefone2}
              onChange={formik.handleChange}
              isInvalid={formik.touched.telefone2 && formik.errors.telefone2}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.telefone2}
            </Form.Control.Feedback>
          </FloatingLabel>
          
          <FloatingLabel
          
            className="mb-4 w-auto"
            label="Ocupação"
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
              <option value="Libreville-Gabão">Libreville-Gabão</option>
              <option value="Ponte Graça - São Tomé">Ponte Graça - São Tomé</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.naturalidade}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel
         
            className="mb-4 w-auto"
            label="Nacionalidade"
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
          
        </Col>
      </Row>
    </>
  );
};

export default DadosFormandos;
