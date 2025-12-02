import { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';

export const useSalesController = () => {
  const [compradores, setCompradores] = useState([]);
  const [inventario, setInventario] = useState([]);
  
  const [selectedBuyerId, setSelectedBuyerId] = useState('');
  const [selectedLoteId, setSelectedLoteId] = useState('');
  
  const [saleData, setSaleData] = useState({ kilos: '', cajas: '', precio: '' });
  const [status, setStatus] = useState({ type: 'idle', msg: '' });

  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [newBuyerData, setNewBuyerData] = useState({ nombre: '', paterno: '', materno: '', correo: '', direccion: '' });

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (selectedLoteId) {
      const lote = inventario.find(l => l.id_lte === selectedLoteId);
      if (lote) {
        setSaleData({
          kilos: lote.kilos.toString(),
          cajas: (lote.num_de_cajas || lote.numero_cajas || 0).toString(),
          precio: lote.precio_kilo_salida.toString()
        });
      }
    } else {
      setSaleData({ kilos: '', cajas: '', precio: '' });
    }
  }, [selectedLoteId, inventario]);

  const loadData = async () => {
    try {
      // URL DE PRODUCCIÓN (Render)
      const resBuyers = await fetch('https://api-lonja.onrender.com/api/buyers'); 
      const compradoresReales = await resBuyers.json();
      setCompradores(compradoresReales);

      const inv = await inventoryService.getAll();
      setInventario(inv.filter(i => i.kilos > 0)); 
    } catch (error) { console.error(error); }
  };

  const calculateTotal = () => {
    const k = parseFloat(saleData.kilos) || 0;
    const p = parseFloat(saleData.precio) || 0;
    return k * p;
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'idle', msg: '' });

    if (!selectedBuyerId || !selectedLoteId) {
      setStatus({ type: 'error', msg: 'Seleccione comprador y lote.' });
      return;
    }

    try {
      const kilosVal = parseFloat(saleData.kilos);
      const cajasVal = parseInt(saleData.cajas) || 0;
      const precioVal = parseFloat(saleData.precio);

      // --- CORRECCIÓN DE HORA EXACTA ---
      const now = new Date();
      // Extraemos los componentes locales
      const Y = now.getFullYear();
      const M = String(now.getMonth() + 1).padStart(2, '0');
      const D = String(now.getDate()).padStart(2, '0');
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      
      // Construimos la fecha manualmente y le agregamos "Z" para que Mongo la respete tal cual
      const fechaExacta = `${Y}-${M}-${D}T${h}:${m}:${s}.000Z`;

      const compraPayload = {
        codigo_cpr: selectedBuyerId,
        id_lte: selectedLoteId,
        fecha: fechaExacta, // Enviamos la hora congelada
        kilos_vendidos: kilosVal,
        cajas_vendidas: cajasVal,
        precio_kilo_final: precioVal,
        precio_total: kilosVal * precioVal
      };

      // URL DE PRODUCCIÓN (Render)
      const response = await fetch('https://api-lonja.onrender.com/api/sales', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar venta');
      }
      
      const compraGuardada = await response.json();
      
      setStatus({ type: 'success', msg: `Venta registrada: $${compraGuardada.precio_total.toFixed(2)}` });
      setSelectedLoteId('');
      setSaleData({ kilos: '', cajas: '', precio: '' });
      loadData(); 
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  const handleCreateBuyer = async (e) => {
    e.preventDefault();
    const buyerData = {
      nombre: newBuyerData.nombre, apellido_paterno: newBuyerData.paterno,
      apellido_materno: newBuyerData.materno, correo: newBuyerData.correo, direccion: newBuyerData.direccion
    };
    try {
      // URL DE PRODUCCIÓN (Render)
      const res = await fetch('https://api-lonja.onrender.com/api/buyers', {      
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buyerData)
      });
      const responseData = await res.json();
      
      if (!res.ok) {
        if (responseData.message && (responseData.message.includes('E11000') || responseData.message.includes('duplicate'))) {
          alert("⚠️ Error: Ese correo ya está registrado.");
        } else {
          alert("Error al crear comprador: " + responseData.message);
        }
        return; 
      }
      
      await loadData();
      setSelectedBuyerId(responseData.codigo_cpr);
      setShowBuyerModal(false);
      setNewBuyerData({ nombre: '', paterno: '', materno: '', correo: '', direccion: '' });
    } catch (error) { console.error(error); alert("Error de conexión"); }
  };

  return {
    compradores, inventario, selectedBuyerId, setSelectedBuyerId,
    selectedLoteId, setSelectedLoteId, saleData, setSaleData, status,
    calculateTotal, handleSaleSubmit, showBuyerModal, setShowBuyerModal,
    newBuyerData, setNewBuyerData, handleCreateBuyer, 
    selectedLote: inventario.find(l => l.id_lte === selectedLoteId)
  };
};