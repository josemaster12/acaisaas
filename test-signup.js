import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fwtvjjejycorwukqzwjc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSignup() {
  console.log('🧪 Testando cadastro no Supabase...\n');
  
  const testEmail = `test_${Date.now()}@test.com`;
  const testPassword = 'Teste123!';
  const testName = 'Usuario Teste';
  
  console.log('📝 Tentando cadastrar:');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Nome: ${testName}`);
  console.log('');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          role: 'owner'
        }
      }
    });
    
    if (error) {
      console.error('❌ Erro no cadastro:', error.message);
      return;
    }
    
    console.log('✅ Cadastro realizado com sucesso!');
    console.log('   User ID:', data.user?.id);
    console.log('   Email:', data.user?.email);
    console.log('   Metadata:', data.user?.user_metadata);
    
    // Aguardar um pouco para o trigger executar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar se o perfil foi criado
    console.log('\n📋 Verificando perfil...');
    
    // Usar session para autenticar
    if (data.session?.access_token) {
      const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_KEY, {
        global: {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`
          }
        }
      });
      
      const { data: profile, error: profileError } = await supabaseAuth
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError.message);
      } else {
        console.log('✅ Perfil criado:');
        console.log('   Nome:', profile?.name);
        console.log('   Role:', profile?.role);
        console.log('   Email:', profile?.email);
      }
    }
    
    console.log('\n═══════════════════════════════════════════');
    console.log('Teste concluído!');
    console.log('═══════════════════════════════════════════');
    
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

testSignup().catch(console.error);
