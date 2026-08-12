import React from "react";
import {
  Modal,
  ProgressBar,
  Button,
  Alert,
  Badge,
  Table,
} from "react-bootstrap";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiXCircle,
  FiDownload,
} from "react-icons/fi";

export const ProgressDialog = ({
  show,
  progress,
  current,
  total,
  onCancel,
  isFinished,
  results,
  onClose,
  onDownloadErrors,
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header className={isFinished ? "bg-success text-white" : "bg-primary text-white"}>
        <Modal.Title className="d-flex align-items-center gap-2">
          {isFinished ? (
            <>
              <FiCheckCircle size={22} />
              Importação Concluída
            </>
          ) : (
            <>
              <FiLoader className="spinner-border spinner-border-sm border-0" />
              Importando Formandos
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {!isFinished ? (
          <>
            <Alert variant="info" className="mb-4">
              Aguarde enquanto os dados estão a ser enviados para o servidor.
              Não feche esta janela.
            </Alert>

            <ProgressBar
              now={percentage}
              animated
              striped
              variant="success"
              style={{ height: 25 }}
              label={`${percentage}%`}
            />

            <div className="d-flex justify-content-between mt-3">

              <div>
                <strong>Processados</strong>
                <div>{current} de {total}</div>
              </div>

              <div>
                <strong>Restantes</strong>
                <div>{total-current}</div>
              </div>

              <div>
                <strong>Progresso</strong>
                <div>{percentage}%</div>
              </div>

            </div>
          </>
        ) : (
          <>

            <Alert
              variant={results.erros > 0 ? "warning" : "success"}
              className="mb-4"
            >
              {results.erros > 0
                ? "A importação terminou com alguns erros."
                : "Todos os formandos foram importados com sucesso."}
            </Alert>

            <div className="row text-center mb-4">

              <div className="col-md-4">
                <div className="border rounded p-3 bg-light">
                  <FiCheckCircle
                    className="text-success mb-2"
                    size={28}
                  />
                  <h3 className="text-success mb-0">
                    {results.inseridos}
                  </h3>
                  <small>Inseridos</small>
                </div>
              </div>

              <div className="col-md-4">
                <div className="border rounded p-3 bg-light">
                  <FiLoader
                    className="text-primary mb-2"
                    size={28}
                  />
                  <h3 className="text-primary mb-0">
                    {results.atualizados}
                  </h3>
                  <small>Atualizados</small>
                </div>
              </div>

              <div className="col-md-4">
                <div className="border rounded p-3 bg-light">
                  <FiXCircle
                    className="text-danger mb-2"
                    size={28}
                  />
                  <h3 className="text-danger mb-0">
                    {results.erros}
                  </h3>
                  <small>Erros</small>
                </div>
              </div>

            </div>

            {results.listaErros &&
              results.listaErros.length > 0 && (
                <>
                  <h6 className="mb-3">
                    Registos com erro
                  </h6>

                  <div
                    style={{
                      maxHeight: 280,
                      overflowY: "auto",
                    }}
                  >
                    <Table
                      bordered
                      hover
                      responsive
                      size="sm"
                    >
                      <thead className="table-light">
                        <tr>
                          <th>Linha</th>
                          <th>Nome</th>
                          <th>BI</th>
                          <th>Erro</th>
                        </tr>
                      </thead>

                      <tbody>

                        {results.listaErros.map((erro, index) => (
                          <tr key={index}>
                            <td>{erro.linha}</td>

                            <td>{erro.nome}</td>

                            <td>{erro.bi}</td>

                            <td>
                              <Badge bg="danger">
                                {erro.erro}
                              </Badge>
                            </td>
                          </tr>
                        ))}

                      </tbody>
                    </Table>
                  </div>
                </>
              )}

          </>
        )}

      </Modal.Body>

      <Modal.Footer>

        {!isFinished ? (
          <Button
            variant="danger"
            onClick={onCancel}
          >
            Cancelar Importação
          </Button>
        ) : (
          <>
            {results.listaErros &&
              results.listaErros.length > 0 && (
                <Button
                  variant="warning"
                  onClick={onDownloadErrors}
                >
                  <FiDownload className="me-2" />
                  Exportar Erros
                </Button>
              )}

            <Button
              variant="success"
              onClick={onClose}
            >
              Fechar
            </Button>
          </>
        )}

      </Modal.Footer>
    </Modal>
  );
};