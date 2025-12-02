import { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';

// CATÁLOGOS
const TIPOS = [
  { id_tpo: '1', nombre: 'Pescado Fresco' },
  { id_tpo: '2', nombre: 'Marisco' },
  { id_tpo: '3', nombre: 'Derivados' },

];

const ESPECIES_POR_TIPO = {
  '1': ['Robalo', 'Huachinango', 'Sierra', 'Mojarra', 'Pargo'],
  '2': ['Camarón Cristal', 'Jaiba', 'Pulpo', 'Ostión', 'Calamar'],
  '3': ['Surimi', 'Caviar', 'Harina de pescado']

};

export const useInventoryController = () => {
  const [inventory, setInventory] = useState([]);
  const [tipos] = useState(TIPOS);
  const [availableSpecies, setAvailableSpecies] = useState([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    selectedTipo: '',
    speciesName: '',
    kilos: '',
    num_de_cajas: '',
    precio_kilo_salida: '',
    fecha: '', 
    imageFile: null,
    imagePreview: '' 
  });

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (formData.selectedTipo) {
      setAvailableSpecies(ESPECIES_POR_TIPO[formData.selectedTipo] || []);
      setFormData(prev => ({ ...prev, speciesName: '' }));
    } else {
      setAvailableSpecies([]);
    }
  }, [formData.selectedTipo]);

  const loadData = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (error) { console.error(error); }
  };

  const openModal = (item) => {
    if (item) {
      setEditingId(item.id_lte); 
      const tipoId = item.especie.id_tpo;
      setAvailableSpecies(ESPECIES_POR_TIPO[tipoId] || []);
      
      setFormData({
        selectedTipo: tipoId,
        speciesName: item.especie.nombre,
        kilos: item.kilos.toString(),
        num_de_cajas: item.num_de_cajas.toString(),
        precio_kilo_salida: item.precio_kilo_salida.toString(),
        fecha: item.fecha ? item.fecha.split('T')[0] : '', 
        imageFile: null,
        imagePreview: item.especie.imagen 
      });
    } else {
      setEditingId(null);
      setAvailableSpecies([]);
      setFormData({ 
        selectedTipo: '', speciesName: '', kilos: '', 
        num_de_cajas: '', precio_kilo_salida: '', fecha: '',
        imageFile: null, imagePreview: '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imagePreview) {
      alert("Por favor selecciona una imagen");
      return;
    }

    const payload = {
      kilos: parseFloat(formData.kilos),
      num_de_cajas: parseInt(formData.num_de_cajas),
      precio_kilo_salida: parseFloat(formData.precio_kilo_salida),
      fecha: formData.fecha || new Date(), 
      especie: {
        nombre: formData.speciesName,
        id_tpo: formData.selectedTipo,
        imagen: formData.imagePreview 
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
      alert("Error al guardar: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar lote?')) {
      await inventoryService.delete(id);
      loadData();
    }
  };

  return {
    inventory, tipos, availableSpecies, isModalOpen, setIsModalOpen, editingId,
    formData, setFormData, openModal, handleSubmit, handleDelete, handleImageChange
  };
};