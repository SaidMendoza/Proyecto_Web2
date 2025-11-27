import { useState, useEffect } from 'react';

const API_URL = 'https://api-lonja.onrender.com/api/inventory';
export const useUserController = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({ username: '', password: '', name: '', role: 'user' });
  const [adminAuth, setAdminAuth] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const res = await fetch(API_URL);
    setUsers(await res.json());
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (adminAuth !== 'admin123') { 
       setError('Contraseña de administrador incorrecta');
       return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Error al crear usuario');

      setSuccessMsg('Usuario creado exitosamente');
      loadUsers();
      setTimeout(() => {
        setShowModal(false); setSuccessMsg('');
        setFormData({ username: '', password: '', name: '', role: 'user' }); setAdminAuth('');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar usuario?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadUsers();
    }
  };

  return { users, showModal, setShowModal, formData, setFormData, adminAuth, setAdminAuth, error, successMsg, handleCreate, handleDelete };
};