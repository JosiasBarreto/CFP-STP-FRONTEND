import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../api/urls';
import { clearTokens } from '../../api/Conf/reflesk_Fuction/authService';

export const handleLogoutmethods = async ({navigate}) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(
      API_URL+'/logout',
      {}, // corpo vazio
      {
        headers: {
          Authorization: token, // ou `Bearer ${token}` se for o padrão do seu back-end
        },
      }
    );

    if (response.status === 200) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      clearTokens();
      toast.success('Logout bem-sucedido!');
      navigate('/'); // redireciona para a tela de login
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    toast.error(
      error.response?.data?.message || 'Erro ao tentar fazer logout.'
    );
  }
};
