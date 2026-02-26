import {
    FaHome,
    FaUserPlus,
    FaLayerGroup,
    FaBookOpen,
    FaUsers,
    FaListUl,
    FaCheckSquare,
    FaUsersCog,
    FaClipboardCheck,
  } from "react-icons/fa";
  
  export const menuConfig = [
    {
      section: "Principal",
      items: [
        { label: "Home", path: "home", icon: FaHome },
      ],
    },
    {
      section: "Gestão",
      items: [
        { label: "Registo de Utilizadores", path: "register-user", icon: FaUserPlus },
        { label: "Programas", path: "register-programas", icon: FaLayerGroup },
        { label: "Áreas de Formação", path: "registar-area", icon: FaLayerGroup },
        { label: "Cursos", path: "register-cursos", icon: FaBookOpen },
        { label: "Inscrição de Formandos", path: "register-formandos", icon: FaUsers },
      ],
    },
    {
      section: "Candidaturas",
      items: [
        { label: "Pesquisar Formandos", path: "list-formandos", icon: FaListUl },
        { label: "Selecionar Formandos", path: "selecionar-candidatura", icon: FaCheckSquare },
      ],
    },
    {
      section: "Turmas & Matrículas",
      items: [
        { label: "Turmas", path: "selecionado-turma", icon: FaUsersCog },
        { label: "Matrículas", path: "selecionar-matricula", icon: FaClipboardCheck },
        { label: "Registar Formador", path: "registar-formador", icon: FaClipboardCheck },
        { label: "Listar Formadores", path: "list-formador", icon: FaClipboardCheck },
      ],
    },
  ];
  