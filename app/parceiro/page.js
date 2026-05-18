"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AppParceiroDefinitivo() {
  const [activeTab, setActiveTab] = useState('dash');
  const [menuItems, setMenuItems] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [emoji, setEmoji] = useState('🍔');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetchMenu();
    fetchPedidos();
  }, []);

  async function fetchMenu() {
    const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    if (!error) setMenuItems(data);
  }

  async function fetchPedidos() {
    const { data, error } = await supabase.from('orders').select('*').in('status', ['PREPARANDO', 'PRONTO']).order('created_at', { ascending: false });
    if (!error) setPedidos(data);
  }

  async function addItem() {
    if (!nome || !preco) return alert('Preencha o nome e o preço!');
    const { error } = await supabase.from('menu_items').insert([{ nome, preco: parseFloat(preco), emoji }]);
    if (!error) {
      setNome(''); setPreco(''); fetchMenu();
      alert('Prato adicionado com sucesso!');
    }
  }

  async function deleteItem(id) {
    await supabase.from('menu_items').delete().eq('id', id);
    fetchMenu();
  }

  async function avancaPedido(id, statusAtual) {
    const novoStatus = statusAtual === 'PREPARANDO' ? 'PRONTO' : 'EM_ROTA';
    await supabase.from('orders').update({ status: novoStatus }).eq('id', id);
    fetchPedidos();
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Sora', sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg:#0A0A0A; --bg2:#121212; --card:#181818; --card2:#1E1E1E; --card3:#252525;
          --or:#E8451A; --or-d:rgba(232,69,26,0.12); --or-b:rgba(232,69,26,0.28);
          --tx:#F4F2EE; --tx2:#A8A49C; --tx3:#5A5852; --gr:#22C55E; --bl:#60A5FA; --rd:#EF4444;
          --bd:rgba(255,255,255,0.06); --bd2:rgba(255,255,255,0.11);
        }
        .shell { width:390px; height:844px; background:var(--bg2); border-radius:44px; border:1.5px solid rgba(255,255,255,0.12); overflow:hidden; position:relative; box-shadow:0 32px 80px rgba(0,0,0,0.8); }
        .notch { width:120px; height:34px; background:#000; border-radius:0 0 20px 20px; position:absolute; top:0; left:50%; transform:translateX(-50%); z-index:100; }
        .stbar { position:absolute; top:0; left:0; right:0; height:50px; padding:14px 24px 0; display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:600; z-index:99; color: var(--tx); }
        .screen { position:absolute; inset:0; overflow-y:auto; overflow-x:hidden; padding-bottom:90px; scrollbar-width:none; color: var(--tx); }
        .bnav { position:absolute; bottom:0; left:0; right:0; height:80px; background:rgba(18,18,18,0.96); backdrop-filter:blur(20px); border-top:.5px solid var(--bd2); display:flex; align-items:center; justify-content:space-around; padding:0 8px 16px; z-index:98; }
        .bni { display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; padding:8px 16px; border-radius:12px; transition:.15s; }
        .bni.active { background:var(--or-d); }
        .bni-icon { font-size:20px; }
        .bni-label { font-size:9px; font-weight:600; color:var(--tx3); }
        .bni.active .bni-label { color:var(--or); }
        .page-hdr { padding:56px 20px 16px; display:flex; justify-content:space-between; align-items:flex-end; }
        .page-title { font-size:20px; font-weight:800; }
        .page-sub { font-size:12px; color:var(--tx2); margin-top:2px; }
        .stat-box { background:var(--card); border:.5px solid var(--bd2); border-radius:16px; padding:14px; }
        .stat-label { font-size:9px; color:var(--tx3); font-weight:600; text-transform:uppercase; margin-bottom:5px; }
        .stat-val { font-size:22px; font-weight:800; }
        .form-input { width:100%; background:var(--card); border:.5px solid var(--bd2); border-radius:12px; color:var(--tx); padding:12px 14px; font-size:14px; outline:none; margin-bottom:10px; }
        .btn-or { background:var(--or); color:#fff; border:none; border-radius:12px; padding:12px; font-size:13px; font-weight:700; cursor:pointer; width:100%; }
        .toggle { width:44px; height:24px; border-radius:12px; position:relative; cursor:pointer; transition:.25s; flex-shrink:0; }
        .toggle.on { background:var(--or); }
        .toggle.off { background:var(--card3); }
        .toggle::after { content:''; position:absolute; width:18px; height:18px; background:#fff; border-radius:50%; top:3px; transition:.25s; }
        .toggle.on::after { right:3px; }
        .toggle.off::after { left:3px; }
      `}} />

      <div className="shell">
        <div className="notch"></div>
        <div className="stbar"><span>9:41</span><span>●●● 98%🔋</span></div>

        {activeTab === 'dash' && (
          <div className="screen">
            <div className="page-hdr">
              <div>
                <div className="page-title">Dashboard</div>
                <div className="page-sub">terça, 28 abr 2026</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: isOpen ? 'var(--gr)' : 'var(--tx3)', fontWeight: '600' }}>
                  {isOpen ? '● aberto' : '○ fechado'}
                </span>
                <div className={`toggle ${isOpen ? 'on' : 'off'}`} onClick={() => setIsOpen(!isOpen)}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 20px', marginBottom: '16px' }}>
              <div className="stat-box">
                <div className="stat-label">pedidos hoje</div>
                <div className="stat-val">{pedidos.length}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">faturamento</div>
                <div className="stat-val" style={{ color: 'var(--gr)' }}>
                  R$ {pedidos.reduce((acc, curr) => acc + parseFloat(curr.preco), 0).toFixed(2)}
                </div>
              </div>
              <div className="stat-box" style={{ gridColumn: 'span 2' }}>
                <div className="stat-label">economia vs iFood (15%)</div>
                <div className="stat-val" style={{ color: 'var(--or)' }}>
                  R$ {(pedidos.reduce((acc, curr) => acc + parseFloat(curr.preco), 0) * 0.15).toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--tx2)', marginTop: '2px' }}>comissão evitada no Stig</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="screen">
            <div className="page-hdr">
              <div>
                <div className="page-title">Pedidos Ativos</div>
                <div className="page-sub">{pedidos.length} na cozinha</div>
              </div>
              <button onClick={fetchPedidos} style={{ background: 'var(--card3)', color: 'var(--tx)', border: '1px solid var(--bd2)', borderRadius: '8px', padding: '6px 12px', fontSize: '10px', cursor: 'pointer' }}>↻ atualizar</button>
            </div>
            
            <div style={{ padding: '0 20px' }}>
              {pedidos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--tx3)' }}>Nenhum pedido no momento.</div>
              ) : (
                pedidos.map(p => (
                  <div key={p.id} style={{ background: 'var(--card)', border: '1px solid var(--bd2)', borderRadius: '16px', padding: '14px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700' }}>{p.emoji} {p.prato_nome}</div>
                      <div style={{ fontSize: '9px', fontWeight: '700', padding: '3px 9px', borderRadius: '8px', background: p.status === 'PREPARANDO' ? 'var(--or-d)' : 'var(--gr-d)', color: p.status === 'PREPARANDO' ? 'var(--or)' : 'var(--gr)' }}>
                        {p.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--gr)' }}>R$ {p.preco}</div>
                      <button onClick={() => avancaPedido(p.id, p.status)} style={{ background: 'var(--tx)', color: '#000', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
                        {p.status === 'PREPARANDO' ? 'Marcar como PRONTO' : 'Despachar 🛵'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="screen">
            <div className="page-hdr">
              <div>
                <div className="page-title">Cardápio</div>
                <div className="page-sub">{menuItems.length} itens ativos</div>
              </div>
            </div>

            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--card2)', border: '1px solid var(--bd2)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', fontWeight: '600', marginBottom: '10px' }}>ADICIONAR NOVO PRATO</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome do prato" />
                  <input className="form-input" value={emoji} onChange={e=>setEmoji(e.target.value)} placeholder="🍕" style={{ width: '60px', textAlign: 'center' }} />
                </div>
                <input className="form-input" value={preco} onChange={e=>setPreco(e.target.value)} type="number" placeholder="Preço (Ex: 42.50)" />
                <button className="btn-or" onClick={addItem}>+ Adicionar ao Banco</button>
              </div>
            </div>

            <div style={{ padding: '0 20px' }}>
              {menuItems.map(item => (
                <div key={item.id} style={{ background: 'var(--card)', border: '1px solid var(--bd2)', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--card3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{item.nome}</div>
                    <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>Preço Balcão</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--or)' }}>R${item.preco}</div>
                  <button onClick={() => deleteItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bnav">
          <div className={`bni ${activeTab === 'dash' ? 'active' : ''}`} onClick={() => setActiveTab('dash')}>
            <div className="bni-icon">📊</div><div className="bni-label">dashboard</div>
          </div>
          <div className={`bni ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}>
            <div className="bni-icon">🧾</div><div className="bni-label">pedidos</div>
          </div>
          <div className={`bni ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
            <div className="bni-icon">🍽️</div><div className="bni-label">cardápio</div>
          </div>
        </div>

      </div>
    </div>
  );
}
