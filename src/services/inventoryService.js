
//const API_URL = 'http://localhost:4000/api/inventory';

const API_URL = 'https://api-lonja.onrender.com/api/inventory'; 

export const inventoryService = {
  getAll: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener inventario');
    return await res.json();
  },
  
  create: async (data) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear');
    }
    return await res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar');
    return await res.json();
  },

  delete: async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  }
};