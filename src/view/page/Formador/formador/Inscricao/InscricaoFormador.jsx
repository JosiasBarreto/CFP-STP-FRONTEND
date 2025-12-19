import { useState } from "react";
import { Card, CardHeader, ProgressBar } from "react-bootstrap";
import StepDados from "./componentes/StepDados";
import StepDominios from "./componentes/StepDominios";
import StepFormacoes from "./componentes/StepFormacoes";
import StepExperiencias from "./componentes/StepExperiencias";
import StepDocumentos from "./componentes/StepDocumentos";



const steps = [
  { id: 0, label: "Dados Pessoais" },
  { id: 1, label: "Domínios" },
  { id: 2, label: "Formações" },
  { id: 3, label: "Experiências" },
  { id: 4, label: "Documentos" },
];

export default function InscricaoFormador() {
  const [step, setStep] = useState(0);
  const [formadorId, setFormadorId] = useState(null);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const progresso = ((step + 0) / steps.length) * 100;

  return (
    <Card className=" shadow-sm">
      <CardHeader className="p-2 bg-success text-white">
        <h4 className="mb-3">REGISTO DO FORMADOR</h4>
        <div className="d-flex gap-3">
          {steps.map((s) => (
            <div key={s.id}>{s.label}</div>
          ))}
        </div>
      </CardHeader>
  <Card.Body className="p-4">
      <ProgressBar
      variant="success"
        now={progresso}
        label={`${Math.round(progresso)}%`}
        className="mb-4"
      />

     

      {/* STEPS */}
      {step === 2 && (
        
        <StepDados
          onSuccess={(id) => {
            setFormadorId(id);
            next();
          }}
        />
      )}

      {step === 4 && (
        <StepDominios
          formadorId={formadorId}
          onNext={next}
          onBack={back}
        />
      )}

     

      {step === 3 && (
        <>
         <StepFormacoes
          formadorId={formadorId}
          onNext={next}
          onBack={back}
        />
        <StepExperiencias
          formadorId={formadorId}
          onNext={next}
          onBack={back}
        />
        </>
      )}

      {step === 0 && (
        <StepDocumentos
          formadorId={formadorId}
          onBack={back}
        />
      )}
    </Card.Body>
    </Card>
  );
}
// InscricaoFormador.jsx