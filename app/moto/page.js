"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AppMoto() {
  const [pedidosAtivos, setPedidosAtivos] = useState([]);
  const [saldo, setSaldo] = useState(0.00);

  // Busca pedidos que estão 'PRONTOS' ou 'EM_ROTA'
  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['PREPARANDO', 'PRONTO', 'EM_ROTA']) // Traz pedidos ativos
      .order('created_at', { ascending: false });
      
    if (!error) setPedidosAtivos(data);
  }

  // Função para simular a mudança de status do pedido
  async function atualizarStatus(id, novoStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: novoStatus })
      .eq('id', id);

    if (!error) {
      fetchPedidos();
      if (novoStatus === 'ENTREGUE') {
        alert('🎉 Entrega Finalizada! O valor do frete foi pro seu Pix.');
        setSaldo(prev => prev + 8.50); // Simulando frete de R$8,50 100% repassado
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Sora', sans-serif" }}>
      
      <div style={shellStyle}>
        <div style={{ padding: '56px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800' }}>Stig Moto</div>
            <div style={{ fontSize: '12px', color: '#A8A49C' }}>Modo PRO Ativo</div>
          </div>
          <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 'bold' }}>● online</div>
        </div>

        {/* SALDO (GAMIFICAÇÃO DE REPASSE IMEDIATO) */}
        <div style={{ margin: '15px 20px', padding: '20px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px' }}>
          <div style={{ fontSize: '11px', color: '#22C55E', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Saldo do Frete (100% seu)</div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: '#22C55E' }}>R$ {saldo.toFixed(2)}</div>
          {saldo > 0 && (
             <button style={{ width: '100%', marginTop: '15px', padding: '12px', borderRadius: '10px', backgroundColor: '#22C55E', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
               ⚡ Sacar via Pix Agora
             </button>
          )}
        </div>

        <h3 style={{ padding: '0 20px', color: '#A8A49C', fontSize: '14px', marginBottom: '10px' }}>Pedidos Próximos</h3>

        {/* LISTA DE PEDIDOS QUE CAEM NA TELA */}
        <div style={{ padding: '0 20px', overflowY: 'auto', height: '350px' }}>
          {pedidosAtivos.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#5A5852', marginTop: '40px' }}>Nenhum pedido na região. Aguarde...</div>
          ) : (
            pedidosAtivos.map(pedido => (
              <div key={pedido.id} style={{ backgroundColor: '#181818', border: '1px solid #333', borderRadius: '14px', padding: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{pedido.emoji} {pedido.prato_nome}</div>
                  <div style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', 
                        backgroundColor: pedido.status === 'PREPARANDO' ? 'rgba(251,191,36,0.2)' : 'rgba(96,165,250,0.2)', 
                        color: pedido.status === 'PREPARANDO' ? '#FBBF24' : '#60A5FA' }}>
                    {pedido.status}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {pedido.status === 'PREPARANDO' && (
                    <button onClick={() => atualizarStatus(pedido.id, 'EM_ROTA')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#60A5FA', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                      🛵 Coletar Pedido
                    </button>
                  )}
                  {pedido.status === 'EM_ROTA' && (
                    <button onClick={() => atualizarStatus(pedido.id, 'ENTREGUE')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#E8451A', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                      ✅ Confirmar Entrega
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* BOTÃO PARA REFRESH (Para não precisar configurar WebSocket agora) */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button onClick={fetchPedidos} style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#A8A49C', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>
              ↻ Atualizar Radar
            </button>
        </div>

      </div>
    </div>
  );
}

const shellStyle = { width: '390px', height: '844px', background: '#121212', borderRadius: '44px', border: '1.5px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' };
