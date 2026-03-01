import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.fuqyqzmopvkuopoqjkqq:ProntoAcai2024@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
    ssl: false,
});

try {
    console.log('Tentando conectar...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Conectado! Hora:', result.rows[0].now);
    client.release();
} catch (err) {
    console.error('❌ Erro:', err.message);
}

await pool.end();
