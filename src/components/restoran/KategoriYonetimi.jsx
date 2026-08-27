import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function KategoriYonetimi({ restoranId }) {
  const [kategoriler, setKategoriler] = useState([]);
  const [yeniKategori, setYeniKategori] = useState('');
  const [duzenlenenKatId, setDuzenlenenKatId] = useState(null);
  const [duzenlenenKatAdi, setDuzenlenenKatAdi] = useState('');

  const kategorileriYukle = async () => {
    if (!restoranId) return;
    try {
      const q = query(collection(db, "kategoriler"), where("restoran_id", "==", restoranId));
      const snap = await getDocs(q);
      setKategoriler(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    kategorileriYukle();
  }, [restoranId]);

  const handleKategoriEkle = async (e) => {
    e.preventDefault();
    if (!yeniKategori.trim()) return;
    try {
      await addDoc(collection(db, "kategoriler"), {
        restoran_id: restoranId,
        kategori_adi: yeniKategori.trim(),
        aktif_mi:true
      });
      setYeniKategori('');
      kategorileriYukle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKategoriGuncelle = async () => {
    if (!duzenlenenKatAdi.trim()) return;
    try {
      await updateDoc(doc(db, "kategoriler", duzenlenenKatId), {
        kategori_adi: duzenlenenKatAdi.trim()
      });
      setDuzenlenenKatId(null);
      kategorileriYukle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKategoriSil = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "kategoriler", id));
      kategorileriYukle();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="content-section">
      <h2>📑 Menü Kategori Yönetimi</h2>
      <form onSubmit={handleKategoriEkle} className="dashboard-form" style={{ marginBottom: '20px', maxWidth: '400px' }}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Yeni Kategori Adı" 
            value={yeniKategori} 
            onChange={(e) => setYeniKategori(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn-primary">Kategori Ekle</button>
      </form>

      <div className="orders-list">
        <h3>Mevcut Kategoriler ({kategoriler.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px' }}>
          {kategoriler.map(k => (
            <div key={k.id} className="order-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px' }}>
              {duzenlenenKatId === k.id ? (
                <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                  <input 
                    type="text" 
                    value={duzenlenenKatAdi} 
                    onChange={(e) => setDuzenlenenKatAdi(e.target.value)} 
                    style={{ flex: 1, padding: '4px 8px' }}
                  />
                  <button type="button" onClick={handleKategoriGuncelle} className="btn-primary" style={{ padding: '4px 10px' }}>Kaydet</button>
                  <button type="button" onClick={() => setDuzenlenenKatId(null)} className="btn-secondary" style={{ padding: '4px 8px' }}>İptal</button>
                </div>
              ) : (
                <>
                  <strong>{k.kategori_adi}</strong>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => { setDuzenlenenKatId(k.id); setDuzenlenenKatAdi(k.kategori_adi); }} className="edit-btn">Düzenle</button>
                    <button type="button" onClick={() => handleKategoriSil(k.id)} className="edit-btn" style={{ color: '#ef4444' }}>Sil</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}