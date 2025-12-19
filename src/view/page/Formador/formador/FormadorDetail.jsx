import { Tabs, Tab, Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


import FormadorForm from "./FormadorForm";
import FormadorFormacoes from "./FormadorFormacoes";
import FormadorExperiencias from "./FormadorExperiencias";
import FormadorDocumentos from "./FormadorDocumentos";
import { getFormador } from "../../../../api/formador.api";
import { getTiposDocumento, getTiposFormacao } from "../../../../api/listas.api";



export default function FormadorDetail() {
  const { id } = useParams();

  const {
    data: formador,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["formador", id],
    queryFn: () => getFormador(id),
  });

  const { data: tiposFormacao = [] } = useQuery({
    queryKey: ["tipos-formacao"],
    queryFn: getTiposFormacao,
  });

  const { data: tiposDocumento = [] } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: getTiposDocumento,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <Alert variant="danger">Erro ao carregar formador</Alert>;

  return (
    <Tabs defaultActiveKey="dados" className="mb-3">
      <Tab eventKey="dados" title="👤 Dados Pessoais">
        <FormadorForm
          initialValues={formador}
          dominios={formador.dominios}
          onSubmit={() => {}}
        />
      </Tab>

      <Tab eventKey="formacoes" title="🎓 Formação">
        <FormadorFormacoes
          formadorId={formador.id}
          formacoes={formador.formacoes}
          tiposFormacao={tiposFormacao}
        />
      </Tab>

      <Tab eventKey="experiencias" title="💼 Experiência">
        <FormadorExperiencias
          formadorId={formador.id}
          experiencias={formador.experiencias}
        />
      </Tab>

      <Tab eventKey="documentos" title="📂 Documentos">
        <FormadorDocumentos
          formadorId={formador.id}
          tiposDocumento={tiposDocumento}
        />
      </Tab>
    </Tabs>
  );
}
