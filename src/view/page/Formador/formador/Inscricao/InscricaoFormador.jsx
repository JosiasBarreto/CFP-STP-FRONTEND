// InscricaoFormador.jsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  ProgressBar,
} from "react-bootstrap";

import StepDados from "./componentes/StepDados";
import StepDominios from "./componentes/StepDominios";
import StepFormacoes from "./componentes/StepFormacoes";
import StepExperiencias from "./componentes/StepExperiencias";
import StepDocumentos from "./componentes/StepDocumentos";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";

const steps = [
  { id: 0, label: "Dados Pessoais" },
  { id: 1, label: "Formações e Experiências" },
  { id: 2, label: "Domínios e Áreas de Candidatura" },
  { id: 3, label: "Documentos" },
];

export default function InscricaoFormador() {
  const location = useLocation();

  // FORMADOR EM EDIÇÃO
  const formador = location.state?.formador || null;

  // STEP ATUAL
  const [step, setStep] = useState(0);

  // ID DO FORMADOR
  const [formadorId, setFormadorId] = useState(null);

  // MODO EDIÇÃO
  const modoEdicao = !!formador;

  // AO ENTRAR EM MODO EDIÇÃO
  useEffect(() => {
    if (formador) {
      setFormadorId(formador.id);
    }
  }, [formador]);

  // NAVEGAÇÃO
  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  // CLICAR DIRETAMENTE NO STEP
  const handleSelectStep = (stepId) => {
    // SOMENTE EM EDIÇÃO
    if (modoEdicao) {
      setStep(stepId);
    }
  };

  // PROGRESSO
  const progresso = ((step + 1) / steps.length) * 100;

  return (
    <div className="w-100 h-100">
      <Card className="shadow-sm border-0">

        {/* HEADER */}
        <CardHeader className="p-3 bg-success text-white border-0">

          <h4 className="mb-3 text-start fw-semibold d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faChalkboardTeacher} />

            {modoEdicao
              ? "EDIÇÃO DO FORMADOR"
              : "REGISTO DO FORMADOR"}
          </h4>

          {/* STEPS */}
          <div className="d-flex flex-wrap gap-4">

            {steps.map((s) => {
              const ativo = step === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectStep(s.id)}
                  style={{
                    cursor: modoEdicao ? "pointer" : "default",
                  }}
                  className="position-relative pb-1"
                >

                  <span
                    className={`fw-semibold ${
                      ativo ? "text-white" : "text-light"
                    }`}
                    style={{
                      opacity: ativo ? 1 : 0.7,
                    }}
                  >
                    {s.label}
                  </span>

                  {/* LINHA */}
                  {ativo && (
                    <div
                      className="position-absolute start-0 bottom-0 bg-white rounded"
                      style={{
                        width: "100%",
                        height: "3px",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        {/* BODY */}
        <Card.Body className="p-4">

          {/* PROGRESS BAR */}
          <ProgressBar
            variant="success"
            now={progresso}
            label={`${Math.round(progresso)}%`}
            className="mb-4"
          />

          {/* STEP 0 */}
          {step === 0 && (
            <StepDados
              formador={formador}
              formadorId={formadorId}
              modoEdicao={modoEdicao}
              onSuccess={(id) => {
                setFormadorId(id);

                // SOMENTE AVANÇA AUTOMÁTICO
                // NO MODO NOVO REGISTO
                if (!modoEdicao) {
                  next();
                }
              }}
            />
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <StepFormacoes
                formador={formador}
                formadorId={formadorId}
                modoEdicao={modoEdicao}
              />

              <div className="mt-4">
                <StepExperiencias
                  formador={formador}
                  formadorId={formadorId}
                  modoEdicao={modoEdicao}
                />
              </div>

              {/* BOTÕES */}
              {!modoEdicao && (
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={back}>
                    ⬅ Voltar
                  </Button>

                  <Button variant="success" onClick={next}>
                    ⏭ Próximo
                  </Button>
                </div>
              )}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <StepDominios
              formador={formador}
              formadorId={formadorId}
              modoEdicao={modoEdicao}
              onNext={next}
              onBack={back}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <StepDocumentos
              formador={formador}
              formadorId={formadorId}
              modoEdicao={modoEdicao}
              onBack={back}
            />
          )}

        </Card.Body>
      </Card>
    </div>
  );
}