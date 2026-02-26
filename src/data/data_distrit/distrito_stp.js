
const DISTRITOS = [
    { value: "Água Grande", label: "Água Grande" },
    { value: "Caué", label: "Caué" },
    { value: "Lembá", label: "Lembá" },
    { value: "Lobata", label: "Lobata" },
    { value: "Mé-Zochi", label: "Mé-Zochi" },
    { value: "Cantagalo", label: "Cantagalo" },
    { value: "Região Autônoma do Príncipe", label: "Região Autônoma do Príncipe" }
  ];
  
  export const DISTRITOS_ORDENADOS = [...DISTRITOS].sort((a, b) =>
    a.label.localeCompare(b.label, "pt", { sensitivity: "base" })
  );