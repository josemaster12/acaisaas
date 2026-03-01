import fetch from 'node-fetch';

// =====================================================
// SCRIPT PARA DESABILITAR EMAIL CONFIRMATION
// =====================================================
// Este script usa a API do Supabase para desabilitar
// a confirmação automática de email
// =====================================================

// Configurações
const SUPABASE_URL = 'https://fwtvjjejycorwukqzwjc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT';

// Para acessar a API de autenticação, precisamos da chave de serviço
// Você pode encontrar em: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/settings/api
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function disableEmailConfirmation() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   DESABILITAR EMAIL CONFIRMATION - SUPABASE');
  console.log('═══════════════════════════════════════════════════\n');
  
  console.log('Projeto:', SUPABASE_URL);
  console.log('');
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY não encontrada!\n');
    console.log('Para obter a chave de serviço:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/settings/api');
    console.log('2. Copie a "service_role" key (não a anon/public key)');
    console.log('3. Execute o script com a variável de ambiente:\n');
    console.log('   Windows (PowerShell):');
    console.log('   $env:SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"; node disable-email-confirmation.js\n');
    console.log('   Windows (CMD):');
    console.log('   set SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui && node disable-email-confirmation.js\n');
    console.log('   Linux/Mac:');
    console.log('   SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui" node disable-email-confirmation.js\n');
    console.log('═══════════════════════════════════════════════════\n');
    return;
  }
  
  try {
    // Fazer request para API do Supabase Auth
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const settings = await response.json();
    console.log('✅ Configurações atuais:');
    console.log(JSON.stringify(settings, null, 2));
    console.log('');
    
    // Verificar se email confirmation está habilitado
    if (settings.enable_email_confirmations) {
      console.log('⚠️  Email confirmation está HABILITADO');
      console.log('');
      console.log('Para desabilitar, execute este SQL no Supabase SQL Editor:');
      console.log('');
      console.log('─'.repeat(60));
      console.log('SELECT auth.email(); -- Verifica status atual');
      console.log('');
      console.log('-- OU acesse o dashboard:');
      console.log('-- https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings');
      console.log('─'.repeat(60));
      console.log('');
    } else {
      console.log('✅ Email confirmation já está DESABILITADO!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('');
    console.log('Alternativa: Execute este SQL no Supabase SQL Editor:');
    console.log('');
    console.log('─'.repeat(60));
    console.log('-- Desabilitar confirmação de email via SQL');
    console.log("SELECT auth.set_config('enable_email_confirmations', 'false', true);");
    console.log('');
    console.log('-- Ou simplesmente desabilite no dashboard:');
    console.log('-- https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings');
    console.log('─'.repeat(60));
  }
  
  console.log('\n═══════════════════════════════════════════════════\n');
}

disableEmailConfirmation().catch(console.error);
