"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AppParceiro() {
  const [menuItems, setMenuItems] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [emoji, setEmoji] = useState('🍕');

  // Função para buscar os dados do Supabase assim que a tela abre
  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    if (!error) setMenuItems(data);
  }

  // Função para salvar no Banco de Dados
  async function addItem() {
    if (!nome || !preco) return alert('Preencha o nome e o preço!');
    
    const { data, error } = await supabase.from('menu_items').insert([
      { nome: nome, preco: parseFloat(preco), emoji: emoji }
    ]);

    if (error) {
      alert('Erro ao salvar no banco!');
      console.error(error);
    } else {
      setNome('');
      setPreco('');
      fetchMenu(); // Recarrega a lista
    }
  }

  // Função para deletar do Banco de Dados
  async function deleteItem(id) {
    await supabase.from('menu_items').delete().eq('id', id);
    fetchMenu(); // Recarrega a lista
  }

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F4F2EE', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ padding: '40px 20px 20px', borderBottom: '1px solid #222' }}>
        <h1 style={{ color: '#E8451A', fontSize: '24px', fontWeight: '900' }}>Stig Parceiro</h1>
        <p style={{ color: '#A8A49C', fontSize: '14px' }}>Dashboard Funcional (Conectado ao Supabase)</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        {/* FORMULÁRIO DE CADASTRO */}
        <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '16px', border: '1px solid rgba(232,69,26,0.3)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '15px' }}>📦 Adicionar Novo Prato</h2>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              value={nome} onChange={(e) => setNome(e.target.value)} 
              placeholder="Nome do Prato" 
              style={inputStyle} 
            />
            <input 
              value={emoji} onChange={(e) => setEmoji(e.target.value)} 
              placeholder="🍕" 
              style={{...inputStyle, width: '60px', textAlign: 'center'}} 
            />
          </div>
          
          <input 
            value={preco} onChange={(e) => setPreco(e.target.value)} 
            type="number" placeholder="Preço de Balcão (R$)" 
            style={{...inputStyle, marginBottom: '15px'}} 
          />
          
          <button onClick={addItem} style={buttonStyle}>
            Salvar no Banco de Dados
          </button>
        </div>

        {/* LISTA DO CARDÁPIO */}
        <h2 style={{ fontSize: '16px', marginBottom: '15px', color: '#A8A49C' }}>Cardápio Ativo</h2>
        
        {menuItems.length === 0 ? (
          <p style={{ color: '#5A5852', textAlign: 'center', padding: '20px' }}>Nenhum item cadastrado ainda.</p>
        ) : (
          menuItems.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#121212', padding: '15px', borderRadius: '12px', border: '1px solid #333', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px', marginRight: '15px' }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.nome}</div>
                <div style={{ color: '#E8451A', fontWeight: '800', marginTop: '4px' }}>R$ {item.preco}</div>
              </div>
              <button onClick={() => deleteItem(item.id)} style={{ backgroundColor: 'transparent', color: '#EF4444', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

// Estilos CSS em JS para facilitar para você
const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', 
  backgroundColor: '#121212', color: '#fff', fontSize: '14px', outline: 'none'
};

const buttonStyle = {
  width: '100%', padding: '14px', borderRadius: '10px', border: 'none', 
  backgroundColor: '#E8451A', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
};
