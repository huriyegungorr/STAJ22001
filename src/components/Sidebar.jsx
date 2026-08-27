import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ rol, activeTab, setActiveTab, baslik, logoUrl, altBaslik }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Çıkış yapmak istiyor musunuz?")) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        {logoUrl ? <img src={logoUrl} alt="Logo" className="sidebar-logo" /> : <div style={{ fontSize: '24px' }}></div>}
        <h3>{baslik}</h3>
        <p>{altBaslik}</p>
      </div>

      <nav className="sidebar-menu">
        {rol === 'admin' && (
          <>
            <button onClick={() => setActiveTab('bolgeler')} className={`menu-item-btn ${activeTab === 'bolgeler' ? 'active' : ''}`}> Bölgeleri Yönet</button>
            <button onClick={() => setActiveTab('restoranlar')} className={`menu-item-btn ${activeTab === 'restoranlar' ? 'active' : ''}`}> Restoranları Yönet</button>
            <button onClick={() => setActiveTab('kullanicilar')} className={`menu-item-btn ${activeTab === 'kullanicilar' ? 'active' : ''}`}> Kullanıcıları Yönet</button>
            <button onClick={() => setActiveTab('mutfaklar')} className={`menu-item-btn ${activeTab === 'mutfaklar' ? 'active' : ''}`}> Mutfakları Yönet</button>
          </>
        )}

        {rol === 'restaurant_owner' && (
          <>
            <button onClick={() => setActiveTab('siparisler')} className={`menu-item-btn ${activeTab === 'siparisler' ? 'active' : ''}`}>🔔 Sipariş Takibi</button>
            <button onClick={() => setActiveTab('kategoriler')} className={`menu-item-btn ${activeTab === 'kategoriler' ? 'active' : ''}`}> Kategori Yönetimi</button>
            <button onClick={() => setActiveTab('urun-ekle')} className={`menu-item-btn ${activeTab === 'urun-ekle' ? 'active' : ''}`}> Ürün Ekle</button>
            <button onClick={() => setActiveTab('menu-listesi')} className={`menu-item-btn ${activeTab === 'menu-listesi' ? 'active' : ''}`}> Menü Yönetimi</button>
            <button onClick={() => setActiveTab('profil')} className={`menu-item-btn ${activeTab === 'profil' ? 'active' : ''}`}>⚙️ Profil & Bölge Ayarı</button>
          </>
        )}

        <button onClick={handleLogout} className="menu-item-btn" style={{ color: '#ef4444', marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
           Çıkış Yap
        </button>
      </nav>
    </aside>
  );
}