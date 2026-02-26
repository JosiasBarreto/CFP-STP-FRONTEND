import { Badge } from "react-bootstrap";

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
export default Formacoes
  