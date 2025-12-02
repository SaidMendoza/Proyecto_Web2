import React from 'react';
import { Lock, User } from 'lucide-react';
import { useAuthController } from '../controllers/useAuthController';

export const LoginView = ({ onLoginSuccess }) => {
  const { 
    username, 
    setUsername, 
    password, 
    setPassword, 
    error, 
    isLoading, 
    handleLogin 
  } = useAuthController(onLoginSuccess);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
      style={{ backgroundImage: 'url("/playa.webp")' }}
    >
      
      <div className="absolute inset-0 bg-slate-900/80"></div>      
      {/* Tarjeta de Login */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border-t-4 border-teal-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Sistema Lonja</h1>
          <h2 className="text-xl text-teal-600 font-semibold tracking-wide">Veracruz</h2>
          <p className="text-sm text-slate-500 mt-2">Ingreso de Personal Autorizado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none text-slate-900"
                placeholder="Nombre de usuario" 
                required 
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none text-slate-900"
                placeholder="Ingrese su clave" 
                required 
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          {/* Botón Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verificando...' : 'Ingresar al Sistema'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-slate-400">© 2025 Lonja de Veracruz.</div>
      </div>
    </div>
  );
};