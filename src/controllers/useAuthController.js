import { useState } from 'react';
import { Repository } from '../models/Repository';
// Adiós a la importación de types

export const useAuthController = (onLoginSuccess) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Eliminamos el tipo ": React.FormEvent"
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await Repository.Auth.login(username, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Credenciales inválidas. Verifique usuario y contraseña.');
      }
    } catch (err) {
      setError('Error de conexión con el servicio.');
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