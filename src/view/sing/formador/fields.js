export const personalFields = [
    ['Control', 'text', 'codigo', 'Codigo do Formador', 5],
   
    ['Control', 'date', 'data_incricao', 'Data Inicio', 25],
    ['Control', 'text', 'nome', 'Nome completo', 75],
    ['Control', 'number', 'numero_bi', 'Número BI', 25],
    
    ['Control', 'date', 'data_nascimento', 'Data Nascimento', 25],
    ['Control', 'text', 'morada', 'Morada', 25],
    ['Select', 'select', 'distrito', 'Distrito', 25, [
      { value: '', label: 'Selecionar' },
      { value: 'agua_grande', label: 'Água Grande' },
      { value: 'lobata', label: 'Lobata' },
      { value: 'me_zochi', label: 'Mé-Zóchi' },
    ]],
    
   
    ['Select', 'select', 'genero', 'Género', 25, [
      { value: '', label: 'Selecionar' },
      { value: 'masculino', label: 'Masculino' },
      { value: 'feminino', label: 'Feminino' },
    ]],
    ['Select', 'select', 'estado_civil', 'Estado Civil', 25, [
      { value: '', label: 'Selecionar' },
      { value: 'solteiro', label: 'Solteiro(a)' },
      { value: 'casado', label: 'Casado(a)' },
      { value: 'divorciado', label: 'Divorciado(a)' },
    ]],
    
    ['Control', 'number', 'contacto', 'Contacto', 25],
    ['Control', 'number', 'contacto_2', 'Outro Contacto', 25],
    ['Select', 'select', 'formacao_pedagogica', 'Formação Pedagógica', 25, [
      { value: '', label: 'Selecionar' },
      { value: 'Sim', label: 'Sim' },
      { value: 'não', label: 'Não' },
      
    
    ]],
    ['Control', 'number', 'numero_nif', 'Número NIF', 25],
    ['Select', 'select', 'banco', 'Banco', 25, [
      { value: '', label: 'Selecionar' },
      { value: 'bistp', label: 'Banco Internacional de São Tomé e Príncipe' },
      { value: 'ecobank', label: 'Ecobank' },
      { value: 'gti', label: 'GTI Bank' },
      { value: 'sao', label: 'São Wallet' },
      { value: 'afriland', label: 'Afriland Bank' }
    ]],
    ['Control', 'number', 'numero_nib', 'NIB', 25],
    ['Control', 'number', 'numero_iban', 'IBAN', 25]
    
  ];

  
  export const areaOptions = ['Informática', 'Gestão', 'Saúde'];
  
  export const moduloOptions = [
    { id: 1, nome: 'HTML/CSS' },
    { id: 2, nome: 'React' },
    { id: 3, nome: 'Node.js' },
  ];
  
  export const documentFields = [
    ['doc_bi', 'Documento BI'],
    ['doc_nif', 'Documento NIF'],
    ['doc_habilitacoes', 'Certificado Habilitações'],
    ['doc_formacao_prof', 'Certificado Formação Profissional'],
    ['doc_formacao_comp', 'Certificado Formação Complementar'],
    ['doc_cv', 'Currículo Vitae'],
    ['doc_experiencia', 'Comprovativo de Experiência'],
    ['doc_outros', 'Outros Documentos'],
  ];
//habilitacao_literaria 
//formacao_profissional
//formacao_complementar
//experiencia_trabalho']

  export const formacaoOptions = [
    ['Textarea', 'textarea', 'habilitacao_literaria', 'Habilitação Literaria', 50],
    ['Textarea', 'textarea', 'formacao_profissional', 'Formação Profissional', 50],
    ['Textarea', 'textarea', 'formacao_complementar', 'Formação Complementar', 50],
    ['Textarea', 'textarea', 'experiencia_trabalho', 'Experiência de Trabalho', 50],
    ['Textarea', 'textarea', 'observacao', 'Observação', 50],
  ]
