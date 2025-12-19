import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFormador } from "../../api/formador.api";
import { getDominios, getModulos } from "../../api/listas.api";
import FormadorForm from "../../components/formador/FormadorForm";

export default function FormadorCreate() {
  const { data: dominios = [] } = useQuery({
    queryKey: ["dominios"],
    queryFn: getDominios,
  });

  const mutation = useMutation({
    mutationFn: createFormador,
    onSuccess: () => {
      Swal.fire("Sucesso", "Formador criado com sucesso", "success");
    },
    onError: (err) => {
      Swal.fire("Erro", err.response?.data?.erro || "Erro ao criar", "error");
    },
  });

  return (
    <FormadorForm
      initialValues={{
        codigo: "",
        nome: "",
        numero_bi: "",
        numero_nif: "",
        data_nascimento: "",
        genero: "",
        morada: "",
        distrito: "",
        banco: "",
        numero_iban: "",
        numero_nib: "",
        dominios: [],
        modulos: [],
      }}
      dominios={dominios}
      loading={mutation.isPending}
      onSubmit={(values) => mutation.mutate(values)}
    />
  );
}
