
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
  Inventory: {
    getAllDetailed: async () => [],
    getTypes: async () => [],
    create: async () => {},
    update: async () => {},
    delete: async () => {}
  }
};