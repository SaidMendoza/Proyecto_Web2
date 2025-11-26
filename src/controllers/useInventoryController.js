// src/controllers/useInventoryController.ts (o .js si ya lo cambiaste)
import { useState, useEffect } from 'react';
// IMPORTANTE: Importa el nuevo servicio
import { inventoryService } from '../services/inventoryService';

// Tipos fijos por ahora (para no complicar más la DB innecesariamente)
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
    speciesName: '',
    selectedTipo: '',
    kilos: '',
    boxes: '',
    price: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // AQUÍ: Llamamos al backend en lugar del Repository
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const openModal = (item) => {
    if (item) {
      // Nota: item.id_lte viene gracias al transform que pusimos en el modelo
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
    
    // Preparamos el objeto unificado como lo espera el Backend
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
      loadData(); // Recargamos la lista desde la DB
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Hubo un error al guardar");
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
    inventory, tipos,
    isModalOpen, setIsModalOpen,
    editingId,
    formData, setFormData,
    openModal,
    handleSubmit,
    handleDelete
  };
};