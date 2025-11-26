import React from 'react';
import { useInventoryController } from '../controllers/useInventoryController';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const InventoryView = () => {
  const { 
    inventory, tipos, isModalOpen, setIsModalOpen, editingId, 
    formData, setFormData, openModal, handleSubmit, handleDelete 
  } = useInventoryController();

  // Función auxiliar para encontrar el nombre del tipo (Pescado/Marisco)
  const getNombreTipo = (idTipo) => {
    const tipo = tipos.find(t => t.id_tpo === idTipo);
    return tipo ? tipo.nombre : 'General';
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 ml-64">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Inventario de Lotes</h2>
        <button onClick={() => openModal()} className="bg-teal-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-teal-700 shadow-lg">
          <Plus className="w-4 h-4"/> Nuevo Lote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id_lte} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md group relative">
            <img src={item.especie.imagen} className="w-full h-48 object-cover" alt={item.especie.nombre} />
            
            <div className="absolute top-2 right-2 flex gap-1">
               <button onClick={() => openModal(item)} className="p-2 bg-white rounded-full text-slate-700 shadow">
                 <Edit2 className="w-4 h-4"/>
               </button>
               <button onClick={() => handleDelete(item.id_lte)} className="p-2 bg-white rounded-full text-red-600 shadow">
                 <Trash2 className="w-4 h-4"/>
               </button>
            </div>
            
            <div className="p-4">
               <h3 className="font-bold text-lg text-slate-800">{item.especie.nombre}</h3>
               {/* Ajuste aquí para mostrar el nombre del tipo correctamente */}
               <p className="text-teal-600 text-sm">
                 {getNombreTipo(item.especie.id_tpo)}
               </p>
               
               <div className="flex justify-between mt-4 text-sm font-medium bg-slate-50 p-2 rounded">
                  <span>Stock: {item.kilos} kg</span>
                  <span>${item.precio_kilo_salida}/kg</span>
               </div>
            </div>
          </div>
        ))}
        {inventory.length === 0 && <div className="col-span-full py-16 text-center text-slate-400">No hay inventario.</div>}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl">
               <div className="flex justify-between mb-6">
                 <h3 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Lote</h3>
                 <button onClick={() => setIsModalOpen(false)}><X/></button>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <select 
                       required 
                       className="input-std" 
                       value={formData.selectedTipo} 
                       onChange={e => setFormData({...formData, selectedTipo: e.target.value})}
                     >
                        <option value="">-- Tipo --</option>
                        {tipos.map(t => <option key={t.id_tpo} value={t.id_tpo}>{t.nombre}</option>)}
                     </select>
                     
                     <input required placeholder="Especie" className="input-std" value={formData.speciesName} onChange={e => setFormData({...formData, speciesName: e.target.value})} />
                     <input required type="number" placeholder="Kilos" className="input-std" value={formData.kilos} onChange={e => setFormData({...formData, kilos: e.target.value})} />
                     <input required type="number" placeholder="Cajas" className="input-std" value={formData.boxes} onChange={e => setFormData({...formData, boxes: e.target.value})} />
                  </div>
                  <input required type="number" placeholder="Precio ($/kg)" className="input-std" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  <input placeholder="URL Imagen" className="input-std" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                  <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded font-bold">Guardar</button>
               </form>
            </div>
         </div>
      )}
      <style>{`.input-std { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; color: #0f172a; outline: none; }`}</style>
    </div>
  );
};