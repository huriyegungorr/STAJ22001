import React from 'react';
import { db } from '../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function KullaniciYonetimi({ kullanicilar, yenile }) {
  const handleKullaniciSil = async (kullaniciId) => {
    if (!window.confirm("Bu kullanıcıyı sistemden tamamen silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "kullanicilar", kullaniciId));
      alert("Kullanıcı kaydı başarıyla silindi.");
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="content-section">
      <h2>Sistemdeki Kayıtlı Kullanıcılar ({kullanicilar.length})</h2>
      <div className="orders-list">
        {kullanicilar.map(k => (
          <div key={k.id} className="order-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '16px' }}>{k.eposta}</strong>
              <p style={{ margin: '4px 0 0 0', color: '#2563eb', fontSize: '13px', fontWeight: 'bold' }}>Rol: {k.rol}</p>
            </div>
            <div>
              {k.rol !== 'admin' && ( 
                <button 
                  onClick={() => handleKullaniciSil(k.id)} 
                  style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold', backgroundColor: '#ef4444', color: 'white' }}
                >
                  Sistemden Sil
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}