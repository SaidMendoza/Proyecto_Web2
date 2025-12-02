import { useState, useEffect } from 'react';

// URL del backend
const API_URL = 'http://localhost:4000/api/sales/report';

//const API_URL = 'https://api-lonja.onrender.com/api/sales/report';

export const useDashboardController = () => {
  const [ventas, setVentas] = useState([]);
  // Función truco para obtener la fecha local en formato YYYY-MM-DD
const getAleadyLocalISO = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000; // Tu diferencia horaria en milisegundos
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

const [fecha, setFecha] = useState(getAleadyLocalISO());
  const [loading, setLoading] = useState(false);
  
  // Estados para modal de edición
  const [editingSale, setEditingSale] = useState(null);
  const [formState, setFormState] = useState({ kilos: '', cajas: '', precio: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [fecha]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?date=${fecha}`);
      if (!res.ok) throw new Error('Error cargando reporte');
      const data = await res.json();
      setVentas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (venta) => {
    setEditingSale(venta);
    setFormState({
      kilos: (venta.kilos_vendidos ?? 0).toString(),
      cajas: (venta.cajas_vendidas ?? 0).toString(),
      precio: venta.precio_kilo_final.toString()
    });
    setError('');
  };

  const handleUpdateSale = async (e) => {
    e.preventDefault();
    setEditingSale(null);
  };

  const metrics = {
    totalVentas: ventas.reduce((acc, curr) => acc + curr.precio_total, 0),
    totalKilos: ventas.reduce((acc, curr) => acc + (curr.kilos_vendidos ?? 0), 0),
    totalCajas: ventas.reduce((acc, curr) => acc + (curr.cajas_vendidas ?? 0), 0)
  };

  return {
    ventas, fecha, setFecha, loading, metrics,
    editingSale, setEditingSale, openEditModal, formState, setFormState, handleUpdateSale, error
  };
};