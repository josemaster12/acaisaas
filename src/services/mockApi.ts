/**
 * Serviços Mockados para Desenvolvimento do Frontend
 * Simula todas as chamadas de API sem necessidade de backend
 */

import {
  mockStores,
  mockProducts,
  mockOrders,
  mockPlans,
  mockDashboardStats,
  mockCategories,
  mockToppings,
  mockUsers as initialMockUsers,
  type MockUser,
  type MockStore,
  type MockOrder,
  type MockPlan,
  type DashboardStats,
} from '@/data/mockData';

// ==================== UTILITÁRIOS ====================

/**
 * Simula delay de rede
 */
function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gera um ID único
 */
function generateId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Simula erro de API
 */
class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number = 400, code: string = 'MOCK_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ==================== ESTADO INTERNO ====================
// Copia dos usuários iniciais + novos usuários criados
// Carrega usuários do localStorage se existir
function loadUsersFromStorage(): MockUser[] {
  try {
    const stored = localStorage.getItem('mock-users');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('[MOCK] Carregados', parsed.length, 'usuários do localStorage');
      return [...initialMockUsers, ...parsed.filter((u: MockUser) =>
        !initialMockUsers.find(iu => iu.email === u.email)
      )];
    }
  } catch (e) {
    console.error('[MOCK] Erro ao carregar usuários:', e);
  }
  return [...initialMockUsers];
}

let mockUsers: MockUser[] = loadUsersFromStorage();

// Salvar usuários no localStorage quando mudar
function saveUsersToStorage() {
  try {
    // Salvar apenas usuários novos (não os iniciais)
    const newUsers = mockUsers.filter(u =>
      !initialMockUsers.find(iu => iu.email === u.email)
    );
    localStorage.setItem('mock-users', JSON.stringify(newUsers));
    console.log('[MOCK] Salvos', newUsers.length, 'usuários no localStorage');
  } catch (e) {
    console.error('[MOCK] Erro ao salvar usuários:', e);
  }
}

// ==================== CLIENTES ====================
// Carrega clientes do localStorage
function loadCustomersFromStorage(): any[] {
  try {
    const stored = localStorage.getItem('mock-customers');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('[MOCK] Erro ao carregar clientes:', e);
  }
  return [];
}

let mockCustomers: any[] = loadCustomersFromStorage();

// Salvar clientes no localStorage quando mudar
function saveCustomersToStorage() {
  try {
    localStorage.setItem('mock-customers', JSON.stringify(mockCustomers));
    console.log('[MOCK] Salvos', mockCustomers.length, 'clientes no localStorage');
  } catch (e) {
    console.error('[MOCK] Erro ao salvar clientes:', e);
  }
}

// Verificar se usuário é admin
function isAdmin(user: MockUser): boolean {
  return user.role === 'admin';
}

// Debug: log inicial
console.log('[MOCK] Inicializado com', mockUsers.length, 'usuários e', mockStores.length, 'lojas');
console.log('[MOCK] Clientes cadastrados:', mockCustomers.length);

// ==================== AUTH ====================

export const mockAuthAPI = {
  /**
   * Login mockado
   */
  login: async (email: string, password: string) => {
    await delay(800);

    console.log('[MOCK LOGIN] Tentando login com:', { email, password });
    console.log('[MOCK LOGIN] Usuários cadastrados:', mockUsers.map(u => ({ email: u.email, id: u.id })));

    const user = mockUsers.find(u => u.email === email && u.password === password);

    console.log('[MOCK LOGIN] Usuário encontrado:', user);

    if (!user) {
      console.error('[MOCK LOGIN] Usuário não encontrado ou senha inválida');
      throw new ApiError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    const { password: _, ...userWithoutPassword } = user;

    console.log('[MOCK LOGIN] Login bem sucedido:', { email: user.email, id: user.id });

    return {
      token,
      user: userWithoutPassword,
    };
  },

  /**
   * Registro mockado
   */
  register: async (email: string, password: string, name: string) => {
    await delay(800);

    console.log('[MOCK REGISTER] Tentando registrar:', { email, name });

    const existingUser = mockUsers.find(u => u.email === email);

    if (existingUser) {
      console.error('[MOCK REGISTER] Email já cadastrado:', email);
      throw new ApiError('Este email já está cadastrado', 409, 'EMAIL_EXISTS');
    }

    const newUser: MockUser = {
      id: generateId(),
      email,
      password,
      name,
    };

    mockUsers.push(newUser);
    saveUsersToStorage(); // Salvar no localStorage

    console.log('[MOCK REGISTER] Usuário criado:', { id: newUser.id, email: newUser.email });
    console.log('[MOCK REGISTER] Total de usuários:', mockUsers.length);

    const token = `mock-token-${newUser.id}-${Date.now()}`;
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      token,
      user: userWithoutPassword,
    };
  },

  /**
   * Perfil do usuário
   */
  getProfile: async () => {
    await delay(300);
    return { message: 'Perfil mockado - implemente a lógica conforme necessário' };
  },

  /**
   * Atualizar perfil
   */
  updateProfile: async (data: Partial<MockUser>) => {
    await delay(500);
    return { message: 'Perfil atualizado (mock)', data };
  },

  /**
   * Recuperar senha
   */
  forgotPassword: async (email: string) => {
    await delay(500);
    return { message: 'Email de recuperação enviado (mock)' };
  },

  /**
   * Alterar senha (admin)
   */
  changePassword: async (userId: string, newPassword: string) => {
    await delay(400);

    const index = mockUsers.findIndex(u => u.id === userId);

    if (index === -1) {
      throw new ApiError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    mockUsers[index].password = newPassword;
    saveUsersToStorage();

    console.log('[MOCK] Senha alterada para usuário:', userId);
    return { message: 'Senha alterada com sucesso' };
  },
};

// ==================== STORES ====================

export const mockStoresAPI = {
  /**
   * Listar lojas do usuário (ou todas se for admin)
   */
  getAll: async (userId?: string, isAdmin?: boolean) => {
    await delay(500);

    let stores = mockStores;

    // Se for admin, retorna todas as lojas
    if (isAdmin) {
      return stores;
    }

    if (userId) {
      stores = mockStores.filter(s => s.owner_id === userId);
    }

    return stores;
  },

  /**
   * Listar TODAS as lojas (para admin)
   */
  getAllStores: async () => {
    await delay(500);
    console.log('[MOCK getAllStores] Retornando', mockStores.length, 'lojas:', mockStores.map(s => ({ id: s.id, name: s.name, owner_id: s.owner_id })));
    return mockStores;
  },

  /**
   * Buscar loja por slug
   */
  getBySlug: async (slug: string) => {
    await delay(400);

    const store = mockStores.find(s => s.slug === slug);

    if (!store) {
      throw new ApiError('Loja não encontrada', 404, 'STORE_NOT_FOUND');
    }

    return store;
  },

  /**
   * Buscar loja por ID
   */
  getById: async (id: string) => {
    await delay(400);

    const store = mockStores.find(s => s.id === id);

    if (!store) {
      throw new ApiError('Loja não encontrada', 404, 'STORE_NOT_FOUND');
    }

    return store;
  },

  /**
   * Criar loja
   */
  create: async (data: Partial<MockStore>) => {
    await delay(600);

    const newStore: MockStore = {
      id: generateId(),
      name: data.name || 'Nova Loja',
      slug: data.slug || `loja-${generateId()}`,
      owner_id: data.owner_id || 'user-1',
      logo: data.logo,
      primary_color: data.primary_color || '#8B5CF6',
      whatsapp: data.whatsapp || '',
      address: data.address || '',
      openHour: data.openHour || 10,
      closeHour: data.closeHour || 22,
      deliveryFee: data.deliveryFee || 5,
      minOrder: data.minOrder || 20,
      estimatedTime: data.estimatedTime || '30-45 min',
      freeToppingsLimit: data.freeToppingsLimit || 3,
      is_active: data.is_active ?? true,
      created_at: new Date().toISOString(),
    };

    mockStores.push(newStore);

    return newStore;
  },

  /**
   * Atualizar loja
   */
  update: async (id: string, data: Partial<MockStore>) => {
    await delay(500);

    const index = mockStores.findIndex(s => s.id === id);

    if (index === -1) {
      throw new ApiError('Loja não encontrada', 404, 'STORE_NOT_FOUND');
    }

    mockStores[index] = { ...mockStores[index], ...data };

    return mockStores[index];
  },

  /**
   * Desativar loja
   */
  deactivate: async (id: string) => {
    await delay(400);

    const index = mockStores.findIndex(s => s.id === id);

    if (index === -1) {
      throw new ApiError('Loja não encontrada', 404, 'STORE_NOT_FOUND');
    }

    mockStores[index].is_active = false;

    return { message: 'Loja desativada com sucesso' };
  },

  /**
   * Ativar loja
   */
  activate: async (id: string) => {
    await delay(400);

    const index = mockStores.findIndex(s => s.id === id);

    if (index === -1) {
      throw new ApiError('Loja não encontrada', 404, 'STORE_NOT_FOUND');
    }

    mockStores[index].is_active = true;

    return { message: 'Loja ativada com sucesso' };
  },

  /**
   * Excluir loja
   */
  delete: async (id: string) => {
    await delay(400);

    const index = mockStores.findIndex(s => s.id === id);

    if (index === -1) {
      throw new ApiError('Loja não encontrada', 404, 'STORE_NOT_FOUND');
    }

    mockStores.splice(index, 1);

    return { message: 'Loja excluída com sucesso' };
  },

  /**
   * Dashboard da loja
   */
  getDashboard: async (id: string) => {
    await delay(500);

    const store = mockStores.find(s => s.id === id);

    if (!store) {
      throw new ApiError('Loja não encontrada', 404, 'STORE_NOT_FOUND');
    }

    return {
      store,
      stats: mockDashboardStats,
    };
  },
};

// ==================== PRODUCTS ====================

export const mockProductsAPI = {
  /**
   * Listar produtos da loja
   */
  getByStore: async (storeId: string, filters?: { category?: string; featured?: boolean }) => {
    await delay(400);

    let products = mockProducts;

    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters?.featured) {
      products = products.filter(p => p.featured);
    }

    return products;
  },

  /**
   * Buscar produto em destaque
   */
  getFeatured: async (storeId: string, limit: number = 10) => {
    await delay(300);

    const featured = mockProducts.filter(p => p.featured).slice(0, limit);

    return featured;
  },

  /**
   * Buscar produto por ID
   */
  getById: async (id: string) => {
    await delay(300);

    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      throw new ApiError('Produto não encontrado', 404, 'PRODUCT_NOT_FOUND');
    }

    return product;
  },

  /**
   * Criar produto
   */
  create: async (data: any) => {
    await delay(600);

    const newProduct = {
      id: data.id || generateId(),
      name: data.name || 'Novo Produto',
      description: data.description || '',
      image: data.image || '',
      category: data.category || 'tradicional',
      sizes: data.sizes || [],
      featured: data.featured ?? false,
    };

    mockProducts.push(newProduct);

    return newProduct;
  },

  /**
   * Atualizar produto
   */
  update: async (id: string, data: any) => {
    await delay(500);

    const index = mockProducts.findIndex(p => p.id === id);

    if (index === -1) {
      throw new ApiError('Produto não encontrado', 404, 'PRODUCT_NOT_FOUND');
    }

    mockProducts[index] = { ...mockProducts[index], ...data };

    return mockProducts[index];
  },

  /**
   * Excluir produto
   */
  delete: async (id: string) => {
    await delay(400);

    const index = mockProducts.findIndex(p => p.id === id);

    if (index === -1) {
      throw new ApiError('Produto não encontrado', 404, 'PRODUCT_NOT_FOUND');
    }

    mockProducts.splice(index, 1);

    return { message: 'Produto excluído com sucesso' };
  },

  /**
   * Atualizar estoque
   */
  updateStock: async (id: string, stock: number) => {
    await delay(300);
    return { message: 'Estoque atualizado (mock)', id, stock };
  },
};

// ==================== CATEGORIES ====================

export const mockCategoriesAPI = {
  getByStore: async (storeId: string) => {
    await delay(300);
    return mockCategories;
  },

  create: async (data: any) => {
    await delay(400);
    const newCategory = { id: generateId(), ...data };
    mockCategories.push(newCategory);
    return newCategory;
  },

  update: async (id: string, data: any) => {
    await delay(400);
    return { message: 'Categoria atualizada (mock)', id, data };
  },

  delete: async (id: string) => {
    await delay(300);
    return { message: 'Categoria excluída (mock)', id };
  },
};

// ==================== ORDERS ====================

export const mockOrdersAPI = {
  /**
   * Criar pedido
   */
  create: async (data: any) => {
    await delay(800);

    const newOrder: MockOrder = {
      id: generateId(),
      store_id: data.store_id || 'store-1',
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_address: data.customer_address,
      customer_reference: data.customer_reference,
      items: data.items,
      subtotal: data.subtotal,
      delivery_fee: data.delivery_fee,
      discount: data.discount || 0,
      total: data.total,
      payment_method: data.payment_method,
      change_for: data.change_for,
      status: 'pendente',
      created_at: new Date().toISOString(),
      estimated_time: data.estimated_time || '30-45 min',
    };

    mockOrders.unshift(newOrder);

    return newOrder;
  },

  /**
   * Listar pedidos da loja
   */
  getByStore: async (storeId: string, status?: string) => {
    await delay(500);

    let orders = mockOrders.filter(o => o.store_id === storeId);

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    return orders;
  },

  /**
   * Buscar pedido por ID
   */
  getById: async (id: string) => {
    await delay(300);

    const order = mockOrders.find(o => o.id === id);

    if (!order) {
      throw new ApiError('Pedido não encontrado', 404, 'ORDER_NOT_FOUND');
    }

    return order;
  },

  /**
   * Atualizar status do pedido
   */
  updateStatus: async (id: string, status: string, estimated_time?: string) => {
    await delay(400);

    const index = mockOrders.findIndex(o => o.id === id);

    if (index === -1) {
      throw new ApiError('Pedido não encontrado', 404, 'ORDER_NOT_FOUND');
    }

    mockOrders[index].status = status as any;

    if (estimated_time) {
      mockOrders[index].estimated_time = estimated_time;
    }

    return mockOrders[index];
  },
};

// ==================== ADDONS ====================

export const mockAddonsAPI = {
  getByStore: async (storeId: string) => {
    await delay(300);
    return mockToppings;
  },

  create: async (data: any) => {
    await delay(400);
    const newAddon = { id: generateId(), ...data };
    mockToppings.push(newAddon);
    return newAddon;
  },

  update: async (id: string, data: any) => {
    await delay(400);
    return { message: 'Adicional atualizado (mock)', id, data };
  },

  delete: async (id: string) => {
    await delay(300);
    return { message: 'Adicional excluído (mock)', id };
  },
};

// ==================== SUBSCRIPTIONS ====================

export const mockSubscriptionsAPI = {
  getPlans: async () => {
    await delay(300);
    return mockPlans;
  },

  getByStore: async (storeId: string) => {
    await delay(300);
    return { plan: mockPlans[0], status: 'active' };
  },

  upgrade: async (storeId: string, planId: string) => {
    await delay(600);
    return { message: 'Plano atualizado com sucesso (mock)', storeId, planId };
  },
};

// ==================== ANALYTICS ====================

export const mockAnalyticsAPI = {
  getDashboard: async (storeId: string, period: string = '30') => {
    await delay(500);
    return mockDashboardStats;
  },
};

// ==================== UPLOAD ====================

export const mockUploadAPI = {
  image: async (file: File) => {
    await delay(800);
    // Retorna uma URL fake para a imagem
    return {
      url: URL.createObjectURL(file),
      filename: file.name,
    };
  },
};

// ==================== CUSTOMERS ====================
export const mockCustomerAPI = {
  /**
   * Cadastrar cliente
   */
  register: async (data: { 
    name: string; 
    email: string; 
    phone: string; 
    password: string;
    address?: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      reference: string;
    };
  }) => {
    await delay(500);

    console.log('[MOCK CUSTOMER] Tentando cadastrar cliente:', { email: data.email, name: data.name });

    // Verificar se email já existe
    const existingCustomer = mockCustomers.find(c => c.email === data.email);
    const existingUser = mockUsers.find(u => u.email === data.email);

    if (existingCustomer || existingUser) {
      console.error('[MOCK CUSTOMER] Email já cadastrado:', data.email);
      throw new ApiError('Este email já está cadastrado', 409, 'EMAIL_EXISTS');
    }

    const newCustomer = {
      id: generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      address: data.address || {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        reference: '',
      },
      created_at: new Date().toISOString(),
    };

    mockCustomers.push(newCustomer);
    saveCustomersToStorage();

    console.log('[MOCK CUSTOMER] Cliente cadastrado:', { id: newCustomer.id, email: newCustomer.email });
    console.log('[MOCK CUSTOMER] Total de clientes:', mockCustomers.length);

    return {
      message: 'Cliente cadastrado com sucesso',
      customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
      },
    };
  },

  /**
   * Login de cliente
   */
  login: async (email: string, password: string) => {
    await delay(500);

    console.log('[MOCK CUSTOMER LOGIN] Tentando login com:', { email, password });

    let customer = mockCustomers.find(c => c.email === email && c.password === password);
    
    // Verificar senha temporária
    if (!customer) {
      const customerWithTemp = mockCustomers.find(c => c.email === email);
      if (customerWithTemp && customerWithTemp.tempPassword === password) {
        // Verificar se senha temporária ainda é válida
        const expiry = new Date(customerWithTemp.tempPasswordExpiry);
        if (expiry > new Date()) {
          customer = customerWithTemp;
          console.log('[MOCK CUSTOMER LOGIN] Login com senha temporária válido');
        } else {
          console.error('[MOCK CUSTOMER LOGIN] Senha temporária expirada');
          throw new ApiError('Senha temporária expirada', 401, 'TEMP_PASSWORD_EXPIRED');
        }
      }
    }

    if (!customer) {
      console.error('[MOCK CUSTOMER LOGIN] Cliente não encontrado ou senha inválida');
      throw new ApiError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
    }

    const token = `mock-customer-token-${customer.id}-${Date.now()}`;
    const { password: _, tempPassword, tempPasswordExpiry, ...customerWithoutPassword } = customer;

    console.log('[MOCK CUSTOMER LOGIN] Login bem sucedido:', { email: customer.email, id: customer.id });

    return {
      token,
      customer: customerWithoutPassword,
    };
  },

  /**
   * Listar clientes (admin)
   */
  getAll: async () => {
    await delay(400);
    return mockCustomers.map(({ password, ...c }) => c);
  },
};

// Export all APIs as a single object for convenience
export const mockAPI = {
  auth: mockAuthAPI,
  stores: mockStoresAPI,
  products: mockProductsAPI,
  categories: mockCategoriesAPI,
  orders: mockOrdersAPI,
  addons: mockAddonsAPI,
  subscriptions: mockSubscriptionsAPI,
  analytics: mockAnalyticsAPI,
  upload: mockUploadAPI,
  customers: mockCustomerAPI,
};
