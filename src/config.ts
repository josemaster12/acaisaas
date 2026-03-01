/**
 * Configuração do Modo de Desenvolvimento
 *
 * USE_MOCK_API:
 * - true: Usa dados mockados (sem backend)
 * - false: Usa API real (backend necessário)
 * 
 * Nota: A variável de ambiente VITE_USE_MOCK tem prioridade
 */

export const DEVELOPMENT_CONFIG = {
  // Usa variável de ambiente se existir, senão usa false (produção)
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK === 'true',

  // Dados de login mockados para testes
  MOCK_CREDENTIALS: {
    email: 'admin@prontoacai.com',
    password: '123456',
  },

  // Mensagem exibida no modo mock
  MOCK_MESSAGE: '🧪 Modo Mock: Usando dados de desenvolvimento',
};
