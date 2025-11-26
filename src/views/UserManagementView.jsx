import React from 'react';
import { useUserController } from '../controllers/useUserController';
import { ShieldCheck, Plus, Trash2, Lock, User as UserIcon, X, Save, AlertTriangle } from 'lucide-react';

export const UserManagementView = () => {
  const { 
    users, showModal, setShowModal, formData, setFormData, 
    adminAuth, setAdminAuth, error, successMsg, handleCreate, handleDelete 
  } = useUserController();

  return (
    <div className="p-8 min-h-screen bg-slate-50 ml-64">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Control de Accesos</h2>
        <button onClick={() => setShowModal(true)} className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <Plus className="w-4 h-4"/> Agregar Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="p-4">Usuario</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Rol</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 text-slate-700">
                     <td className="p-4">{u.username}</td>
                     <td className="p-4">{u.name}</td>
                     <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs ${u.role==='admin'?'bg-purple-100 text-purple-800':'bg-blue-100 text-blue-800'}`}>
                         {u.role}
                       </span>
                     </td>
                     <td className="p-4 text-right">
                       <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                         <Trash2 className="w-4 h-4"/>
                       </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {showModal && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border-t-4 border-slate-800">
               <div className="flex justify-between mb-4">
                 <h3 className="font-bold flex gap-2"><ShieldCheck/> Nuevo Usuario</h3>
                 <button onClick={() => setShowModal(false)}><X/></button>
               </div>
               
               {successMsg ? (
                 <div className="text-center text-green-600 font-bold p-8">{successMsg}</div> 
               ) : (
                  <form onSubmit={handleCreate} className="space-y-4">
                     <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 flex gap-2">
                       <AlertTriangle className="w-4 h-4"/> Requiere contraseña Admin
                     </div>
                     <input 
                       required 
                       placeholder="Nombre Completo" 
                       className="input-std" 
                       value={formData.name} 
                       onChange={e=>setFormData({...formData, name: e.target.value})} 
                     />
                     <div className="grid grid-cols-2 gap-4">
                        <input 
                          required 
                          placeholder="Usuario" 
                          className="input-std" 
                          value={formData.username} 
                          onChange={e=>setFormData({...formData, username: e.target.value})} 
                        />
                        <select 
                          className="input-std" 
                          value={formData.role} 
                          onChange={e=>setFormData({...formData, role: e.target.value})}
                        >
                          <option value="user">Vendedor</option>
                          <option value="admin">Admin</option>
                        </select>
                     </div>
                     <input 
                       required 
                       type="password" 
                       placeholder="Nueva Contraseña" 
                       className="input-std" 
                       value={formData.password} 
                       onChange={e=>setFormData({...formData, password: e.target.value})} 
                     />
                     
                     <div className="border-t pt-4">
                        <label className="text-xs font-bold block mb-1">Autorización Admin</label>
                        <input 
                          required 
                          type="password" 
                          placeholder="Contraseña Admin Actual" 
                          className="input-std bg-red-50 border-red-200" 
                          value={adminAuth} 
                          onChange={e=>setAdminAuth(e.target.value)} 
                        />
                     </div>
                     
                     {error && <div className="text-red-600 text-xs font-bold text-center">{error}</div>}
                     
                     <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded font-bold mt-2">
                       Crear Usuario
                     </button>
                  </form>
               )}
            </div>
         </div>
      )}
      <style>{`.input-std { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; color: #0f172a; }`}</style>
    </div>
  );
};