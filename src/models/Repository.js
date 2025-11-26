// src/models/Repository.js

// Simulamos los datos viejos para que las pestañas que aun no migras
// no rompan la aplicación.

export const Repository = {
  Auth: {
    login: async () => ({ id: '1', name: 'Admin', role: 'admin' })
  },
  Users: {
    getAll: async () => [],
    create: async () => {},
    delete: async () => {}
  },
  Buyers: {
    getAll: async () => [],
    create: async () => {},
    update: async () => {},
    delete: async () => {}
  },
  Sales: {
    create: async () => {},
    update: async () => {},
    getReportByDate: async () => []
  },
  // La parte de Inventory ya NO se usa desde aquí porque la migraste,
  // pero la dejamos vacía por si acaso alguna referencia quedó suelta.
  Inventory: {
    getAllDetailed: async () => [],
    getTypes: async () => [],
    create: async () => {},
    update: async () => {},
    delete: async () => {}
  }
};