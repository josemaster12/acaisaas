import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fwtvjjejycorwukqzwjc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyProfiles() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   VERIFICANDO PERFIS CRIADOS');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Buscar perfis recentes (admin access)
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('❌ Erro:', error.message);
  } else {
    console.log('✅ Perfis encontrados:', profiles?.length || 0);
    console.log('');
    profiles?.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (${p.email})`);
      console.log(`   Role: ${p.role}`);
      console.log(`   Criado: ${p.created_at}`);
      console.log('');
    });
  }
  
  // Verificar configurações de auth
  console.log('═══════════════════════════════════════════════════');
  console.log('   CONFIGURAÇÃO DE EMAIL CONFIRMATION');
  console.log('═══════════════════════════════════════════════════\n');
  console.log('⚠️  O Supabase está exigindo confirmação de email.');
  console.log('');
  console.log('Para permitir login sem confirmação (desenvolvimento):');
  console.log('1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings');
  console.log('2. Em "Email Settings", desmarque "Enable email confirmations"');
  console.log('3. Ou use "Enable double opt-in" apenas para produção\n');
  console.log('═══════════════════════════════════════════════════\n');
}

verifyProfiles().catch(console.error);
