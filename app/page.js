export default function Home() {
  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#F4F2EE', padding: '20px' }}>
      
      <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#E8451A', marginBottom: '10px' }}>STIG</h1>
      <p style={{ color: '#A8A49C', marginBottom: '40px', textAlign: 'center' }}>Acesse os protótipos do ecossistema:</p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        <a href="/consumidor" style={cardStyle}>
          <h2 style={{ color: '#E8451A', fontSize: '1.5rem', marginBottom: '10px' }}>📱 App Usuário</h2>
          <p style={{ color: '#A8A49C', fontSize: '0.9rem' }}>Tinder da Comida e Pedidos</p>
        </a>

        <a href="/moto.html" style={cardStyle}>
          <h2 style={{ color: '#E8451A', fontSize: '1.5rem', marginBottom: '10px' }}>🛵 App Entregador</h2>
          <p style={{ color: '#A8A49C', fontSize: '0.9rem' }}>Logística e Pit Stops</p>
        </a>

        {/* Note que aqui o link mudou para a pasta parceiro que vamos criar */}
        <a href="/parceiro" style={cardStyle}>
          <h2 style={{ color: '#E8451A', fontSize: '1.5rem', marginBottom: '10px' }}>🍽️ App Restaurante</h2>
          <p style={{ color: '#A8A49C', fontSize: '0.9rem' }}>Dashboard e Cardápio (Real)</p>
        </a>

        <a href="/admin.html" style={cardStyle}>
          <h2 style={{ color: '#E8451A', fontSize: '1.5rem', marginBottom: '10px' }}>🛡️ Torre de Controle</h2>
          <p style={{ color: '#A8A49C', fontSize: '0.9rem' }}>Gestão Macro e Antifraude</p>
        </a>

      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#181818', border: '1px solid rgba(232,69,26,0.3)', borderRadius: '16px',
  padding: '30px', textDecoration: 'none', width: '280px', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer'
};
