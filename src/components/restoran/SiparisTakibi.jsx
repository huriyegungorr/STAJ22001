import React from 'react';
import { db } from '../../firebase';
import { updateDoc, doc } from 'firebase/firestore';

export default function SiparisTakibi({ siparisler, yenile }) {
  const handleDurumGuncelle = async (siparisId, yeniDurum) => {
    try {
      await updateDoc(doc(db, "siparisler", siparisId), { durum: yeniDurum });
      alert("Sipariş durumu güncellendi!");
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="content-section">
      <h2>🔔 Canlı Sipariş Takibi ({siparisler.length})</h2>
      <div className="orders-list">
        {siparisler.length === 0 ? <p>Kutuda bekleyen sipariş yok.</p> : 
          siparisler.map(s => (
            <div key={s.id} className="order-card">
              <div className="order-info">
                <strong>Sipariş No: #{s.id.substring(0, 5)}</strong>
                {s.urunler?.map((u, i) => (
                  <span key={i} style={{ color: '#475569', fontSize: '14px', display: 'block' }}>
                    {u.yemek_adi} x {u.adet} {u.secili_porsiyon ? `(${u.secili_porsiyon})` : ''}
                    {u.secili_secenekler?.length > 0 && <small style={{ display: 'block', color: '#888' }}>+ {u.secili_secenekler.join(', ')}</small>}
                  </span>
                ))}
                <span style={{ fontSize: '13px', color: '#666', marginTop: '10px', display: 'block' }}>
                  <b>Adres:</b> {s.teslimat_adresi}
                </span>
                <strong style={{ color: '#2563eb', marginTop: '4px', display: 'block' }}>{s.toplam_tutar} TL</strong>
              </div>
              <div>
                <select 
                  value={s.durum || 'Hazırlanıyor'} 
                  onChange={(e) => handleDurumGuncelle(s.id, e.target.value)} 
                  className="form-group" 
                  style={{ padding: '8px', borderRadius: '6px' }}
                >
                  <option value="Hazırlanıyor">Hazırlanıyor</option>
                  <option value="Yolda">Kuryede / Yolda</option>
                  <option value="Teslim Edildi">Teslim Edildi</option>
                  <option value="İptal Edildi">İptal Edildi</option>
                </select>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  );
}