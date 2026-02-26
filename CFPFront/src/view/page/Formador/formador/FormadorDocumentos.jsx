import { useState } from "react";
import { Form, Button, Row, Col, Table, Spinner } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { uploadDocumentos } from "../../../../api/documentos.api";


export default function FormadorDocumentos({ formadorId, tiposDocumento }) {
  const [files, setFiles] = useState({});

  const mutation = useMutation({
    mutationFn: uploadDocumentos,
    onSuccess: () => {
      Swal.fire("Sucesso", "Documentos enviados com sucesso", "success");
      setFiles({});
    },
    onError: (err) => {
      Swal.fire(
        "Erro",
        err.response?.data?.erro || "Erro ao enviar documentos",
        "error"
      );
    },
  });

  const handleFileChange = (slug, file) => {
    setFiles(prev => ({ ...prev, [slug]: file }));
  };

  const handleSubmit = () => {
    if (Object.keys(files).length === 0) {
      Swal.fire("Atenção", "Nenhum documento selecionado", "warning");
      return;
    }

    const formData = new FormData();

    Object.entries(files).forEach(([slug, file]) => {
      formData.append(slug, file);
    });

    mutation.mutate({ formadorId, formData });
  };

  return (
    <>
      <h5 className="mt-4">📂 Documentos do Formador</h5>

      <Table bordered>
        <thead>
          <tr>
            <th>Documento</th>
            <th>Arquivo</th>
          </tr>
        </thead>
        <tbody>
          {tiposDocumento.map(doc => (
            <tr key={doc.id}>
              <td>
                {doc.nome}
                {doc.obrigatorio && (
                  <span className="text-danger"> *</span>
                )}
              </td>
              <td>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange(doc.slug, e.target.files[0])
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button onClick={handleSubmit} disabled={mutation.isPending}>
        {mutation.isPending ? (
          <Spinner size="sm" />
        ) : (
          "Enviar documentos"
        )}
      </Button>
    </>
  );
}
