"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AppConsumidorFull() {
  const [activeTab, setActiveTab] = useState('home');
  const [pratos, setPratos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState('');
  
  // Controle do Swipe/Carrinho
  const [carrinhoTotal, setCarrinhoTotal] = useState(0);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);

  useEffect(() => {
    fetchPratos();
  }, []);

  async function fetchPratos() {
    const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    if (!error && data.length > 0) setPratos(data);
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  // --- LÓGICA DO SWIPE E COMPRA ---
  async function handleSwipe(like) {
    const pratoAtual = pratos[currentIndex];
    
    if (like) {
      setCarrinhoTotal(prev => prev + parseFloat(pratoAtual.preco));
      mostrarToast(`♥ ${pratoAtual.nome} adicionado!`);

      // Salva no banco de dados (Gera a demanda para o Restaurante e Motoboy)
      const { data, error } = await supabase.from('orders').insert([{ 
        prato_nome: pratoAtual.nome, preco: pratoAtual.preco, emoji: pratoAtual.emoji, status: 'PREPARANDO'
      }]).select();
      
      if (!error && data) {
        setPedidoAtivo(data[0]); // Define como o pedido rastreado na aba "Pedido"
      }

    } else {
      mostrarToast(`✕ Passou ${pratoAtual.nome}`);
    }

    if (currentIndex < pratos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      mostrarToast('Fim da lista de hoje! 🚀');
    }
  }

  // --- SIMULADOR DA GARANTIA IA ---
  function acionarGarantia() {
    mostrarToast('📸 Analisando foto...');
    setTimeout(() => {
      mostrarToast('✅ Crédito de R$ 15,00 aplicado em 2 min!');
      setPedidoAtivo(null); // Limpa o pedido defeituoso
      setActiveTab('home');
    }, 2500);
  }

  // Renderização Dinâmica das Abas
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Sora', sans-serif" }}>
      
      {/* SEUS ESTILOS ORIGINAIS DO APP DO USUÁRIO */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root{ --bg:#111; --card:#1E1E1E; --card2:#242424; --card3:#2C2C2C; --or:#E8451A; --or-d:rgba(232,69,26,0.12); --or-b:rgba(232,69,26,0.30); --tx:#F4F2EE; --tx2:#A8A49C; --tx3:#5A5852; --gr:#22C55E; --gr-d:rgba(34,197,94,0.10); --bl:#60A5FA; --rd:#EF4444; --bd2:rgba(255,255,255,0.11); }
        .shell{ width:390px; height:844px; background:var(--bg); border-radius:44px; border:1.5px solid rgba(255,255,255,0.12); overflow:hidden; position:relative; box-shadow:0 32px 80px rgba(0,0,0,0.8); display:flex; flex-direction:column; }
        .notch{ width:120px; height:34px; background:#000; border-radius:0 0 20px 20px; position:absolute; top:0; left:50%; transform:translateX(-50%); z-index:200; }
        .topbar{ height:56px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; flex-shrink:0; z-index:99; margin-top:35px; color:var(--tx); }
        .screen{ flex:1; overflow-y:auto; overflow-x:hidden; scrollbar-width:none; padding-bottom:20px; color:var(--tx); }
        .bnav{ height:68px; background:rgba(17,17,17,0.97); border-top:.5px solid var(--bd2); display:flex; align-items:center; justify-content:space-around; padding:0 10px 8px; flex-shrink:0; z-index:99; }
        .bni{ display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; padding:5px; border-radius:10px; transition:.15s; flex:1; }
        .bni.active{ background:var(--or-d); }
        .bni-icon{ font-size:18px; }
        .bni-lbl{ font-size:9px; font-weight:600; color:var(--tx3); }
        .bni.active .bni-lbl{ color:var(--or); }
        .btn-or{ width:100%; background:var(--or); color:#fff; border:none; border-radius:13px; padding:13px; font-size:13px; font-weight:700; cursor:pointer; }
        .card-stack{ position:relative; height:430px; margin:0 20px; }
        .swig{ position:absolute; inset:0; background:var(--card); border-radius:22px; border:1px solid var(--bd2); overflow:hidden; box-shadow:0 16px 48px rgba(0,0,0,0.5); }
      `}} />

      <div className="shell">
        <div className="notch"></div>
        
        {toast && (
          <div style={{ position: 'absolute', top: '90px', left: '50%', transform: 'translateX(-50%)', background: '#22C55E', color: '#000', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', zIndex: 999 }}>
            {toast}
          </div>
        )}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--or)' }}>STIG</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', background: 'var(--or-d)', color: 'var(--or)', padding: '4px 10px', borderRadius: '8px' }}>✨ PRO</div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--or)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>U</div>
          </div>
        </div>

        {/* --- TELA 1: HOME --- */}
        {activeTab === 'home' && (
          <div className="screen" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--tx2)' }}>bom dia, CEO 👋</div>
            <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px', marginBottom: '20px' }}>o que vai ser hoje?</div>

            <div style={{ background: 'var(--card)', borderRadius: '14px', padding: '14px', marginBottom: '15px', border: '1px solid var(--or-b)', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setActiveTab('swipe')}>
              <span style={{ fontSize: '24px' }}>🔥</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Tinder da Comida</div>
                <div style={{ fontSize: '11px', color: 'var(--tx2)' }}>Descubra pratos e dê swipe</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--or)', fontWeight: 'bold' }}>›</span>
            </div>

            <div style={{ background: 'linear-gradient(135deg, var(--gr-d), transparent)', border: '1px solid var(--gr)', borderRadius: '14px', padding: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>💚</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--gr)' }}>Preço de Balcão Garantido</div>
                <div style={{ fontSize: '10px', color: 'var(--tx2)' }}>Você paga o mesmo que no caixa do restaurante.</div>
              </div>
            </div>

            <h3 style={{ fontSize: '12px', color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: '10px' }}>Sugestão da IA 🧠</h3>
            <div style={{ background: 'var(--card)', border: '1px solid var(--bd2)', borderRadius: '14px', padding: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>🍕 Pizza de Sexta?</div>
              <div style={{ fontSize: '11px', color: 'var(--tx2)', marginBottom: '10px' }}>Notamos que você costuma pedir massa hoje.</div>
              <button className="btn-or" onClick={() => setActiveTab('swipe')}>Explorar Massas</button>
            </div>
          </div>
        )}

        {/* --- TELA 2: SWIPE (Conectada ao BD) --- */}
        {activeTab === 'swipe' && (
          <div className="screen">
            <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Descobrir</div>
              <div style={{ fontSize: '12px', color: 'var(--tx2)' }}>🛒 R$ {carrinhoTotal.toFixed(2)}</div>
            </div>

            {pratos.length === 0 || currentIndex >= pratos.length ? (
              <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--tx3)' }}>
                <h3>Fim da linha!</h3>
                <p>O restaurante precisa cadastrar mais pratos.</p>
                <button onClick={() => setCurrentIndex(0)} className="btn-or" style={{ width: 'auto', marginTop: '20px', padding: '10px 20px' }}>Ver de novo</button>
              </div>
            ) : (
              <div>
                <div className="card-stack">
                  <div className="swig">
                    <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', background: 'linear-gradient(135deg, #2a1a0e, #1a1209)' }}>
                      {pratos[currentIndex].emoji}
                    </div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>{pratos[currentIndex].nome}</div>
                      
                      <div style={{ display: 'inline-block', background: 'var(--gr-d)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '5px 10px', color: 'var(--gr)', fontWeight: 'bold' }}>
                        R$ {pratos[currentIndex].preco} (Balcão)
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--tx2)' }}>
                        <span style={{ textDecoration: 'line-through' }}>R$ {(pratos[currentIndex].preco * 1.22).toFixed(2)} no app vizinho</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                  <button onClick={() => handleSwipe(false)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: 'var(--rd)', border: '2px solid rgba(239,68,68,0.3)', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                  <button onClick={() => handleSwipe(true)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gr-d)', color: 'var(--gr)', border: '2px solid rgba(34,197,94,0.3)', fontSize: '24px', cursor: 'pointer' }}>♥</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TELA 3: PEDIDO (Tracking & Garantia IA) --- */}
        {activeTab === 'pedido' && (
          <div className="screen">
            {!pedidoAtivo ? (
              <div style={{ textAlign: 'center', marginTop: '150px', color: 'var(--tx3)' }}>
                <span style={{ fontSize: '50px' }}>🛵</span>
                <h3 style={{ marginTop: '10px', color: 'var(--tx)' }}>Nenhum pedido ativo</h3>
                <p style={{ fontSize: '12px', marginTop: '5px' }}>Dê swipe em um prato para fazer um pedido.</p>
              </div>
            ) : (
              <div style={{ padding: '20px' }}>
                <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '20px', border: '1px solid var(--bd2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '15px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--or)', fontWeight: 'bold' }}>{pedidoAtivo.status}</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{pedidoAtivo.emoji} {pedidoAtivo.prato_nome}</div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gr)' }}>R$ {pedidoAtivo.preco}</div>
                  </div>

                  <div style={{ background: 'var(--gr-d)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: 'var(--gr)', fontWeight: 'bold', marginBottom: '20px' }}>
                    🏍️ Frete de R$ 8,50 vai 100% para o motoboy.
                  </div>

                  <h4 style={{ fontSize: '12px', color: 'var(--tx3)', marginBottom: '10px' }}>Algo deu errado?</h4>
                  <button onClick={acionarGarantia} style={{ width: '100%', padding: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--rd)', border: '1px dashed var(--rd)', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📸 Acionar Garantia IA (2 min)
                  </button>
                  <p style={{ fontSize: '10px', color: 'var(--tx3)', textAlign: 'center', marginTop: '5px' }}>Tire uma foto se chegou frio ou errado e a IA estorna na hora.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- BOTTOM NAV DO USUÁRIO --- */}
        <div className="bnav">
          <div className={`bni ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <div className="bni-icon">🏠</div><div className="bni-lbl">início</div>
          </div>
          <div className={`bni ${activeTab === 'swipe' ? 'active' : ''}`} onClick={() => setActiveTab('swipe')}>
            <div className="bni-icon">🔥</div><div className="bni-lbl">descobrir</div>
          </div>
          <div className={`bni ${activeTab === 'pedido' ? 'active' : ''}`} onClick={() => setActiveTab('pedido')}>
            <div className="bni-icon">🛵</div><div className="bni-lbl">pedido</div>
          </div>
        </div>

      </div>
    </div>
  );
}
