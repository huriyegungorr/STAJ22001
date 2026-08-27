import React from 'react';
import { db } from '../../firebase';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function RestoranYonetimi({ restoranlar, yenile }) {
  const handleRestoranOnayDegis = async (restoranId, mevcutOnay) => {
    try {
      await updateDoc(doc(db, "restoranlar", restoranId), {
        aktif_mi: !mevcutOnay
      });
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestoranSil = async (restoranId) => {
    if (!window.confirm("Bu restoranı sistemden tamamen silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "restoranlar", restoranId));
      alert("Restoran başarıyla silindi.");
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="content-section">
      <h2>Sistemdeki Restoranlar ({restoranlar.length})</h2>
      <div className="orders-list">
        {restoranlar.map(r => (
          <div key={r.id} className="order-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <img src={r.logo_url || '/resimler/varsayilan_logo.png'} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <strong style={{ fontSize: '16px' }}>{r.restoran_adi}</strong>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Kategori: {r.kategori} | Puan: ⭐ {r.rating || "0.0"}</p>
                <small style={{ color: '#94a3b8' }}>Hizmet Bölgeleri: {r.teslimat_bolgeleri?.join(', ') || 'Yok'}</small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleRestoranOnayDegis(r.id, r.aktif_mi)} 
                style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold', backgroundColor: r.aktif_mi ? '#10b981' : '#f59e0b', color: 'white' }}
              >
                {r.aktif_mi ? "✓ Yayında (Kapat)" : "Onayla / Yayına Al"}
              </button>
              <button 
                onClick={() => handleRestoranSil(r.id)} 
                style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold', backgroundColor: '#ef4444', color: 'white' }}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}