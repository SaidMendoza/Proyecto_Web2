import { useState, useEffect } from 'react';

const API_URL = 'https://api-lonja.onrender.com/api/buyers';

export const useBuyersController = () => {
  const [buyers, setBuyers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', paterno: '', materno: '', correo: '', direccion: ''
  });

  useEffect(() => { loadBuyers(); }, []);

  const loadBuyers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setBuyers(data);
  };

  const handleEdit = (buyer) => {
    setEditingId(buyer.codigo_cpr);
    setFormData({
      nombre: buyer.nombre, paterno: buyer.apellido_paterno,
      materno: buyer.apellido_materno, correo: buyer.correo, direccion: buyer.direccion
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar comprador?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadBuyers();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ nombre: '', paterno: '', materno: '', correo: '', direccion: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const buyerData = {
      nombre: formData.nombre, apellido_paterno: formData.paterno,
      apellido_materno: formData.materno, correo: formData.correo, direccion: formData.direccion
    };

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(buyerData)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(buyerData)
      });
    }
    resetForm();
    loadBuyers();
  };

  return { buyers, showForm, setShowForm, editingId, formData, setFormData, handleEdit, handleDelete, handleSubmit, resetForm };
};