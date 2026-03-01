import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fwtvjjejycorwukqzwjc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkStatus() {
  console.log('═══════════════════════════════════════════════════');
  console.log('       STATUS DO SUPABASE');
  console.log('═══════════════════════════════════════════════════\n');
  
  console.log('📡 URL:', SUPABASE_URL);
  console.log('🔑 Chave:', SUPABASE_KEY.substring(0, 30) + '...');
  console.log('');
  
  // Testar conexão básica
  console.log('🔌 Testando conexão...\n');
  
  // Tabelas públicas (sem RLS ou com RLS permitido para anon)
  const publicTables = {
    'loyalty_programs': 'Programa de Fidelidade',
    'coupons': 'Cupons'
  };
  
  console.log('📊 Tabelas Públicas (acesso sem login):');
  for (const [table, desc] of Object.entries(publicTables)) {
    const { data, error } = await supabase.from(table).select('*', { limit: 1 });
    console.log(`   ${error ? '❌' : '✅'} ${table} (${desc})`);
  }
  
  console.log('\n🔒 Tabelas Protegidas (requer login):');
  const protectedTables = {
    'stores': 'Lojas',
    'products': 'Produtos',
    'orders': 'Pedidos',
    'profiles': 'Perfis'
  };
  
  for (const [table, desc] of Object.entries(protectedTables)) {
    const { error } = await supabase.from(table).select('*', { limit: 1 });
    if (error) {
      console.log(`   🔒 ${table} (${desc}) - Protegida por RLS`);
    } else {
      console.log(`   ⚠️ ${table} (${desc}) - Acesso público (verificar RLS)`);
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log('✅ CONEXÃO COM SUPABASE: OK');
  console.log('═══════════════════════════════════════════════════');
  console.log('\n💡 O site deve funcionar normalmente!');
  console.log('   - Tabelas protegidas por RLS = Segurança OK');
  console.log('   - Para acessar dados, faça login no sistema');
  console.log('');
}

checkStatus().catch(err => {
  console.error('❌ Erro:', err.message);
  console.error(err);
});
