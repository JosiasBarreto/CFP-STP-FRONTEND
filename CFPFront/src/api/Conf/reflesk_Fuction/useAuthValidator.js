import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens, getAccessToken, isTokenExpired, refreshTokenRequest } from './authService';


export function useAuthValidator() {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function validate() {
      const token = getAccessToken();
      if (token && !isTokenExpired(token)) {
        setIsChecking(false);
        return;
      }

      try {
        await refreshTokenRequest();
        setIsChecking(false);
      } catch (err) {
        clearTokens();
        navigate('/', { replace: true });
      }
    }

    validate();
  }, [navigate]);

  return isChecking;
}
