// File: src/view/sing/componenteformando/dadosformandos.js
import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";

import { useEffect } from "react";

import Cabecalhos from "./dadoscabeçalhos";
import DataFotos from "./datafotos";
import {
  DISTRITOS,
  DISTRITOS_ORDENADOS,
} from "../../../data/data_distrit/distrito_stp";
const DadosFormandos = ({ formik, preview, setPreview }) => {
  useEffect(() => {
    const bi = formik.values.numero_bi;
    formik.setFieldValue("processo", bi ? `CFP${bi}` : "");
  }, [formik.values.numero_bi]);

  return (
    <>
      <Row  md={12} xs={12}>
        <Col md={8} >
          <Cabecalhos formik={formik} />
          <FloatingLabel className="mb-4 w-auto" label="Nome do Completo">
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
          <Row md={12} xs={12}>
            <Col md={6}>
              <FloatingLabel className="mb-4 w-100" label="Nome do Pai">
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
            </Col>
            <Col md={6}>
              <FloatingLabel className="mb-4 w-100" label="Nome da Mãe">
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
          </Row>
          <Row md={12} xs={12}>
            <Col md={3}>
              <FloatingLabel className="mb-4 w-auto" label="Estado Civil">
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
            </Col>
            <Col md={3}>
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
                  isInvalid={
                    formik.touched.numero_bi && formik.errors.numero_bi
                  }
                  maxLength={9}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.numero_bi}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
            <Col md={3}>
              <FloatingLabel className="mb-4 w-auto" label="Data de Nascimento">
                <Form.Control
                  className="input_left_color p-2"
                  type="date"
                  name="datanascimento"
                  id="datanascimento"
                  placeholder="Digite a Data de Nascimento"
                  value={formik.values.datanascimento}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.datanascimento &&
                    formik.errors.datanascimento
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.datanascimento}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
            <Col md={3}>
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
                  <option value="Cartão Residência">Cartão Residência</option>
                  <option value="Passaporte">Passaporte</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.arquivo_indentficacao}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
          </Row>
        </Col>
        <Col md={2} className="">
          
          <FloatingLabel className="mb-4 w-auto" label="NIF">
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
          <FloatingLabel className="mb-4 w-auto" label="Sexo">
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
          <FloatingLabel className="mb-4 w-auto" label="Distrito">
            <Form.Select
              className="input_left_color p-2"
              name="distrito"
              id="distrito"
              value={formik.values.distrito}
              onChange={formik.handleChange}
              isInvalid={formik.touched.distrito && formik.errors.distrito}
            >
              <option value="">Selecione o Distrito</option>
              {DISTRITOS_ORDENADOS.map((distrito) => (
                <option key={distrito.value} value={distrito.value}>
                  {distrito.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.distrito}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel className="mb-4 w-auto" label="Morada">
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
        </Col>
        <DataFotos formik={formik} preview={preview} setPreview={setPreview} />
      </Row>

      <Row md={12} xs={12}>
        <Col md={3}>
        <FloatingLabel className="mb-4 w-auto" label="Habilitação">
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
          <FloatingLabel className="mb-4 w-auto" label="Email">
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
        <FloatingLabel className="mb-4 w-auto" label="Contacto">
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
          <FloatingLabel className="mb-4 w-auto" label="Outros Contacto">
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
          
        </Col>
        
        <Col md={3}>
          <FloatingLabel className="mb-4 w-auto" label="Naturalidade">
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
<option value="Agostinho Neto">Agostinho Neto</option>
<option value="Água Grande">Água Grande</option>
<option value="Água Izé">Água Izé</option>
<option value="Almas">Almas</option>
<option value="Angolares">Angolares</option>
<option value="Angola">Angola</option>
<option value="Aeroporto">Aeroporto</option>
<option value="Abade">Abade</option>
<option value="Batepá">Batepá</option>
<option value="Belém">Belém</option>
<option value="Bela Vista">Bela Vista</option>
<option value="Belo Monte">Belo Monte</option>
<option value="Boa Entrada">Boa Entrada</option>
<option value="Bombom">Bombom</option>
<option value="Caixão Grande">Caixão Grande</option>
<option value="Cabo Verde">Cabo Verde</option>
<option value="Cantagalo">Cantagalo</option>
<option value="Caué">Caué</option>
<option value="Conceição São Tomé">Conceição São Tomé</option>
<option value="Conde">Conde</option>
<option value="Desejada">Desejada</option>
<option value="Diogo Vaz">Diogo Vaz</option>
<option value="Dona Augusta">Dona Augusta</option>
<option value="Guadalupe">Guadalupe</option>
<option value="Lembá">Lembá</option>
<option value="Libreville-Gabão">Libreville-Gabão</option>
             
             
<option value="Lobata">Lobata</option>
<option value="Luanda">Luanda</option>
<option value="Madalena">Madalena</option>
<option value="Malanza">Malanza</option>
<option value="Mé-Zóchi">Mé-Zóchi</option>
<option value="Micondó">Micondó</option>
<option value="Micoló">Micoló</option>
<option value="Milagrosa">Milagrosa</option>
<option value="Monte Café">Monte Café</option>
<option value="Monte Mário">Monte Mário</option>
<option value="Morro Peixe">Morro Peixe</option>
<option value="Neves">Neves</option>
<option value="Nova Estrela">Nova Estrela</option>
<option value="Pagué">Pagué</option>
<option value="Pantufo">Pantufo</option>
<option value="Picão">Picão</option>
<option value="Ponte Graça - São Tomé">
                Ponte Graça - São Tomé
              </option>
<option value="Porto Alegre">Porto Alegre</option>
<option value="Porto Real">Porto Real</option>
<option value="Praia Burra">Praia Burra</option>
<option value="Praia Gamboa">Praia Gamboa</option>
<option value="Praia Melão">Praia Melão</option>
<option value="Príncipe">Príncipe</option>
<option value="Região Autónoma do Príncipe">
                Região Autónoma do Príncipe
              </option>
<option value="Ribeira Afonso">Ribeira Afonso</option>
<option value="Ribeira Peixe">Ribeira Peixe</option>
<option value="Ribeira Funda">Ribeira Funda</option>
<option value="Riboque">Riboque</option>
<option value="Riboque Santana">Riboque Santana</option>
<option value="Roça Agostinho Neto">Roça Agostinho Neto</option>
<option value="Roça Água Izé">Roça Água Izé</option>
<option value="Roça Diogo Vaz">Roça Diogo Vaz</option>
<option value="Roça Monte Café">Roça Monte Café</option>
<option value="Roça Lembá">Roça Lembá</option>
<option value="Roça Sundy">Roça Sundy</option>
<option value="Roça Uba Budo">Roça Uba Budo</option>
<option value="Santa Catarina">Santa Catarina</option>
<option value="Santa Margarida">Santa Margarida</option>
<option value="Santa Cruz">Santa Cruz</option>
<option value="Santa Maria">Santa Maria</option>
<option value="Santana">Santana</option>
<option value="Santo Amaro">Santo Amaro</option>
<option value="Santo António">Santo António</option>
<option value="São João dos Angolares">São João dos Angolares</option>
<option value="São Tomé">São Tomé</option>
<option value="Sundy">Sundy</option>
<option value="Trindade">Trindade</option>
<option value="Uba Budo">Uba Budo</option>
              
              
              
              
              
              
               
              
              
              
              
             
              
              
              
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.naturalidade}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel className="mb-4 w-auto" label="Nacionalidade">
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
          
        </Col>
        <Col md={3}>
          

          <FloatingLabel className="mb-4 w-auto" label="Ocupação">
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
          <FloatingLabel className="mb-4 w-auto" label="Agregado Familiar">
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
