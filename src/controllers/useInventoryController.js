import { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';

// Tipos básicos para el dropdown
const TIPOS_FIJOS = [
  { id_tpo: '1', nombre: 'Pescado Fresco' },
  { id_tpo: '2', nombre: 'Marisco' },
];

export const useInventoryController = () => {
  const [inventory, setInventory] = useState([]);
  const [tipos, setTipos] = useState(TIPOS_FIJOS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    speciesName: '', selectedTipo: '', kilos: '', boxes: '', price: '', imageUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    }
  };

  const openModal = (item) => {
    if (item) {
      setEditingId(item.id_lte); 
      setFormData({
        speciesName: item.especie.nombre,
        selectedTipo: item.especie.id_tpo,
        kilos: item.kilos.toString(),
        boxes: item.numero_cajas.toString(),
        price: item.precio_kilo_salida.toString(),
        imageUrl: item.especie.imagen
      });
    } else {
      setEditingId(null);
      setFormData({ speciesName: '', selectedTipo: '', kilos: '', boxes: '', price: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- ESTA ES LA PARTE CLAVE ---
    // El backend espera un objeto que tenga "especie" adentro.
    const payload = {
      kilos: parseFloat(formData.kilos),
      numero_cajas: parseInt(formData.boxes),
      precio_kilo_salida: parseFloat(formData.price),
      especie: {  
        nombre: formData.speciesName,
        id_tpo: formData.selectedTipo,
        imagen: formData.imageUrl || `https://picsum.photos/seed/${formData.speciesName}/200`
      }
    };

    try {
      if (editingId) {
        await inventoryService.update(editingId, payload);
      } else {
        await inventoryService.create(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar lote permanentemente?')) {
      try {
        await inventoryService.delete(id);
        loadData();
      } catch (error) {
        console.error("Error eliminando:", error);
      }
    }
  };

  return {
    inventory, tipos, isModalOpen, setIsModalOpen, editingId,
    formData, setFormData, openModal, handleSubmit, handleDelete
  };
};