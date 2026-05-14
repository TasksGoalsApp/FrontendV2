import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/login';
import { saveAuthTokens } from '../utils/auth-storage';
import type { LoginRequest } from '../types/auth.types';

interface LoginResult {
  success: boolean;
  message: string;
}

export function useLogin() {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest): Promise<LoginResult> => {
    try {
      const response = await login(data);
      saveAuthTokens(response);

      navigate('/profile');

      return {
        success: true,
        message: 'Login successful.',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || 'Login failed.',
        };
      }

      return {
        success: false,
        message: 'Unexpected error occurred.',
      };
    }
  };

  return { handleLogin };
}