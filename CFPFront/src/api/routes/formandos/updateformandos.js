import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../urls";
import { PutFormandos } from "../../urls/rotes_query";
import { formatarData } from "../../../view/sing/configureData";

export const useEditarFormando = (token, setPreview, formik, setDadosEditaveis, resetarDados) => {
  return useMutation({
    mutationFn: async ({ valores }) => {
      const formData = new FormData();

      // ID do formando
      // O ID do formando deve ser enviado no corpo da requisição, não na URL
      formData.append("id", valores.inscricao);
      formData.append("inscricao_id", valores.inscricao);
      formData.append("agregado", valores.agregadofamiliar);
      formData.append("ano_execucao", valores.anoexecucao);
      formData.append("arquivo_identificacao", valores.arquivo_indentficacao);
      formData.append("observacao", valores.observacao);

      // Demais campos
      formData.append("processo", valores.processo);
      formData.append("nome", valores.nome);
      formData.append("nome_pai", valores.nomepai);
      formData.append("nome_mae", valores.nomemae);
      formData.append("data_nascimento", valores.datanascimento);
      formData.append("sexo", valores.sexo);
      formData.append("estado_civil", valores.estadocivil);
      formData.append("nif", valores.nif);
      formData.append("bi", valores.numero_bi);
      formData.append("nacionalidade", valores.nacionalidade);
      formData.append("naturalidade", valores.naturalidade);
      formData.append("distrito", valores.distrito);
      formData.append("zona",  valores.morada);
      formData.append("contacto", valores.telefone);
      formData.append("contacto_opcional", valores.telefone2);
      formData.append("formacao_profissional", valores.profissao);
      formData.append("habilitacao_literaria", valores.habilitacao);
      formData.append("experiencia_profissional", valores.experiencia);
      formData.append("ocupacao", valores.ocupacao);
      formData.append("curso_opcao", valores.curso_primeiraopcao);
      formData.append("curso_opcao2", valores.curso_segundaopcao);
      formData.append("motivo_inscricao", valores.motivo);
      formData.append("status", "inscrito");
      formData.append("opcao", "1");
      formData.append("ano", valores.anoexecucao);
      formData.append( "id_curso_incricao1", valores.id_curso_inscricao1);
      formData.append("id_curso_incricao2", valores.id_curso_inscricao2);
      formData.append("observacao", valores.observacao);

      if (valores.arquivo_foto instanceof File) {
        formData.append("foto", valores.arquivo_foto);
      }
      

      const response = await axios.put(
        API_URL + PutFormandos,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Formando editado com sucesso!");
      resetarDados()
      setPreview(null);
      setDadosEditaveis({})
      formik.resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.erro || "Erro ao editar formando.");
    },
  });
};
