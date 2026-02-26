import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../urls";
import { PostFormandos } from "../../urls/rotes_query";

export const useRegistrarFormando = (token, formik, setPreview) => {
  return useMutation({
    mutationFn: async (valores) => {
      try {
        const formData = new FormData();

        formData.append("processo", valores.processo);
        formData.append("email", valores.email);
        formData.append("agregado", valores.agregadofamiliar);
        formData.append("ano_execucao", valores.anoexecucao);
        formData.append("arquivo_identificacao", valores.arquivo_indentficacao);
        formData.append("observacao", valores.observacao || ""); // Corrigido
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
        formData.append("zona", valores.morada);
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

        if (valores.arquivo_foto && valores.arquivo_foto instanceof File) {
          formData.append("foto", valores.arquivo_foto);
        }

        const response = await axios.post(
          API_URL + PostFormandos,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(`Formando registrado com sucesso! ID: ${response.data.inscricao_id}`);
        return response.data;

      } catch (error) {
        throw error; // deixa o onError tratar isso
      }
    },

    onSuccess: () => {
      formik.resetForm();
      setPreview(null);
    },

    onError: (error) => {
      toast.error(error.response?.data?.erro || "Erro ao registrar formando.");
      // ❌ formik.resetForm(); NÃO CHAMAR AQUI
    },
  });
};
