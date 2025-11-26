import React from 'react';
import { useBuyersController } from '../controllers/useBuyersController';
import { Plus, User, Edit2, Trash2, Save, X } from 'lucide-react';

export const BuyersView = () => {
  const { 
    buyers, 
    showForm, 
    setShowForm, 
    editingId, 
    formData, 
    setFormData, 
    handleEdit, 
    handleDelete, 
    handleSubmit, 
    resetForm 
  } = useBuyersController();

  return (
    <div className="p-8 min-h-screen bg-slate-50 ml-64">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Compradores</h2>
        <button 
          onClick={() => {resetForm(); setShowForm(!showForm)}} 
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} 
          {showForm ? 'Cerrar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
         <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-2 gap-4">
            <input 
              required 
              placeholder="Nombre" 
              className="input-std" 
              value={formData.nombre} 
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
            />
            <input 
              required 
              placeholder="Apellido" 
              className="input-std" 
              value={formData.paterno} 
              onChange={e => setFormData({...formData, paterno: e.target.value})} 
            />
            <input 
              placeholder="Materno" 
              className="input-std" 
              value={formData.materno} 
              onChange={e => setFormData({...formData, materno: e.target.value})} 
            />
            <input 
              required 
              placeholder="Correo" 
              className="input-std" 
              value={formData.correo} 
              onChange={e => setFormData({...formData, correo: e.target.value})} 
            />
            <input 
              required 
              placeholder="Dirección" 
              className="input-std col-span-2" 
              value={formData.direccion} 
              onChange={e => setFormData({...formData, direccion: e.target.value})} 
            />
            <button type="submit" className="col-span-2 bg-teal-600 text-white py-2 rounded font-bold flex justify-center gap-2">
              <Save className="w-4 h-4"/> Guardar
            </button>
         </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {buyers.map(b => (
            <div key={b.codigo_cpr} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative group">
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(b)} className="text-blue-600 bg-blue-50 p-1 rounded">
                    <Edit2 className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleDelete(b.codigo_cpr)} className="text-red-600 bg-red-50 p-1 rounded">
                    <Trash2 className="w-4 h-4"/>
                  </button>
               </div>
               <div className="flex items-center gap-4">
                  <div className="bg-teal-50 p-3 rounded-full">
                    <User className="text-teal-600 w-6 h-6"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{b.nombre} {b.apellido_paterno}</h4>
                    <p className="text-sm text-slate-500">{b.correo}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>
      <style>{`.input-std { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; color: #0f172a; }`}</style>
    </div>
  );
};