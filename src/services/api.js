const API_URL = 'http://localhost:4000/api'; // URL de backend local

export const getInventory = async () => {
    const response = await fetch(`${API_URL}/inventory`);
    if (!response.ok) throw new Error('Error al cargar inventario');
    return await response.json();
};

export const addProduct = async (productData) => {
    const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return await response.json();
};