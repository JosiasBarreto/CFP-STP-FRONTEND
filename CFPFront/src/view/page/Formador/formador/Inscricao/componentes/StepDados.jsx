import { Form, Button, Row, Col, Spinner, FloatingLabel, Toast } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { criarFormador } from "../../../../../../api/formador.api";
import { toast, ToastContainer } from "react-toastify";




/**
 * Step 1 – Dados pessoais do Formador
 * Cria o formador e devolve o ID
 */
export default function StepDados({ onSuccess }) {
  const mutation = useMutation({
    mutationFn: criarFormador,
  
    onSuccess: (data) => {
      const formadorId = data.data.id;
  
      toast.success("Dados pessoais carregados com sucesso!");
  
      onSuccess(formadorId);
    },
  
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar dados",
        text:
          error?.response?.data?.erro ||
          error?.response?.data?.mensagem ||
          "Erro inesperado",
      });
    },
  });
  

  const formik = useFormik({
    initialValues: {
        inscricao:"",
      codigo: "",
      nome: "",
      numero_bi: "",
      numero_nif: "",
      data_nascimento: "",
      genero: "",
      estado_civil: "",
      morada: "",
      distrito: "",
      banco: "",
      numero_iban: "",
      numero_nib: "",
      formacao_pedagogica: false,
      observacao: "",
        numero_telefone: "",
        email: "",
        outros_contactos: "",
        data_criacao: new Date().toISOString().split('T')[0],
        hora_criacao: new Date().toISOString().split('T')[1].split('.')[0],
    },
// --- IGNORE ---
//quero pegar a data e hora atual e guardar na base de dados,


    validationSchema: Yup.object({
        inscricao: Yup.string(),
        data_criacao: Yup.date(),
      codigo: Yup.string(),
      nome: Yup.string().required("Nome é obrigatório"),
      numero_bi: Yup.string().required("BI é obrigatório"),
      numero_nif: Yup.string().required("NIF é obrigatório"),
      data_nascimento: Yup.date().required("Data de nascimento obrigatória"),
      genero: Yup.string().required("Selecione o género"),
      morada: Yup.string().required("Morada é obrigatória"),
      distrito: Yup.string().required("Distrito é obrigatório"),
      banco: Yup.string(),
      numero_iban: Yup.string(),
      numero_nib: Yup.string(),
        numero_telefone: Yup.string().required("Número de telefone é obrigatório"),
        email: Yup.string(),
        outros_contactos: Yup.string(),
        observacao: Yup.string(),

        
    }),

    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });
  

  return (
    <Form onSubmit={formik.handleSubmit}>
    <ToastContainer />
      <Row className="mb-2">
      <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Inscrição Número"
            >
            <Form.Control
            placeholder="Inscrição Número"
             className="input_left_color p-2"
              name="inscricao"
              value={formik.values.inscricao}
              onChange={formik.handleChange}
              isInvalid={formik.touched.inscricao && formik.errors.inscricao}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.inscricao}
            </Form.Control.Feedback>
          
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Código do Formador"
            >
            <Form.Control
            placeholder="Código do Formador"
             className="input_left_color p-2"
              name="codigo"
              value={formik.values.codigo}
              onChange={formik.handleChange}
              isInvalid={formik.touched.codigo && formik.errors.codigo}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.codigo}
            </Form.Control.Feedback>
          
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Data de Inscrição"
            >
        
            <Form.Control
             className="input_left_color p-2"
              type="date"
              name="data_criacao"
              value={formik.values.data_criacao}
              onChange={formik.handleChange}
              isInvalid={formik.touched.data_criacao && formik.errors.data_criacao}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.data_criacao}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Hora de Inscrição"
            >
        
            <Form.Control
             className="input_left_color p-2"
              type="Time"
              name="hora_criacao"
              value={formik.values.hora_criacao}
              onChange={formik.handleChange}
              isInvalid={formik.touched.hora_criacao && formik.errors.hora_criacao}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.hora_criacao}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

        <Col md={8}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Nome Completo"
            >
        
            <Form.Control
             className="input_left_color p-2"
             placeholder="Nome Completo"
              name="nome"
              value={formik.values.nome}
              onChange={formik.handleChange}
              isInvalid={formik.touched.nome && formik.errors.nome}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nome}
            </Form.Control.Feedback>
      </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Genero"
            >
        
            <Form.Select
             className="input_left_color p-2"
              name="genero"
              value={formik.values.genero}
              onChange={formik.handleChange}
              isInvalid={formik.touched.genero && formik.errors.genero}
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                {formik.errors.genero}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
        className="mb-4 w-auto"
              label="Estado Civil"
            >
            <Form.Select
             className="input_left_color p-2"
              name="estado_civil"

                value={formik.values.estado_civil}
                onChange={formik.handleChange}
                isInvalid={formik.touched.estado_civil && formik.errors.estado_civil}
            >
                <option value="">Selecione</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.estado_civil}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
      </Row>

      <Row className="mb-2">
      <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Data de Nascimento"
            >
        
            <Form.Control
             className="input_left_color p-2"
              type="date"
              name="data_nascimento"
              value={formik.values.data_nascimento}
              onChange={formik.handleChange}
              isInvalid={formik.touched.data_nascimento && formik.errors.data_nascimento}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.data_nascimento}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Nº do Bilhete de Identidade"	
            >
        
            <Form.Control
             className="input_left_color p-2"
              name="numero_bi"
              value={formik.values.numero_bi}
              onChange={formik.handleChange}
              isInvalid={formik.touched.numero_bi && formik.errors.numero_bi}
              placeholder="Número do Bilhete de Identidade"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.numero_bi}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Número do NIF"
            >
        
            <Form.Control
             className="input_left_color p-2"
              name="numero_nif"
              placeholder="Número do NIF"
              value={formik.values.numero_nif}
              onChange={formik.handleChange}
              isInvalid={formik.touched.numero_nif && formik.errors.numero_nif}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.numero_nif}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

       
        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Morada"
            >
        
            <Form.Control
             className="input_left_color p-2"
              name="morada"
              value={formik.values.morada}
              onChange={formik.handleChange}
              isInvalid={formik.touched.morada && formik.errors.morada}
              placeholder="Morada"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.morada}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Distrito"
            >
        
            <Form.Select
             className="input_left_color p-2"
              name="distrito"
                value={formik.values.distrito}
                onChange={formik.handleChange}
                isInvalid={formik.touched.distrito && formik.errors.distrito}
            >       
                <option value="">Selecione</option>
                <option value="Água Grande">Água Grande</option>
                <option value="Lobata">Lobata</option>
                <option value="Mé-Zóchi">Mé-Zóchi</option>
                <option value="Cantagalo">Cantagalo</option>
                <option value="Caué">Caué</option>
                <option value="Lembá">Lembá</option>
                <option value="Príncipe">Rigião Autónuma do Príncipe</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.distrito}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
        className="mb-4 w-auto"
                label="Número do Telefone"
            >
        
            <Form.Control
             className="input_left_color p-2"
              name="numero_telefone"
              value={formik.values.numero_telefone}
              onChange={formik.handleChange}
              isInvalid={formik.touched.numero_telefone && formik.errors.numero_telefone}
              placeholder="Número do Telefone"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.numero_telefone}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col> 
      </Row>

      <Row className="mb-2">
      <Col md={3}>
        <FloatingLabel
            
              className="mb-4 w-auto"
              label="Email"
            >
          
            <Form.Control
             className="input_left_color p-2"
              name="email"  
                type="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={formik.touched.email && formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

        
        <Col md={2}>
        <FloatingLabel
        
              className="mb-4 w-auto"
              label="Outros Contactos"
            >
          
            <Form.Control
                className="input_left_color p-2"
                name="outros_contactos"
                placeholder="Outros Contactos"
                value={formik.values.outros_contactos}
                onChange={formik.handleChange}
                isInvalid={formik.touched.outros_contactos && formik.errors.outros_contactos}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.outros_contactos}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
      
        

        <Col md={3}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Banco"
            >
        
            <Form.Select
             className="input_left_color p-2"
              name="banco"
                value={formik.values.banco}
                onChange={formik.handleChange}
                isInvalid={formik.touched.banco && formik.errors.banco}
            >
                <option value="">Selecione</option>
                <option value="Banco Internacional de São Tomé e Príncipe">Banco Internacional de São Tomé e Príncipe</option>
                <option value="Banco Afirland First Bank">Banco Afirland First Bank</option>
                <option value="Banco Equador">Banco Equador</option>
                <option value="Banco GTI">Banco GTI</option>
                <option value="Banco Ecobank">Banco Ecobank</option>
                <option value="Banco BGFI">Banco BGFI</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.banco}
            </Form.Control.Feedback>
          </FloatingLabel>
            
        </Col>

        <Col md={2}>
        <FloatingLabel
              
              className="mb-4 w-auto"
              label="Número do IBAN"
            >
        
            <Form.Control
             className="input_left_color p-2"
              name="numero_iban"
              value={formik.values.numero_iban}
              onChange={formik.handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.numero_iban}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={2}>
        <FloatingLabel
            
              className="mb-4 w-auto"
              label="Número do Nib"
            >
            <Form.Control
              className="input_left_color p-2"
              name="numero_nib"
              value={formik.values.numero_nib}
              onChange={formik.handleChange}
              isInvalid={formik.touched.numero_nib && formik.errors.numero_nib}
              placeholder="Número de Nib"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.numero_nib}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={8}>
        <FloatingLabel
          className="mb-4 w-auto"
          label="Observação"
        >
          <Form.Control
            as="textarea"
            rows={3}
            className="input_left_color p-2"
            name="observacao"
            value={formik.values.observacao}
            onChange={formik.handleChange}
            isInvalid={formik.touched.observacao && formik.errors.observacao}
            placeholder="Observação"
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.observacao}
          </Form.Control.Feedback>
        </FloatingLabel>
        </Col>
        <Col md={4} className="">
        <label>Possui Formação Pedagógica de Formador?</label>

        <Form.Group >
        
        <Form.Check
          label="SIM"
         
          name="formacao_pedagogica"
          checked={formik.values.formacao_pedagogica}
          onChange={formik.handleChange}
        />
      </Form.Group>
        </Col>
      </Row>

      

      <div className="text-end">
        <Button variant="success" type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? <Spinner size="sm" /> : "Salvar e Continuar"}
        </Button>
      </div>
    </Form>
  );
}
