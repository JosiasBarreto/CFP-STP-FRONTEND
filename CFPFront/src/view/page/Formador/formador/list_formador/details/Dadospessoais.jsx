import { Badge } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function DadosPessoais({ formador }) {
    return (
      <div className="row g-3">
        <Info label="Género" value={formador.genero} />
        <Info label="Estado Civil" value={formador.estado_civil} />
        <Info label="Data Nascimento" value={formador.data_nascimento} />
        <Info label="Email" value={formador.email || "-"} />
        <Info label="Contacto" value={formador.contacto_telefonico || "-"} />
        <Info label="Morada" value={formador.morada} />
      </div>
    );
  }
  
  function Info({ label, value }) {
    return (
      <div className="col-md-4">
        <small className="text-muted">{label}</small>
        <div className="fw-semibold">{value}</div>
      </div>
    );
  }
  
  function Formacoes({ formacoes = [] }) {
    if (!formacoes.length)
      return <p className="text-muted">Sem formações registadas</p>;
  
    return (
      <ul className="list-group">
        {formacoes.map((f) => (
          <li key={f.id} className="list-group-item">
            <Badge bg="primary">{f.tipo_formacao.nome}</Badge>
            <div className="mt-1">{f.descricao}</div>
          </li>
        ))}
      </ul>
    );
  }
  function Dominios({ dominios = [] }) {
    return dominios.map((d) => (
      <div key={d.id} className="mb-2">
        <Badge bg="secondary">{d.area_nome}</Badge>
        <div className="ms-3">• {d.nome}</div>
      </div>
    ));
  }
  function Experiencias({ experiencias = [] }) {
    return experiencias.map((e) => (
      <div key={e.id} className="border-start ps-3 mb-3">
        <Badge bg="secondary">{e.anos_experiencia} anos</Badge>
        <div className="fw-semibold">{e.cargo}</div>
        <small>{e.instituicao}</small>
        {e.descricao && <p>{e.descricao}</p>}
      </div>
    ));
  }
  function Documentos({ status }) {
    if (status.completo)
      return (
        <p className="text-success">
          <FaCheckCircle /> Todos os documentos obrigatórios foram submetidos.
        </p>
      );
  
    return (
      <>
        <p className="text-danger">
          <FaTimesCircle /> Documentos em falta:
        </p>
        <ul>
          {status.faltantes.map((d) => (
            <li key={d.id}>{d.nome}</li>
          ))}
        </ul>
      </>
    );
  }
  

  
  