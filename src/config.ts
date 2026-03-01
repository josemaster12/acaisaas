/**
 * Configuração do Modo de Desenvolvimento
 * 
 * USE_MOCK_API: 
 * - true: Usa dados mockados (sem backend)
 * - false: Usa API real (backend necessário)
 */

export const DEVELOPMENT_CONFIG = {
  USE_MOCK_API: true,
  
  // Dados de login mockados para testes
  MOCK_CREDENTIALS: {
    email: 'admin@prontoacai.com',
    password: '123456',
  },
  
  // Mensagem exibida no modo mock
  MOCK_MESSAGE: '🧪 Modo Mock: Usando dados de desenvolvimento',
};
