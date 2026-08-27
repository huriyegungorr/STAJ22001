import React, { useState } from 'react';
import { db } from '../../firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';

export default function MutfakYonetimi({ mutfaklar, yenile }) {
  const [yeniMutfak, setYeniMutfak] = useState('');
  const [duzenlenenMutfakId, setDuzenlenenMutfakId] = useState(null);
  const [duzenlenenMutfakAdi, setDuzenlenenMutfakAdi] = useState('');

  const handleMutfakEkle = async (e) => {
    e.preventDefault();
    if (!yeniMutfak.trim()) return;
    try {
      await addDoc(collection(db, "mutfaklar"), {
        isim: yeniMutfak.trim()
      });
      alert("Yeni mutfak kategorisi eklendi!");
      setYeniMutfak('');
      yenile();
    } catch (error) {
      console.error("Mutfak eklenirken hata:", error);
    }
  };

 
  const handleMutfakGuncelle = async () => {
    const yeniIsim = duzenlenenMutfakAdi.trim();
    if (!yeniIsim) return;

    try {
      const batch = writeBatch(db);

      const mutfakRef = doc(db, "mutfaklar", duzenlenenMutfakId);
      batch.update(mutfakRef, { isim: yeniIsim });

      const q = query(
        collection(db, "restoranlar"), 
        where("mutfak_id", "==", duzenlenenMutfakId)
      );
      const snapshot = await getDocs(q);

      snapshot.docs.forEach((restoranDoc) => {
        const restoranRef = doc(db, "restoranlar", restoranDoc.id);
        batch.update(restoranRef, { kategori: yeniIsim });
      });

    
      await batch.commit();

      alert(`Mutfak adı ve bağlı ${snapshot.size} restoranın kategorisi güncellendi!`);
      setDuzenlenenMutfakId(null);
      setDuzenlenenMutfakAdi('');
      yenile();
    } catch (error) {
      console.error("Mutfak ve restoranlar güncellenirken hata:", error);
    }
  };

  const handleMutfakSil = async (mutfakId, mutfakAdi) => {
    try {
      const q = query(collection(db, "restoranlar"), where("mutfak_id", "==", mutfakId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert(`Bu mutfağa bağlı ${snapshot.size} restoran var. Önce restoranların kategorisini değiştirin!`);
        return;
      }

      if (!window.confirm(`"${mutfakAdi}" kategorisini silmek istediğinize emin misiniz?`)) return;

      await deleteDoc(doc(db, "mutfaklar", mutfakId));
      yenile();
    } catch (error) {
      console.error("Mutfak silinirken hata:", error);
    }
  };

  return (
    <section className="content-section">
      <h2>Mutfak Kategorileri</h2>
      
      <form onSubmit={handleMutfakEkle} className="dashboard-form" style={{ marginBottom: '25px' }}>
        <h3>Yeni Mutfak Kategorisi Ekle</h3>
        <div className="form-group" style={{ display: 'flex', gap: '10px', maxWidth: '450px' }}>
          <input 
            type="text" 
            placeholder="Örn: Uzak Doğu, Döner, Kahvaltı" 
            value={yeniMutfak} 
            required 
            onChange={(e) => setYeniMutfak(e.target.value)} 
          />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Kaydet
          </button>
        </div>
      </form>

      <div className="orders-list">
        <h3>Mevcut Mutfaklar ({mutfaklar.length})</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {mutfaklar.map(m => (
            <div 
              key={m.id} 
              style={{ 
                background: 'white', 
                padding: '8px 14px', 
                borderRadius: '20px', 
                border: '1px solid #cbd5e1', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
            >
              {duzenlenenMutfakId === m.id ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={duzenlenenMutfakAdi} 
                    onChange={(e) => setDuzenlenenMutfakAdi(e.target.value)}
                    style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                    autoFocus
                  />
                  <button 
                    onClick={handleMutfakGuncelle} 
                    style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}
                  >
                    ✓
                  </button>
                  <button 
                    onClick={() => setDuzenlenenMutfakId(null)} 
                    style={{ background: '#94a3b8', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <strong style={{ fontSize: '14px' }}>{m.isim}</strong>
                  <button 
                    onClick={() => {
                      setDuzenlenenMutfakId(m.id);
                      setDuzenlenenMutfakAdi(m.isim);
                    }} 
                    title="Düzenle"
                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleMutfakSil(m.id, m.isim)} 
                    title="Sil"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', lineHeight: 1 }}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}