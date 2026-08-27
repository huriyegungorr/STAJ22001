import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function BolgeYonetimi({ bolgeler, yenile }) {
  const [yeniSehir, setYeniSehir] = useState('');
  const [yeniIlce, setYeniIlce] = useState('');
  const [seciliSehirId, setSeciliSehirId] = useState(bolgeler[0]?.id || '');

  const handleSehirEkle = async (e) => {
    e.preventDefault();
    if (!yeniSehir.trim()) return;
    try {
      await addDoc(collection(db, "bolgeler"), {
        sehir_adi: yeniSehir.trim(),
        ilceler: []
      });
      alert(`${yeniSehir} şehri başarıyla eklendi!`);
      setYeniSehir('');
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  const handleIlceEkle = async (e) => {
    e.preventDefault();
    if (!yeniIlce.trim() || !seciliSehirId) return;
    try {
      const sehirRef = doc(db, "bolgeler", seciliSehirId);
      await updateDoc(sehirRef, {
        ilceler: arrayUnion(yeniIlce.trim())
      });
      alert(`${yeniIlce} ilçesi başarıyla eklendi!`);
      setYeniIlce('');
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  const handleIlceSil = async (sehirId, ilceAdi) => {
    if (!window.confirm(`${ilceAdi} ilçesini silmek istediğinize emin misiniz?`)) return;
    try {
      const sehirRef = doc(db, "bolgeler", sehirId);
      await updateDoc(sehirRef, {
        ilceler: arrayRemove(ilceAdi)
      });
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="content-section">
      <h2>Şehir ve İlçe Yönetimi</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSehirEkle} className="dashboard-form" style={{ flex: 1, minWidth: '300px' }}>
          <h3>Yeni Şehir Ekle</h3>
          <div className="form-group">
            <input type="text" placeholder="Örn: Ankara" value={yeniSehir} required onChange={(e) => setYeniSehir(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary">Şehri Kaydet</button>
        </form>

        <form onSubmit={handleIlceEkle} className="dashboard-form" style={{ flex: 1, minWidth: '300px' }}>
          <h3>Şehre İlçe Ekle</h3>
          <div className="form-row">
            <div className="form-group">
              <select value={seciliSehirId} onChange={(e) => setSeciliSehirId(e.target.value)} style={{ padding: '8px', borderRadius: '4px', width: '100%' }}>
                {bolgeler.map(b => <option key={b.id} value={b.id}>{b.sehir_adi}</option>)}
              </select>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Örn: Çankaya" value={yeniIlce} required onChange={(e) => setYeniIlce(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn-primary">İlçeyi Kaydet</button>
        </form>
      </div>

      <div className="orders-list">
        <h3>Mevcut Hizmet Alanları</h3>
        {bolgeler.map(b => (
          <div key={b.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
            <strong style={{ fontSize: '18px', color: '#1e293b' }}>📍 {b.sehir_adi}</strong>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              {b.ilceler?.length === 0 ? <span style={{ color: '#94a3b8', fontSize: '14px' }}>Henüz ilçe eklenmemiş.</span> : 
                b.ilceler?.map((ilce, idx) => (
                  <div key={idx} style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <span>{ilce}</span>
                    <button onClick={() => handleIlceSil(b.id, ilce)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}