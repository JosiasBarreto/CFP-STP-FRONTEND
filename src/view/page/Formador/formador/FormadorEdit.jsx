import { useQuery } from "@tanstack/react-query";
import { getTiposDocumento } from "../../../../api/listas.api";
import FormadorDocumentos from "./FormadorDocumentos";


function FormadorEdit({ formadorId }) {
  const { data: tiposDocumento = [] } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: getTiposDocumento,
  });

  return (
    <>
      {/* outros blocos do formador */}

      <FormadorDocumentos
        formadorId={formadorId}
        tiposDocumento={tiposDocumento}
      />
    </>
  );
}
export default FormadorEdit;