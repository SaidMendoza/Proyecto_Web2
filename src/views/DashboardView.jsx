// src/views/DashboardView.jsx
import React from 'react';
import { useDashboardController } from '../controllers/useDashboardController';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, Package, TrendingUp, Edit2, Save, X, AlertCircle } from 'lucide-react';

export const DashboardView = () => {
  const { 
    ventas, 
    fecha, 
    setFecha, 
    metrics, 
    editingSale, 
    setEditingSale, 
    openEditModal, 
    formState, 
    setFormState, 
    handleUpdateSale, 
    error 
  } = useDashboardController();

  const chartData = ventas.map(v => ({
    name: v.comprador.nombre + ' ' + v.comprador.apellido_paterno,
    total: v.precio_total,
    kilos: v.kilos_vendidos ?? v.lote.kilos
  }));

  return (
    <div className="p-8 min-h-screen bg-slate-50 ml-64">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Reporte Diario</h2>
          <p className="text-slate-500 mt-1">Resumen de actividad comercial</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
          <Calendar className="w-5 h-5 text-teal-600" />
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            className="outline-none text-slate-700 font-medium" 
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard icon={DollarSign} color="teal" label="Ventas Totales" value={`$${metrics.totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
        <MetricCard icon={TrendingUp} color="blue" label="Kilos Vendidos" value={`${metrics.totalKilos.toFixed(2)} kg`} />
        <MetricCard icon={Package} color="purple" label="Cajas Movidas" value={metrics.totalCajas.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ventas por Comprador</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0d9488" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Kilos por Comprador</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="kilos" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold">
            <tr>
              <th className="px-6 py-3">Hora</th>
              <th className="px-6 py-3">Comprador</th>
              <th className="px-6 py-3">Especie</th>
              <th className="px-6 py-3 text-right">Kilos</th>
              <th className="px-6 py-3 text-right">Cajas</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ventas.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">No hay registros.</td></tr>
            ) : (
              ventas.map(v => (
                <tr key={v.id_cmp} className="hover:bg-slate-50">
                  <td className="px-6 py-3">{new Date(v.fecha).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                  <td className="px-6 py-3">{v.comprador.nombre} {v.comprador.apellido_paterno}</td>
                  <td className="px-6 py-3">{v.especie?.nombre}</td>
                  <td className="px-6 py-3 text-right">{v.kilos_vendidos?.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">{v.cajas_vendidas}</td>
                  <td className="px-6 py-3 text-right font-bold">${v.precio_total.toFixed(2)}</td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => openEditModal(v)} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingSale && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Editar Venta</h3>
              <button onClick={() => setEditingSale(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="bg-blue-50 p-3 rounded mb-4 text-sm text-blue-800">
               Stock físico disponible + esta venta: <strong>{(editingSale.lote.kilos + (editingSale.kilos_vendidos ?? 0)).toFixed(2)} kg</strong>
            </div>

            <form onSubmit={handleUpdateSale} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  step="0.01" 
                  className="input-std" 
                  placeholder="Kilos" 
                  value={formState.kilos} 
                  onChange={e => setFormState({...formState, kilos: e.target.value})} 
                />
                <input 
                  type="number" 
                  className="input-std" 
                  placeholder="Cajas" 
                  value={formState.cajas} 
                  onChange={e => setFormState({...formState, cajas: e.target.value})} 
                />
              </div>
              <input 
                type="number" 
                step="0.01" 
                className="input-std" 
                placeholder="Precio Final" 
                value={formState.precio} 
                onChange={e => setFormState({...formState, precio: e.target.value})} 
              />
              
              {error && (
                <div className="text-red-600 bg-red-50 p-2 text-sm rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />{error}
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                 <button type="button" onClick={() => setEditingSale(null)} className="btn-secondary">Cancelar</button>
                 <button type="submit" className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.input-std { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; color: #0f172a; } .btn-primary { background: #0d9488; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; } .btn-secondary { background: #f1f5f9; color: #475569; padding: 0.5rem 1rem; border-radius: 0.5rem; }`}</style>
    </div>
  );
};

// Componente simple sin tipos explícitos
const MetricCard = ({ icon: Icon, color, label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-4 bg-${color}-50 rounded-full`}>
      <Icon className={`w-8 h-8 text-${color}-600`} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);