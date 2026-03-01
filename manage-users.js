import fetch from 'node-fetch';

// =====================================================
// SCRIPT PARA CONFIRMAR USUÁRIOS E DESABILITAR EMAIL
// =====================================================
// Requer: SUPABASE_SERVICE_ROLE_KEY
// =====================================================

const SUPABASE_URL = 'https://fwtvjjejycorwukqzwjc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function manageUsers() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   GERENCIAR USUÁRIOS - SUPABASE');
  console.log('═══════════════════════════════════════════════════\n');
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('❌ Faltando SUPABASE_SERVICE_ROLE_KEY\n');
    console.log('Obtenha em: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/settings/api\n');
    console.log('Execute assim:\n');
    console.log('  Windows PowerShell:');
    console.log('  $env:SUPABASE_SERVICE_ROLE_KEY="sua_chave"; node manage-users.js\n');
    console.log('  Windows CMD:');
    console.log('  set SUPABASE_SERVICE_ROLE_KEY=sua_chave && node manage-users.js\n');
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Content-Type': 'application/json'
  };
  
  try {
    // 1. Listar usuários
    console.log('📋 Listando usuários...\n');
    const usersResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers
    });
    
    if (!usersResponse.ok) {
      throw new Error(`Erro: ${usersResponse.status}`);
    }
    
    const usersData = await usersResponse.json();
    const users = usersData.users || [];
    
    console.log(`Total de usuários: ${users.length}\n`);
    
    const unconfirmed = users.filter(u => !u.email_confirmed_at);
    const confirmed = users.filter(u => u.email_confirmed_at);
    
    console.log(`✅ Confirmados: ${confirmed.length}`);
    console.log(`⏳ Pendentes: ${unconfirmed.length}\n`);
    
    if (unconfirmed.length > 0) {
      console.log('Usuários pendentes:');
      unconfirmed.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.email} (criado em: ${new Date(u.created_at).toLocaleString('pt-BR')})`);
      });
      console.log('');
      
      // 2. Confirmar usuários pendentes
      console.log('🔧 Confirmando usuários pendentes...\n');
      
      for (const user of unconfirmed) {
        try {
          const confirmResponse = await fetch(
            `${SUPABASE_URL}/auth/v1/admin/users/${user.id}/factor`,
            {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                factor_type: 'email',
                status: 'verified'
              })
            }
          );
          
          if (confirmResponse.ok) {
            console.log(`  ✅ ${u.email}`);
          } else {
            console.log(`  ⚠️ ${u.email} - Erro ao confirmar`);
          }
        } catch (err) {
          console.log(`  ❌ ${u.email} - ${err.message}`);
        }
      }
      
      console.log('');
    }
    
    // 3. Instruções para desabilitar email confirmation
    console.log('═══════════════════════════════════════════════════');
    console.log('   DESABILITAR EMAIL CONFIRMATION');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('⚠️  A API não permite desabilitar email confirmation.\n');
    console.log('Faça manualmente no dashboard:\n');
    console.log('1. Acesse:');
    console.log('   https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings\n');
    console.log('2. Role até "Email Settings"\n');
    console.log('3. Desmarque: "Enable email confirmations"\n');
    console.log('4. Clique em "Save"\n');
    console.log('═══════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

manageUsers().catch(console.error);
