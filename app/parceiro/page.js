"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AppParceiroCompleto() {
  const [activeTab, setActiveTab] = useState('dash');
  const [menuItems, setMenuItems] = useState([]);
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [emoji, setEmoji] = useState('🍔');

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    if (!error) setMenuItems(data);
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

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Sora', sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg:#0A0A0A; --bg2:#121212; --card:#181818; --card2:#1E1E1E; --card3:#252525;
          --or:#E8451A; --or-d:rgba(232,69,26,0.12); --or-b:rgba(232,69,26,0.28);
          --tx:#F4F2EE; --tx2:#A8A49C; --tx3:#5A5852; --gr:#22C55E; --rd:#EF4444;
          --bd:rgba(255,255,255,0.06); --bd2:rgba(255,255,255,0.11);
        }
        .shell { width:390px; height:844px; background:var(--bg2); border-radius:44px; border:1.5px solid rgba(255,255,255,0.12); overflow:hidden; position:relative; box-shadow:0 32px 80px rgba(0,0,0,0.8); }
        .notch { width:120px; height:34px; background:#000; border-radius:0 0 20px 20px; position:absolute; top:0; left:50%; transform:translateX(-50%); z-index:100; }
        .stbar { position:absolute; top:0; left:0; right:0; height:50px; padding:14px 24px 0; display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:600; z-index:99; color: var(--tx); }
        .screen { position:absolute; inset:0; overflow-y:auto; overflow-x:hidden; padding-bottom:80px; scrollbar-width:none; color: var(--tx); }
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
        .menu-item { background:var(--card); border:.5px solid var(--bd2); border-radius:14px; margin:0 20px 10px; padding:12px 14px; display:flex; align-items:center; gap:12px; }
        .form-input { width:100%; background:var(--card2); border:.5px solid var(--bd2); border-radius:12px; color:var(--tx); padding:12px 14px; font-size:14px; outline:none; margin-bottom:10px; }
        .btn-or { background:var(--or); color:#fff; border:none; border-radius:10px; padding:8px 16px; font-size:12px; font-weight:700; cursor:pointer; }
      `}} />

      <div className="shell">
        <div className="notch"></div>
        <div className="stbar"><span>9:41</span><span>●●● 98%🔋</span></div>

        {activeTab === 'dash' && (
          <div className="screen">
            <div className="page-hdr">
              <div>
                <div className="page-title">Dashboard</div>
                <div className="page-sub">Hoje, Operação Normal</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--gr)', fontWeight: '600' }}>● aberto</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 20px' }}>
              <div className="stat-box">
                <div className="stat-label">pedidos hoje</div>
                <div className="stat-val">12</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">faturamento</div>
                <div className="stat-val" style={{ color: 'var(--gr)' }}>R$ 480</div>
              </div>
              <div className="stat-box" style={{ gridColumn: 'span 2' }}>
                <div className="stat-label">economia vs concorrência</div>
                <div className="stat-val" style={{ color: 'var(--or)' }}>R$ 72,00</div>
                <div style={{ fontSize: '10px', color: 'var(--tx2)', marginTop: '2px' }}>comissão 15% evitada</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="screen">
             <div className="page-hdr">
              <div><div className="page-title">Pedidos Ativos</div><div className="page-sub">Acompanhe a cozinha</div></div>
            </div>
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tx3)' }}>
              Nenhum pedido na fila no momento.
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="screen">
            <div className="page-hdr">
              <div><div className="page-title">Cardápio Real</div><div className="page-sub">{menuItems.length} itens no banco</div></div>
            </div>

            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--card)', border: '.5px solid var(--or-b)', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--or)', fontWeight: '700', marginBottom: '10px' }}>+ NOVO PRATO</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome (Ex: Pizza)" />
                  <input className="form-input" value={emoji} onChange={e=>setEmoji(e.target.value)} placeholder="🍕" style={{ width: '60px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input className="form-input" value={preco} onChange={e=>setPreco(e.target.value)} type="number" placeholder="Preço R$" style={{ marginBottom: 0 }} />
                  <button className="btn-or" onClick={addItem} style={{ width: '100%' }}>Salvar BD</button>
                </div>
              </div>
            </div>

            {menuItems.map(item => (
              <div className="menu-item" key={item.id}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--card3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{item.nome}</div>
                  <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>Ativo no App</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--or)' }}>R${item.preco}</div>
                <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--rd)', fontSize: '16px', cursor: 'pointer' }}>🗑️</button>
              </div>
            ))}
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
            <div className="bni-icon">🍽️</div><div className="bni-label">cardápio BD</div>
          </div>
        </div>

      </div>
    </div>
  );
}
