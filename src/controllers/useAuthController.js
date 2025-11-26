import { useState } from 'react';

// Apunta al backend
const API_URL = 'http://localhost:5000/api/auth/login';

export const useAuthController = (onLoginSuccess) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Petición POST al servidor
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data); 
      } else {
        setError(data.message || 'Credenciales inválidas.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username, setUsername,
    password, setPassword,
    error,
    isLoading,
    handleLogin
  };
};