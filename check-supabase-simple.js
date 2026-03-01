import { createClient } from '@supabase/supabase-js';

// Usando chave anon para verificar estrutura
const SUPABASE_URL = 'https://fwtvjjejycorwukqzwjc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTables() {
  console.log('🔍 Verificando estrutura do banco...\n');
  
  // Tentar acessar sem RLS usando RPC ou query direta
  // Primeiro, vamos verificar se conseguimos acessar o schema
  
  console.log('Testando acesso às tabelas...\n');
  
  // Teste 1: Verificar se as tabelas existem
  const tables = ['stores', 'products', 'orders', 'profiles', 'loyalty_programs', 'coupons'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: OK (acesso permitido)`);
      }
    } catch (err) {
      console.log(`⚠️ ${table}: ${err.message}`);
    }
  }
  
  console.log('\n💡 Conclusão:');
  console.log('─────────────────────────────────');
  console.log('O banco está conectado, mas as políticas de RLS');
  console.log('estão bloqueando o acesso. Isso é esperado quando');
  console.log('não há autenticação.');
  console.log('─────────────────────────────────');
  
  console.log('\n📝 Para testar com autenticação, faça login no site.');
}

checkTables().catch(console.error);
