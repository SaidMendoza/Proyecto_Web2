// src/App.jsx
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
// Borramos la importación de types porque en JS no se usan interfaces

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { SalesView } from './views/SalesView';
import { BuyersView } from './views/BuyersView';
import { UserManagementView } from './views/UserManagementView';

const App = () => {
  // Quitamos los genericos <User | null>
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Quitamos el tipo (user: User)
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
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
      case 'dashboard': return <DashboardView />;
      case 'inventory': return <InventoryView />;
      case 'sales': return <SalesView />;
      case 'buyers': return <BuyersView />;
      // Validación simple de rol (asegúrate que tu usuario tenga la propiedad role)
      case 'users': return currentUser.role === 'admin' ? <UserManagementView /> : <DashboardView />;
      default: return <DashboardView />;
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