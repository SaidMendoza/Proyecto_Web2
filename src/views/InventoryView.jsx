import React from 'react';
import { useInventoryController } from '../controllers/useInventoryController';
import { Plus, Edit2, Trash2, X, UploadCloud, Image as ImageIcon } from 'lucide-react';

export const InventoryView = () => {
  const { 
    inventory, tipos, availableSpecies, isModalOpen, setIsModalOpen, editingId, 
    formData, setFormData, openModal, handleSubmit, handleDelete, handleImageChange 
  } = useInventoryController();

  const getNombreTipo = (id) => tipos.find(t => t.id_tpo === id)?.nombre || 'General';

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
            <div className="h-48 bg-slate-200 w-full">
                {item.especie.imagen ? (
                    <img src={item.especie.imagen} className="w-full h-48 object-cover" alt="img" />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400"><ImageIcon/></div>
                )}
            </div>
            
            <div className="absolute top-2 right-2 flex gap-1">
               <button onClick={() => openModal(item)} className="p-2 bg-white rounded-full text-slate-700 shadow"><Edit2 className="w-4 h-4"/></button>
               <button onClick={() => handleDelete(item.id_lte)} className="p-2 bg-white rounded-full text-red-600 shadow"><Trash2 className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4">
               <h3 className="font-bold text-lg text-slate-800">{item.especie.nombre}</h3>
               <div className="flex justify-between items-center text-sm mb-2">
                 <p className="text-teal-600">{getNombreTipo(item.especie.id_tpo)}</p>
                 <p className="text-slate-400 text-xs">
                   {item.fecha 
                     ? new Date(item.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' }) 
                     : 'Sin fecha'}
                 </p>
               </div>               
               <div className="flex justify-between mt-2 text-sm font-medium bg-slate-50 p-2 rounded">
                  <span>Stock: {item.kilos} kg</span>
                  <span>${item.precio_kilo_salida}/kg</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between mb-6">
                 <h3 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Lote</h3>
                 <button onClick={() => setIsModalOpen(false)}><X/></button>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-sm font-bold text-slate-700">Tipo de Producto</label>
                        <select required className="input-std mt-1" value={formData.selectedTipo} onChange={e => setFormData({...formData, selectedTipo: e.target.value})}>
                            <option value="">-- Seleccionar --</option>
                            {tipos.map(t => <option key={t.id_tpo} value={t.id_tpo}>{t.nombre}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="text-sm font-bold text-slate-700">Especie</label>
                        <select required className="input-std mt-1" value={formData.speciesName} onChange={e => setFormData({...formData, speciesName: e.target.value})} disabled={!formData.selectedTipo}>
                            <option value="">-- Seleccionar --</option>
                            {availableSpecies.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>

                     <input required type="number" placeholder="Kilos" className="input-std" value={formData.kilos} onChange={e => setFormData({...formData, kilos: e.target.value})} />
                     <input required type="number" placeholder="Num. Cajas" className="input-std" value={formData.num_de_cajas} onChange={e => setFormData({...formData, num_de_cajas: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <input required type="number" placeholder="Precio Salida ($/kg)" className="input-std" value={formData.precio_kilo_salida} onChange={e => setFormData({...formData, precio_kilo_salida: e.target.value})} />
                     
                     {/* INPUT DE FECHA */}
                     <input required type="date" className="input-std" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} />
                  </div>
                  
                  {/* DRAG AND DROP */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {formData.imagePreview ? (
                          <div className="flex flex-col items-center">
                              <img src={formData.imagePreview} alt="Preview" className="h-32 object-contain mb-2 rounded shadow-sm" />
                              <span className="text-xs text-teal-600 font-bold">Clic o arrastra para cambiar</span>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center text-slate-400">
                              <UploadCloud className="w-8 h-8 mb-2"/>
                              <span className="text-sm">Arrastra una imagen o haz clic aquí</span>
                          </div>
                      )}
                  </div>

                  <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded font-bold hover:bg-teal-700 transition-colors">Guardar Lote</button>
               </form>
            </div>
         </div>
      )}
      <style>{`.input-std { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; color: #0f172a; outline: none; }`}</style>
    </div>
  );
};