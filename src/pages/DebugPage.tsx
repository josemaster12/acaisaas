import { useEffect, useState } from 'react';
import { mockAPI } from '@/services/mockApi';

export default function DebugPage() {
    const [debugData, setDebugData] = useState<any>({});

    useEffect(() => {
        loadDebugData();
    }, []);

    const loadDebugData = async () => {
        const users = await mockAPI.auth.login('josetecnico21@gmail.com', 'tenderbr0').catch(() => null);
        const stores = await mockAPI.stores.getAllStores();
        const userStores = await mockAPI.stores.getAll('user-1');

        setDebugData({
            users: mockAPI.auth.constructor.name,
            storesCount: stores.length,
            stores: stores.map((s: any) => ({ id: s.id, name: s.name, owner_id: s.owner_id })),
            userStoresCount: userStores.length,
            localStorage: {
                'mock-users': localStorage.getItem('mock-users') ? 'EXISTS' : 'NOT FOUND',
                'mock-stores': localStorage.getItem('mock-stores') ? 'EXISTS' : 'NOT FOUND',
                'user': localStorage.getItem('user'),
                'token': localStorage.getItem('token'),
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">🔍 Debug Page</h1>

                <div className="grid gap-4">
                    <button
                        onClick={loadDebugData}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Recarregar Dados
                    </button>

                    <pre className="bg-white p-4 rounded shadow overflow-auto text-xs font-mono">
                        {JSON.stringify(debugData, null, 2)}
                    </pre>

                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-bold mb-2">Links Úteis:</h2>
                        <ul className="space-y-2">
                            <li>
                                <a href="/login" className="text-purple-600 hover:underline">
                                    → Ir para Login
                                </a>
                            </li>
                            <li>
                                <a href="/admin" className="text-purple-600 hover:underline">
                                    → Ir para Painel Admin
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        window.location.reload();
                                    }}
                                    className="text-red-600 hover:underline"
                                >
                                    → Limpar localStorage e recarregar
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
