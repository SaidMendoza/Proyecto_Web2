import React from 'react';
import { useSalesController } from '../controllers/useSalesController';
import { Save, AlertCircle, CheckCircle2, UserPlus, X } from 'lucide-react';

export const SalesView = () => {
  const { 
    compradores, inventario, selectedBuyerId, setSelectedBuyerId, selectedLoteId, setSelectedLoteId,
    saleData, setSaleData, status, calculateTotal, handleSaleSubmit,
    showBuyerModal, setShowBuyerModal, newBuyerData, setNewBuyerData, handleCreateBuyer, selectedLote
  } = useSalesController();

  return (
    <div className="p-8 min-h-screen bg-slate-50 ml-64 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Registro de Venta</h2>
        <form onSubmit={handleSaleSubmit} className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 space-y-8">
          
          {/* CLIENTE */}
          <div>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
               <h3 className="text-lg font-bold text-slate-800">1. Cliente</h3>
               <button type="button" onClick={() => setShowBuyerModal(true)} className="text-teal-600 flex items-center gap-1 font-medium">
                 <UserPlus className="w-4 h-4"/> Nuevo
               </button>
            </div>
            <select value={selectedBuyerId} onChange={e => setSelectedBuyerId(e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-white">
               <option value="">-- Seleccione Comprador --</option>
               {compradores.map(c => (
                 <option key={c.codigo_cpr} value={c.codigo_cpr}>
                   {c.nombre} {c.apellido_paterno}
                 </option>
               ))}
            </select>
          </div>

          {/* PRODUCTO */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Producto</h3>
            <select value={selectedLoteId} onChange={e => setSelectedLoteId(e.target.value)} className="w-full p-3 border rounded-lg text-slate-900 bg-white">
               <option value="">-- Seleccione Lote --</option>
               {inventario.map(i => (
                 <option key={i.id_lte} value={i.id_lte}>
                   {i.especie.nombre} ({i.kilos}kg disp)
                 </option>
               ))}
            </select>

            {selectedLote && (
               <div className="mt-4 p-4 bg-slate-50 rounded flex gap-4 items-center">
                 <img src={selectedLote.especie.imagen} className="w-16 h-16 rounded object-cover" alt="img" />
                 <div>
                   <p className="font-bold text-lg">{selectedLote.especie.nombre}</p>
                   <p className="text-sm text-teal-600">Stock: {selectedLote.kilos} kg</p>
                 </div>
               </div>
            )}
          </div>

          {/* DETALLES */}
          <div className={!selectedLote ? 'opacity-50 pointer-events-none' : ''}>
             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">3. Detalles</h3>
             <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Kilos</label>
                  <input type="number" step="0.01" value={saleData.kilos} onChange={e => setSaleData({...saleData, kilos: e.target.value})} className="w-full p-3 border rounded text-slate-900"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cajas</label>
                  <input type="number" value={saleData.cajas} onChange={e => setSaleData({...saleData, cajas: e.target.value})} className="w-full p-3 border rounded text-slate-900"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio ($/kg)</label>
                  <input type="number" step="0.01" value={saleData.precio} onChange={e => setSaleData({...saleData, precio: e.target.value})} className="w-full p-3 border rounded text-slate-900"/>
                </div>
             </div>
          </div>

          {/* TOTAL Y BOTÓN */}
          <div className="bg-slate-800 text-white p-6 rounded-lg flex justify-between items-center">
             <div>
               <p className="text-sm text-slate-400">Total a Cobrar</p>
               <p className="text-4xl font-bold">${calculateTotal().toFixed(2)}</p>
             </div>
             <button type="submit" className="bg-teal-500 px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-400 disabled:opacity-50" disabled={!selectedBuyerId || !selectedLoteId}>
               <Save className="w-6 h-6"/> Confirmar
             </button>
          </div>

          {/* MENSAJES DE ESTADO */}
          {status.type !== 'idle' && (
             <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>} {status.msg}
             </div>
          )}
        </form>
      </div>

      {/* MODAL NUEVO COMPRADOR */}
      {showBuyerModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
               <div className="flex justify-between mb-4">
                 <h3 className="font-bold">Nuevo Cliente</h3>
                 <button onClick={() => setShowBuyerModal(false)}><X/></button>
               </div>
               <form onSubmit={handleCreateBuyer} className="space-y-4">
                  <input placeholder="Nombre" required className="w-full p-2 border rounded text-slate-900" value={newBuyerData.nombre} onChange={e=>setNewBuyerData({...newBuyerData, nombre: e.target.value})} />
                  <input placeholder="Apellido" required className="w-full p-2 border rounded text-slate-900" value={newBuyerData.paterno} onChange={e=>setNewBuyerData({...newBuyerData, paterno: e.target.value})} />
                  <input placeholder="Correo" required className="w-full p-2 border rounded text-slate-900" value={newBuyerData.correo} onChange={e=>setNewBuyerData({...newBuyerData, correo: e.target.value})} />
                  <input placeholder="Dirección" required className="w-full p-2 border rounded text-slate-900" value={newBuyerData.direccion} onChange={e=>setNewBuyerData({...newBuyerData, direccion: e.target.value})} />
                  <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded font-bold">Guardar</button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};