/**
 * Serviço de API - Pronto Açaí Now
 * Gerencia todas as requisições para o backend
 *
 * MODO MOCK: Quando USE_MOCK_API estiver true, usa dados locais sem backend
 * MODO SUPABASE: Quando USE_MOCK_API estiver false, usa Supabase diretamente
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// ==================== CONFIGURAÇÃO MOCK ====================
// Defina como true para usar dados mockados sem backend
// Defina como false para usar Supabase
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK === 'true';

// Importar API mockada quando necessário
let mockAPI: any = null;
if (USE_MOCK_API) {
  import('./mockApi').then(module => {
    mockAPI = module.mockAPI;
  });
}

// Importar serviços Supabase
let supabaseServices: any = null;
let supabaseAuth: any = null;
if (!USE_MOCK_API) {
  Promise.all([
    import('@/lib/supabase.services'),
    import('@/lib/supabase')
  ]).then(([servicesModule, authModule]) => {
    supabaseServices = servicesModule.default;
    supabaseAuth = authModule.supabaseAuth;
    console.log('✅ Supabase conectado!');
  });
}

// Variáveis de controle
let mockAPIReady = false;
let supabaseReady = false;

if (USE_MOCK_API) {
  mockAPIReady = true;
} else {
  supabaseReady = true;
}

function waitForMockAPI() {
  return new Promise<void>((resolve) => {
    const check = () => {
      if (mockAPI) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

/**
 * Fazer requisição HTTP com autenticação (usa Supabase quando não é mock)
 */
async function request(endpoint: string, options: any = {}) {
  // Se estiver usando mock, usar a API mockada
  if (USE_MOCK_API) {
    if (!mockAPIReady) {
      await waitForMockAPI();
    }
    return handleMockRequest(endpoint, options);
  }

  // ==================== MODO SUPABASE ====================
  // Mapeia endpoints da API para chamadas Supabase
  if (!supabaseServices || !supabaseAuth) {
    await new Promise<void>((resolve) => {
      const check = () => {
        if (supabaseServices && supabaseAuth) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  try {
    // AUTH
    if (endpoint === '/api/auth/login' && options.method === 'POST') {
      const { email, password } = JSON.parse(options.body);
      const { data, error } = await supabaseAuth.signIn(email, password);
      if (error) throw { status: 401, message: error.message, code: 'AUTH_ERROR' };
      
      // Buscar perfil do usuário
      const { data: profile } = await supabaseServices.profiles.getById(data.user.id);
      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.user_metadata?.name,
          phone: profile?.phone || data.user.user_metadata?.phone,
          role: profile?.role || 'customer'
        },
        session: data.session
      };
    }
    
    if (endpoint === '/api/auth/register' && options.method === 'POST') {
      const { email, password, name } = JSON.parse(options.body);
      const { data, error } = await supabaseAuth.signUp(email, password, { name, role: 'owner' });
      if (error) throw { status: 400, message: error.message, code: 'AUTH_ERROR' };

      // Aguardar um pouco para garantir que o usuário foi criado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Tentar criar o perfil manualmente (pode falhar se o trigger já criou)
      try {
        const { error: profileError } = await supabaseServices.profiles.create({
          id: data.user!.id,
          email,
          name,
          role: 'owner'
        });
        
        // Ignorar erro de "duplicate key" se o trigger já criou
        if (profileError && !profileError.message.includes('duplicate')) {
          console.error('Erro ao criar perfil:', profileError);
        }
      } catch (err) {
        // Perfil já existe ou erro ignorável
        console.log('Perfil já existe ou erro ignorável');
      }

      return {
        token: data.session?.access_token,
        user: {
          id: data.user!.id,
          email,
          name,
          role: 'owner'
        },
        session: data.session
      };
    }
    
    if (endpoint === '/api/auth/me' && options.method === 'GET') {
      const { data } = await supabaseAuth.getUser();
      if (!data?.user) throw { status: 401, message: 'Não autenticado', code: 'AUTH_ERROR' };
      
      const { data: profile } = await supabaseServices.profiles.getById(data.user.id);
      return profile;
    }
    
    if (endpoint === '/api/auth/forgot-password' && options.method === 'POST') {
      const { email } = JSON.parse(options.body);
      await supabaseAuth.resetPassword(email);
      return { message: 'Email de recuperação enviado' };
    }

    // STORES
    if (endpoint === '/api/stores/my' && options.method === 'GET') {
      const { data: userData } = await supabaseAuth.getUser();
      const { data: stores } = await supabaseServices.stores.getByOwner(userData.user.id);
      return stores;
    }
    
    if (endpoint === '/api/stores/all' && options.method === 'GET') {
      const { data: stores } = await supabaseServices.stores.getAll();
      return stores;
    }
    
    if (endpoint.startsWith('/api/stores/slug/')) {
      const slug = endpoint.split('/').pop();
      const { data: store } = await supabaseServices.stores.getBySlug(slug!);
      return store;
    }
    
    if (endpoint.match(/^\/api\/stores\/[^\/]+$/)) {
      const id = endpoint.split('/').pop();
      if (options.method === 'GET') {
        const { data: store } = await supabaseServices.stores.getById(id!);
        return store;
      }
      if (options.method === 'PUT') {
        const data = JSON.parse(options.body);
        const { data: store } = await supabaseServices.stores.update(id!, data);
        return store;
      }
    }
    
    if (endpoint === '/api/stores' && options.method === 'POST') {
      const data = JSON.parse(options.body);
      const { data: store } = await supabaseServices.stores.create(data);
      return store;
    }

    // PRODUCTS
    if (endpoint.match(/^\/api\/products\/store\/[^\/]+/)) {
      const storeId = endpoint.split('/')[4];
      const { data: products } = await supabaseServices.products.getByStore(storeId);
      return products;
    }
    
    if (endpoint.endsWith('/featured') && options.method === 'GET') {
      const storeId = endpoint.split('/')[4];
      const { data: products } = await supabaseServices.products.getFeatured(storeId, 10);
      return products;
    }
    
    if (endpoint.match(/^\/api\/products\/[^\/]+$/)) {
      const id = endpoint.split('/').pop();
      if (options.method === 'GET') {
        const { data: product } = await supabaseServices.products.getById(id!);
        return product;
      }
      if (options.method === 'PUT') {
        const data = JSON.parse(options.body);
        const { data: product } = await supabaseServices.products.update(id!, data);
        return product;
      }
      if (options.method === 'DELETE') {
        await supabaseServices.products.delete(id!);
        return { success: true };
      }
    }
    
    if (endpoint === '/api/products' && options.method === 'POST') {
      const data = JSON.parse(options.body);
      const { data: product } = await supabaseServices.products.create(data);
      return product;
    }

    // CATEGORIES
    if (endpoint.match(/^\/api\/categories\/store\/[^\/]+/)) {
      const storeId = endpoint.split('/')[4];
      const { data: categories } = await supabaseServices.categories.getByStore(storeId);
      return categories;
    }
    
    if (endpoint === '/api/categories' && options.method === 'POST') {
      const data = JSON.parse(options.body);
      const { data: category } = await supabaseServices.categories.create(data);
      return category;
    }

    // ORDERS
    if (endpoint === '/api/orders' && options.method === 'POST') {
      const data = JSON.parse(options.body);
      const { data: order } = await supabaseServices.orders.create(data);
      return order;
    }
    
    if (endpoint.match(/^\/api\/orders\/store\/[^\/]+/)) {
      const storeId = endpoint.split('/')[4];
      const { data: orders } = await supabaseServices.orders.getByStore(storeId);
      return orders;
    }
    
    if (endpoint.match(/^\/api\/orders\/[^\/]+$/)) {
      const id = endpoint.split('/').pop();
      if (options.method === 'GET') {
        const { data: order } = await supabaseServices.orders.getById(id!);
        return order;
      }
      if (options.method === 'PATCH') {
        const { status, estimated_time } = JSON.parse(options.body);
        const { data: order } = await supabaseServices.orders.updateStatus(id!, status, estimated_time);
        return order;
      }
    }

    // Default: tentar usar fetch como fallback
    const url = `${API_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error || 'Erro na requisição',
        code: data.code || 'REQUEST_ERROR'
      };
    }

    return data;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Erro de conexão. Verifique sua conexão com o Supabase.',
      code: 'CONNECTION_ERROR'
    };
  }
}

/**
 * Gerencia requisições para a API mockada
 */
async function handleMockRequest(endpoint: string, options: any) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // Rotear para a função mockada apropriada
  // AUTH
  if (endpoint === '/api/auth/login' && method === 'POST') {
    return mockAPI.auth.login(body.email, body.password);
  }
  if (endpoint === '/api/auth/register' && method === 'POST') {
    return mockAPI.auth.register(body.email, body.password, body.name);
  }
  if (endpoint === '/api/auth/me' && method === 'GET') {
    return mockAPI.auth.getProfile();
  }
  if (endpoint === '/api/auth/profile' && method === 'PUT') {
    return mockAPI.auth.updateProfile(body);
  }
  if (endpoint === '/api/auth/forgot-password' && method === 'POST') {
    return mockAPI.auth.forgotPassword(body.email);
  }
  if (endpoint === '/api/auth/change-password' && method === 'POST') {
    return mockAPI.auth.changePassword(body.user_id, body.password);
  }

  // STORES
  if (endpoint === '/api/stores/my' && method === 'GET') {
    return mockAPI.stores.getAll();
  }
  if (endpoint === '/api/stores/all' && method === 'GET') {
    return mockAPI.stores.getAllStores();
  }
  if (endpoint.startsWith('/api/stores/slug/')) {
    const slug = endpoint.split('/').pop();
    return mockAPI.stores.getBySlug(slug!);
  }
  if (endpoint.match(/^\/api\/stores\/[^\/]+$/)) {
    const id = endpoint.split('/').pop();
    if (method === 'GET') return mockAPI.stores.getById(id!);
    if (method === 'PUT') return mockAPI.stores.update(id!, body);
    if (method === 'DELETE') return mockAPI.stores.deactivate(id!);
  }
  if (endpoint.match(/^\/api\/stores\/[^\/]+\/activate$/) && method === 'PATCH') {
    const id = endpoint.split('/')[4];
    return mockAPI.stores.activate(id!);
  }
  if (endpoint === '/api/stores' && method === 'POST') {
    return mockAPI.stores.create(body);
  }
  if (endpoint.endsWith('/dashboard') && method === 'GET') {
    const id = endpoint.split('/')[3];
    return mockAPI.stores.getDashboard(id);
  }

  // PRODUCTS
  if (endpoint.match(/^\/api\/products\/store\/[^\/]+/)) {
    const parts = endpoint.split('/');
    const storeId = parts[4];
    if (method === 'GET') {
      return mockAPI.products.getByStore(storeId);
    }
  }
  if (endpoint.endsWith('/featured') && method === 'GET') {
    const storeId = endpoint.split('/')[4];
    const limit = parseInt(new URLSearchParams(endpoint.split('?')[1] || '').get('limit') || '10');
    return mockAPI.products.getFeatured(storeId, limit);
  }
  if (endpoint.match(/^\/api\/products\/[^\/]+$/)) {
    const id = endpoint.split('/').pop();
    if (method === 'GET') return mockAPI.products.getById(id!);
    if (method === 'PUT') return mockAPI.products.update(id!, body);
    if (method === 'DELETE') return mockAPI.products.delete(id!);
  }
  if (endpoint === '/api/products' && method === 'POST') {
    return mockAPI.products.create(body);
  }
  if (endpoint.endsWith('/stock') && method === 'PATCH') {
    const id = endpoint.split('/')[3];
    return mockAPI.products.updateStock(id, body.stock);
  }

  // CATEGORIES
  if (endpoint.match(/^\/api\/categories\/store\/[^\/]+/)) {
    const storeId = endpoint.split('/')[4];
    return mockAPI.categories.getByStore(storeId);
  }
  if (endpoint === '/api/categories' && method === 'POST') {
    return mockAPI.categories.create(body);
  }
  if (endpoint.match(/^\/api\/categories\/[^\/]+$/)) {
    const id = endpoint.split('/').pop();
    if (method === 'PUT') return mockAPI.categories.update(id!, body);
    if (method === 'DELETE') return mockAPI.categories.delete(id!);
  }

  // ORDERS
  if (endpoint === '/api/orders' && method === 'POST') {
    return mockAPI.orders.create(body);
  }
  if (endpoint.match(/^\/api\/orders\/store\/[^\/]+/)) {
    const storeId = endpoint.split('/')[4];
    const status = new URLSearchParams(endpoint.split('?')[1] || '').get('status') || undefined;
    return mockAPI.orders.getByStore(storeId, status);
  }
  if (endpoint.match(/^\/api\/orders\/[^\/]+$/)) {
    const id = endpoint.split('/').pop();
    if (method === 'GET') return mockAPI.orders.getById(id!);
    if (method === 'PATCH') return mockAPI.orders.updateStatus(id!, body.status, body.estimated_time);
  }

  // ADDONS
  if (endpoint.match(/^\/api\/addons\/store\/[^\/]+/)) {
    const storeId = endpoint.split('/')[4];
    return mockAPI.addons.getByStore(storeId);
  }
  if (endpoint === '/api/addons' && method === 'POST') {
    return mockAPI.addons.create(body);
  }
  if (endpoint.match(/^\/api\/addons\/[^\/]+$/)) {
    const id = endpoint.split('/').pop();
    if (method === 'PUT') return mockAPI.addons.update(id!, body);
    if (method === 'DELETE') return mockAPI.addons.delete(id!);
  }

  // SUBSCRIPTIONS
  if (endpoint === '/api/subscriptions/plans') {
    return mockAPI.subscriptions.getPlans();
  }
  if (endpoint.match(/^\/api\/subscriptions\/store\/[^\/]+/)) {
    const storeId = endpoint.split('/')[4];
    return mockAPI.subscriptions.getByStore(storeId);
  }
  if (endpoint === '/api/subscriptions/upgrade' && method === 'POST') {
    return mockAPI.subscriptions.upgrade(body.store_id, body.plan_id);
  }

  // ANALYTICS
  if (endpoint.match(/^\/api\/analytics\/dashboard\/[^\/]+/)) {
    const storeId = endpoint.split('/')[4];
    const period = new URLSearchParams(endpoint.split('?')[1] || '').get('period') || '30';
    return mockAPI.analytics.getDashboard(storeId, period);
  }

  // CUSTOMERS
  if (endpoint === '/api/customers/register' && method === 'POST') {
    return mockAPI.customers.register(body);
  }
  if (endpoint === '/api/customers/login' && method === 'POST') {
    return mockAPI.customers.login(body.email, body.password);
  }
  if (endpoint === '/api/customers' && method === 'GET') {
    return mockAPI.customers.getAll();
  }

  // UPLOAD
  if (endpoint === '/api/upload/image' && method === 'POST') {
    return mockAPI.upload.image(options.body);
  }

  throw new Error(`Endpoint mock não implementado: ${endpoint}`);
}

// ==================== AUTH ====================
export const authAPI = {
    login: (email, password) =>
        request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (email, password, name) =>
        request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        }),

    getProfile: () => request('/api/auth/me'),

    updateProfile: (data) =>
        request('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    forgotPassword: (email) =>
        request('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    changePassword: (userId, newPassword) =>
        request('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, password: newPassword }),
        }),
};

// ==================== STORES ====================
export const storesAPI = {
    getAll: (userId?: string, isAdmin?: boolean) => {
        // Se for admin, retorna todas as lojas
        if (isAdmin) {
            return request('/api/stores/all');
        }
        return request('/api/stores/my');
    },

    getAllStores: () => request('/api/stores/all'),

    getBySlug: (slug) => request(`/api/stores/slug/${slug}`),

    getById: (id) => request(`/api/stores/${id}`),

    create: (data) =>
        request('/api/stores', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id, data) =>
        request(`/api/stores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deactivate: (id) =>
        request(`/api/stores/${id}`, {
            method: 'DELETE',
        }),

    activate: (id) =>
        request(`/api/stores/${id}/activate`, {
            method: 'PATCH',
        }),

    delete: (id) =>
        request(`/api/stores/${id}`, {
            method: 'DELETE',
        }),

    getDashboard: (id) => request(`/api/stores/${id}/dashboard`),
};

// ==================== PRODUCTS ====================
export const productsAPI = {
    getByStore: (storeId, filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return request(`/api/products/store/${storeId}${params ? '?' + params : ''}`);
    },
    
    getFeatured: (storeId, limit = 10) => 
        request(`/api/products/store/${storeId}/featured?limit=${limit}`),
    
    getById: (id) => request(`/api/products/${id}`),
    
    create: (data) => 
        request('/api/products', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    
    update: (id, data) => 
        request(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    
    delete: (id) => 
        request(`/api/products/${id}`, {
            method: 'DELETE',
        }),
    
    updateStock: (id, stock) => 
        request(`/api/products/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify({ stock }),
        }),
};

// ==================== CATEGORIES ====================
export const categoriesAPI = {
    getByStore: (storeId) => request(`/api/categories/store/${storeId}`),
    
    create: (data) => 
        request('/api/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    
    update: (id, data) => 
        request(`/api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    
    delete: (id) => 
        request(`/api/categories/${id}`, {
            method: 'DELETE',
        }),
};

// ==================== ORDERS ====================
export const ordersAPI = {
    create: (data) => 
        request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    
    getByStore: (storeId, status) => 
        request(`/api/orders/store/${storeId}${status ? `?status=${status}` : ''}`),
    
    getById: (id) => request(`/api/orders/${id}`),
    
    updateStatus: (id, status, estimated_time) => 
        request(`/api/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, estimated_time }),
        }),
};

// ==================== ADDONS ====================
export const addonsAPI = {
    getByStore: (storeId) => request(`/api/addons/store/${storeId}`),
    
    create: (data) => 
        request('/api/addons', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    
    update: (id, data) => 
        request(`/api/addons/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    
    delete: (id) => 
        request(`/api/addons/${id}`, {
            method: 'DELETE',
        }),
};

// ==================== UPLOAD ====================
export const uploadAPI = {
    image: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        return request(`${API_URL}/api/upload/image`, {
            method: 'POST',
            body: formData,
            headers: {}, // Remove Content-Type para permitir multipart/form-data
        });
    },
};

// ==================== SUBSCRIPTIONS ====================
export const subscriptionsAPI = {
    getPlans: () => request('/api/subscriptions/plans'),
    
    getByStore: (storeId) => request(`/api/subscriptions/store/${storeId}`),
    
    upgrade: (storeId, planId) => 
        request('/api/subscriptions/upgrade', {
            method: 'POST',
            body: JSON.stringify({ store_id: storeId, plan_id: planId }),
        }),
};

// ==================== ANALYTICS ====================
export const analyticsAPI = {
    getDashboard: (storeId, period = '30') =>
        request(`/api/analytics/dashboard/${storeId}?period=${period}`),
};

// ==================== CUSTOMERS ====================
export const customerAPI = {
    register: (data: { name: string; email: string; phone: string; password: string }) =>
        request('/api/customers/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (email: string, password: string) =>
        request('/api/customers/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    getAll: () => request('/api/customers'),
};

export default {
    auth: authAPI,
    stores: storesAPI,
    products: productsAPI,
    categories: categoriesAPI,
    orders: ordersAPI,
    addons: addonsAPI,
    upload: uploadAPI,
    subscriptions: subscriptionsAPI,
    analytics: analyticsAPI,
};
