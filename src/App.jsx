import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { SalesView } from './views/SalesView';
import { BuyersView } from './views/BuyersView';
import { UserManagementView } from './views/UserManagementView';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    

    // Si es Admin, va a Dashboard. Si es Vendedor, va directo a Ventas.
    if (user.role === 'admin') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('sales'); 
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        // Si un vendedor intenta entrar aquí, se regresa a Ventas
        return currentUser.role === 'admin' ? <DashboardView /> : <SalesView />;
      
      case 'inventory': return <InventoryView />;
      case 'sales': return <SalesView />;
      case 'buyers': return <BuyersView />;
      
      case 'users': 
        // Protección existente para usuarios
        return currentUser.role === 'admin' ? <UserManagementView /> : <SalesView />;
      
      default: return <SalesView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activePage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout} 
        currentUser={currentUser}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;