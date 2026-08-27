import React, { useState } from 'react';
import { db } from '../../firebase';
import { updateDoc, doc } from 'firebase/firestore';

export default function RestoranProfilAyarlari({ restoran, tumIlceler, yenile }) {
  const [pAciklama, setPAciklama] = useState(restoran.aciklama || '');
  const [pLogoYolu, setPLogoYolu] = useState(restoran.logo_url || '');
  const [seciliBolgeler, setSeciliBolgeler] = useState(restoran.teslimat_bolgeleri || []);

  const handleLogoSecimi = (e) => {
    const file = e.target.files[0];
    if (file) setPLogoYolu(`/resimler/${file.name}`);
  };

  const handleBolgeToggle = (ilce) => {
    if (seciliBolgeler.includes(ilce)) {
      setSeciliBolgeler(seciliBolgeler.filter(b => b !== ilce));
    } else {
      setSeciliBolgeler([...seciliBolgeler, ilce]);
    }
  };

  const handleProfilKaydet = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "restoranlar", restoran.id), {
        aciklama: pAciklama,
        logo_url: pLogoYolu,
        teslimat_bolgeleri: seciliBolgeler
      });
      alert("Profil başarıyla güncellendi!");
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="content-section">
      <h2>⚙️ Restoran Profil & Teslimat Ayarları</h2>
      <form onSubmit={handleProfilKaydet} className="dashboard-form">
        <div className="form-group">
          <label>Dükkan Tanıtım Yazısı</label>
          <textarea value={pAciklama} required onChange={(e) => setPAciklama(e.target.value)} />
        </div>

        <div className="form-group">
          <label style={{ fontWeight: 'bold' }}>Yeni Dükkan Logosu Seç</label>
          <input type="file" accept="image/*" onChange={handleLogoSecimi} style={{ marginTop: '5px' }} />
        </div>

        <div className="form-group">
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📍 Paket Servis Gönderdiğiniz İlçeler</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {tumIlceler.map((ilce, i) => (
              <button 
                key={i} 
                type="button"
                onClick={() => handleBolgeToggle(ilce)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid',
                  cursor: 'pointer',
                  fontWeight: '600',
                  backgroundColor: seciliBolgeler.includes(ilce) ? '#2563eb' : '#fff',
                  color: seciliBolgeler.includes(ilce) ? '#fff' : '#475569',
                  borderColor: seciliBolgeler.includes(ilce) ? '#2563eb' : '#cbd5e1'
                }}
              >
                {seciliBolgeler.includes(ilce) ? '✓ ' : ''}{ilce}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary">Ayarları Kaydet</button>
      </form>
    </section>
  );
}