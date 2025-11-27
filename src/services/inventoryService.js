const API_URL = 'https://api-lonja.onrender.com/api/inventory'; 

export const inventoryService = {
  getAll: async () => {
    const res = await fetch(API_URL);
    return await res.json();
  },
  create: async (data) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  delete: async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  }
};