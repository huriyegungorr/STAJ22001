import React from 'react';

const VariationModal = ({ 
  secilenUrun, 
  seciliPorsiyon, 
  setSeciliPorsiyon, 
  seciliEkstralar, 
  onEkstraToggle, 
  onClose, 
  onAddToCart 
}) => {
  if (!secilenUrun) return null;

  const ekstralarToplami = seciliEkstralar.reduce((t, e) => t + e.ek_fiyat, 0);
  const toplamModalFiyati = secilenUrun.fiyat + (seciliPorsiyon?.ek_fiyat || 0) + ekstralarToplami;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '460px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', color: '#1e293b' }}>
          {secilenUrun.urun_adi}
        </h3>
        
    
        {secilenUrun.porsiyonlar?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '0.95rem' }}>Porsiyon / Boyut Seçimi</h4>
            {secilenUrun.porsiyonlar.map((p, i) => (
              <label key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '8px', cursor: 'pointer', backgroundColor: seciliPorsiyon?.isim === p.isim ? '#eff6ff' : '#fff', borderColor: seciliPorsiyon?.isim === p.isim ? '#2563eb' : '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="radio" name="porsiyon" checked={seciliPorsiyon?.isim === p.isim} onChange={() => setSeciliPorsiyon(p)} style={{ marginRight: '10px' }} />
                  <span style={{ fontWeight: seciliPorsiyon?.isim === p.isim ? '600' : 'normal' }}>{p.isim}</span>
                </div>
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{p.ek_fiyat > 0 ? `+${p.ek_fiyat} TL` : 'Ücretsiz'}</span>
              </label>
            ))}
          </div>
        )}

      
        {secilenUrun.secenek_gruplari?.length > 0 && (
          secilenUrun.secenek_gruplari.map((grup, gIdx) => (
            <div key={gIdx} style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {grup.grup_adi} 
                {grup.zorunlu_mu && <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>(Zorunlu)</span>}
              </h4>
              {grup.ogeler?.map((oge, oIdx) => {
                const secildiMi = seciliEkstralar.some(e => e.isim === oge.isim);
                return (
                  <label key={oIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '6px', cursor: 'pointer', backgroundColor: secildiMi ? '#f0fdf4' : '#fff', borderColor: secildiMi ? '#16a34a' : '#cbd5e1' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={secildiMi} onChange={() => onEkstraToggle(oge)} style={{ marginRight: '10px' }} />
                      <span>{oge.isim}</span>
                    </div>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{oge.ek_fiyat > 0 ? `+${oge.ek_fiyat} TL` : 'Ücretsiz'}</span>
                  </label>
                );
              })}
            </div>
          ))
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
            İptal
          </button>
          <button type="button" onClick={onAddToCart} style={{ flex: 2, padding: '12px', borderRadius: '6px', border: 'none', background: '#ffc107', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: '#000' }}>
            Sepete Ekle ({toplamModalFiyati} TL)
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariationModal;