import { Button, Form } from "react-bootstrap";
import { Confirmar_Opcao_Matricula } from "../../view/sing/function";
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';



const Confirmarmatricula = ({
  items,
  idCurso,
  status_matricula,
  situacoes,
  setSituacoes,
  id_curso_incricao,
  variante,
  textButton,
  acao,
  id_matricula,
}) => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const handleChange = (
    idInscricao,
    idCurso,
    status_matricula,
    id_curso_incricao,
    acao,
    id_matricula
  ) => {
    // criar um array com os dados
    const dados = [
      {
        idInscricao: idInscricao,
        idCurso: idCurso,
        status: status_matricula,
        id_curso_inscricao: id_curso_incricao,
        acao: textButton,
        id_matricula: id_matricula,
      }
    ];
    Confirmar_Opcao_Matricula(dados, token)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Ação Realizada com Sucesso!!");

          queryClient.invalidateQueries({ queryKey: ["Qmatriculas"] });
          const updatedSituacoes = situacoes.map((situacao) => {
            if (situacao.id_curso_incricao === id_curso_incricao) {
              return {
                ...situacao,
                status_matricula: status_matricula,
              };
            }
            return situacao;
          });
        }
      })
      .catch((error) => {
        console.error("Error updating situation:", error);
      });
   
  };

  return (
    <>
     <Button
  className="rounded-pill px-3 mt-2 shadow-sm"
  variant={`outline-${variante}`}
  size="sm"
  onClick={() => {
    handleChange(
      items.incricao_id,
      idCurso,
      status_matricula,
      id_curso_incricao,
      acao,
      id_matricula // ✅ aqui está o valor correto
    );
  }}
>
  {textButton}
</Button>
    </>
  );
};

export default Confirmarmatricula;
