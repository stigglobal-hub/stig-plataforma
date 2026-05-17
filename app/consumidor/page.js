"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AppConsumidor() {
  const [pratos, setPratos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carrinho, setCarrinho] = useState([]);
  const [toast, setToast] = useState('');

  // Busca os pratos cadastrados pelos restaurantes no Supabase
  useEffect(() => {
    async function fetchPratos() {
      const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
      if (!error && data.length > 0) {
        setPratos(data);
      }
    }
    fetchPratos();
  }, []);

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleSwipe(like) {
    const pratoAtual = pratos[currentIndex];
    
    if (like) {
      setCarrinho([...carrinho, pratoAtual]);
      mostrarToast(`♥ Match! ${pratoAtual.nome} no carrinho!`);
    } else {
      mostrarToast(`✕ Passou ${pratoAtual.nome}`);
    }

    // Passa para o próximo prato
    if (currentIndex < pratos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      mostrarToast('Você viu todos os pratos de hoje! 🚀');
    }
  }

  // Se o banco estiver vazio
  if (pratos.length === 0) {
    return (
      <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: "'Sora', sans-serif" }}>
        <div style={shellStyle}>
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#A8A49C', marginTop: '50%' }}>
            <h2>Nenhum prato disponível</h2>
            <p style={{ marginTop: '10px' }}>Cadastre um prato no painel do restaurante primeiro!</p>
          </div>
        </div>
      </div>
    );
  }

  const prato = pratos[currentIndex];
  // Simulando o preço do concorrente (22% a mais)
  const precoIfood = (prato.preco * 1.22).toFixed(2);
  const economia = (precoIfood - prato.preco).toFixed(2);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Sora', sans-serif" }}>
      
      <div style={shellStyle}>
        
        {/* TOAST NOTIFICATION */}
        {toast && (
          <div style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', background: '#22C55E', color: '#000', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', zIndex: 999, whiteSpace: 'nowrap' }}>
            {toast}
          </div>
        )}

        <div style={{ padding: '56px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <div style={{ fontSize: '17px', fontWeight: '800' }}>Descobrir (Swipe)</div>
          <div style={{ fontSize: '11px', color: '#A8A49C' }}>🛒 {carrinho.length} itens (R$ {carrinho.reduce((a, b) => a + parseFloat(b.preco), 0).toFixed(2)})</div>
        </div>

        {/* CARTÃO DE COMIDA (TINDER) */}
        <div style={{ margin: '0 20px', position: 'relative', height: '480px' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#1E1E1E', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.11)', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
            
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', background: 'linear-gradient(135deg, #2a1a0e, #1a1209)' }}>
              {prato.emoji}
              <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(0,0,0,.65)', color: '#E8451A', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px' }}>
                98% match
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{prato.nome}</div>
              
              {/* COMPARATIVO DE PREÇO (O CORAÇÃO DO SEU NEGÓCIO) */}
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', padding: '6px 12px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: '#22C55E' }}>R$ {parseFloat(prato.preco).toFixed(2)}</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#22C55E', textTransform: 'uppercase' }}>preço balcão</span>
                </div>
                
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#A8A49C' }}>
                  <span style={{ textDecoration: 'line-through' }}>R$ {precoIfood} no iFood</span>
                  <span style={{ marginLeft: '10px', color: '#E8451A', fontWeight: '700' }}>Você economiza R$ {economia}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTÕES DE SWIPE */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px', padding: '0 20px' }}>
          <button onClick={() => handleSwipe(false)} style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '2px solid rgba(239,68,68,0.3)' }}>✕</button>
          
          <button onClick={() => handleSwipe(true)} style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '2px solid rgba(34,197,94,0.3)' }}>♥</button>
        </div>

      </div>
    </div>
  );
}

// Estilo do celular
const shellStyle = {
  width: '390px', height: '844px', background: '#121212', borderRadius: '44px', 
  border: '1.5px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative', 
  boxShadow: '0 32px 80px rgba(0,0,0,0.8)'
};
