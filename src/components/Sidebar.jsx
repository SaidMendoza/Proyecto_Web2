import React from 'react';
import { LayoutDashboard, ShoppingCart, Users, LogOut, Package, FishSymbol, ShieldCheck } from 'lucide-react';

export const Sidebar = ({ activePage, onNavigate, onLogout, currentUser }) => {
  const menuItems = [
    { id: 'inventory', label: 'Inventario (Lotes)', icon: FishSymbol },
    { id: 'sales', label: 'Registro de Ventas', icon: ShoppingCart },
    { id: 'buyers', label: 'Compradores', icon: Users },
  ];

  // Only admins can see User Management
  if (currentUser?.role === 'admin') {
      // Agregamos Dashboard al principio
      menuItems.unshift({ id: 'dashboard', label: 'Reportes Diarios', icon: LayoutDashboard });
      // Agregamos Usuarios al final
      menuItems.push({ id: 'users', label: 'Usuarios y Accesos', icon: ShieldCheck });
  }

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col shadow-xl fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
           <div className="bg-teal-500 p-2 rounded-lg">
             <Package className="w-6 h-6 text-white" />
           </div>
           <div>
             <h1 className="text-xl font-bold leading-none">Lonja</h1>
             <span className="text-xs text-teal-400 uppercase tracking-wider">Veracruz</span>
           </div>
        </div>
        {currentUser && (
            <div className="mt-4 p-3 bg-slate-800 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{currentUser.role}</p>
                </div>
            </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
        <p className="text-xs text-slate-600 text-center mt-4">Sistema V 1.1.0 (2025)</p>
      </div>
    </div>
  );
};