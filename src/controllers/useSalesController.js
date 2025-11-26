import { useState, useEffect } from 'react';
import { Repository } from '../models/Repository';
import { inventoryService } from '../services/inventoryService';

export const useSalesController = () => {
  const [compradores, setCompradores] = useState([]);
  const [inventario, setInventario] = useState([]);
  
  const [selectedBuyerId, setSelectedBuyerId] = useState('');
  const [selectedLoteId, setSelectedLoteId] = useState('');
  
  const [saleData, setSaleData] = useState({ kilos: '', cajas: '', precio: '' });
  const [status, setStatus] = useState({ type: 'idle', msg: '' });

  // Modal rápido de nuevo comprador
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [newBuyerData, setNewBuyerData] = useState({ nombre: '', paterno: '', materno: '', correo: '', direccion: '' });

  useEffect(() => {
    loadData();
  }, []);

  // Efecto para autocompletar precio y stock al elegir lote
  useEffect(() => {
    if (selectedLoteId) {
      const lote = inventario.find(l => l.id_lte === selectedLoteId);
      if (lote) {
        setSaleData({
          kilos: lote.kilos.toString(),
          cajas: lote.numero_cajas.toString(),
          precio: lote.precio_kilo_salida.toString()
        });
      }
    } else {
      setSaleData({ kilos: '', cajas: '', precio: '' });
    }
  }, [selectedLoteId, inventario]);

  const loadData = async () => {
    try {
      // 1. CARGAMOS COMPRADORES (¡AHORA DESDE EL BACKEND REAL!)
      const resBuyers = await fetch('http://localhost:5000/api/buyers');
      const compradoresReales = await resBuyers.json();
      setCompradores(compradoresReales);

      // 2. Cargamos Inventario (Desde Backend)
      const inv = await inventoryService.getAll();
      setInventario(inv.filter(i => i.kilos > 0)); // Solo mostramos lotes con existencias
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
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

      const compraPayload = {
        codigo_cpr: selectedBuyerId,
        id_lte: selectedLoteId,
        precio_kilo_final: precioVal,
        precio_total: kilosVal * precioVal,
        fecha: new Date().toISOString(),
        kilos_vendidos: kilosVal,
        cajas_vendidas: cajasVal
      };

      // --- CAMBIO: USAR FETCH AL BACKEND REAL ---
      const response = await fetch('http://localhost:5000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar venta');
      }
      
      const compraGuardada = await response.json();
      // ------------------------------------------
      
      setStatus({ type: 'success', msg: `Venta registrada: $${compraGuardada.precio_total.toFixed(2)}` });
      setSelectedLoteId('');
      setSaleData({ kilos: '', cajas: '', precio: '' });
      loadData(); // Esto actualizará el stock visualmente porque lo lee de la DB
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  const handleCreateBuyer = async (e) => {
    e.preventDefault();
    
    // Crear comprador rápido usando la API real
    const buyerData = {
      nombre: newBuyerData.nombre,
      apellido_paterno: newBuyerData.paterno,
      apellido_materno: newBuyerData.materno,
      correo: newBuyerData.correo,
      direccion: newBuyerData.direccion
    };

    try {
      const res = await fetch('http://localhost:5000/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buyerData)
      });
      const newBuyer = await res.json();
      
      await loadData(); // Recargar listas
      setSelectedBuyerId(newBuyer.codigo_cpr); // Seleccionar el nuevo comprador automáticamente
      setShowBuyerModal(false);
      setNewBuyerData({ nombre: '', paterno: '', materno: '', correo: '', direccion: '' });
    } catch (error) {
      console.error("Error creando comprador rápido:", error);
    }
  };

  return {
    compradores,
    inventario,
    selectedBuyerId, setSelectedBuyerId,
    selectedLoteId, setSelectedLoteId,
    saleData, setSaleData,
    status,
    calculateTotal,
    handleSaleSubmit,
    showBuyerModal, setShowBuyerModal,
    newBuyerData, setNewBuyerData,
    handleCreateBuyer,
    selectedLote: inventario.find(l => l.id_lte === selectedLoteId)
  };
};