import { createClient } from '@supabase/supabase-js';

// Configurações do .env
const SUPABASE_URL = 'https://fwtvjjejycorwukqzwjc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDatabase() {
  console.log('🔍 Verificando conexão com Supabase...\n');
  
  // Testar conexão listando tabelas
  console.log('📋 Verificando tabelas...\n');
  
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('*')
    .limit(5);
  
  if (storesError) {
    console.error('❌ Erro ao buscar stores:', storesError.message);
  } else {
    console.log('✅ Tabela stores:', stores?.length || 0, 'registro(s)');
    if (stores?.length > 0) {
      console.log('   Primeiras lojas:', stores.map(s => s.name));
    }
  }
  
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .limit(5);
  
  if (productsError) {
    console.error('❌ Erro ao buscar products:', productsError.message);
  } else {
    console.log('✅ Tabela products:', products?.length || 0, 'registro(s)');
  }
  
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .limit(5);
  
  if (ordersError) {
    console.error('❌ Erro ao buscar orders:', ordersError.message);
  } else {
    console.log('✅ Tabela orders:', orders?.length || 0, 'registro(s)');
  }
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
  
  if (profilesError) {
    console.error('❌ Erro ao buscar profiles:', profilesError.message);
  } else {
    console.log('✅ Tabela profiles:', profiles?.length || 0, 'registro(s)');
  }
  
  console.log('\n📊 Resumo:');
  console.log('─────────────────────────────────');
  console.log('Stores:', stores?.length || 0);
  console.log('Products:', products?.length || 0);
  console.log('Orders:', orders?.length || 0);
  console.log('Profiles:', profiles?.length || 0);
  console.log('─────────────────────────────────');
}

checkDatabase().catch(console.error);
