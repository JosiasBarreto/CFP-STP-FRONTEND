import Swal from "sweetalert2";

export const showLoading = (text) => {
    Swal.fire({
      title: "Processando...",
      text,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  export const hideLoading = () => {
    Swal.close();
  };

  export const showError = (text) => {  
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text,
    });
  };

  export const showSuccess = (text) => {
    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text,
    });
  };