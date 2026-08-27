import React from 'react';

const FoodCard = ({ urun, onSelect }) => {
  const varyasyonVarMi = (urun.porsiyonlar && urun.porsiyonlar.length > 1) || 
                          (urun.secenek_gruplari && urun.secenek_gruplari.length > 0);

  return (
    <div 
      style={{ 
        display: 'flex', 
        border: '1px solid #e2e8f0', 
        padding: '16px', 
        borderRadius: '8px', 
        alignItems: 'center', 
        gap: '16px', 
        backgroundColor: '#fff' 
      }}
    >
      <img 
        src={urun.gorsel_url || '/resimler/varsayilan_yemek.png'} 
        alt={urun.urun_adi} 
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f1f5f9' }} 
      />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#1e293b' }}>{urun.urun_adi}</h4>
        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 6px 0' }}>{urun.aciklama}</p>
        <strong style={{ color: '#2563eb', fontSize: '0.95rem' }}>
          {urun.fiyat} TL {varyasyonVarMi && <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>(başlayan)</span>}
        </strong>
      </div>
      <button 
        type="button"
        onClick={() => onSelect(urun)} 
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#ffc107', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          fontWeight: '600',
          color: '#000',
          transition: 'background-color 0.2s'
        }}
      >
        {varyasyonVarMi ? "Seçenekleri Gör" : "Sepete Ekle"}
      </button>
    </div>
  );
};

export default FoodCard;