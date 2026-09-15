import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './MenuYonetimi.css';
import './UrunEkleme.css'; 

export default function MenuYonetimi({ menuler, yenile, restoranId }) {
  const [selectedKategoriId, setSelectedKategoriId] = useState('Tumu');
  const [kategoriler, setKategoriler] = useState([]);
  
  
  const [editingUrunId, setEditingUrunId] = useState(null);
  const [editAd, setEditAd] = useState('');
  const [editFiyat, setEditFiyat] = useState('');
  const [editAciklama, setEditAciklama] = useState('');
  const [editKategoriId, setEditKategoriId] = useState('');
  const [editResimYolu, setEditResimYolu] = useState('');
  const [editPorsiyonlar, setEditPorsiyonlar] = useState([]);
  const [editSecenekGruplari, setEditSecenekGruplari] = useState([]);

  useEffect(() => {
    const kategorileriYukle = async () => {
      if (!restoranId) return;
      try {
        const q = query(collection(db, "kategoriler"), where("restoran_id", "==", restoranId));
        const snap = await getDocs(q);
        setKategoriler(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
      }
    };
    kategorileriYukle();
  }, [restoranId]);

  
  const handleUrunSil = async (urunId, urunAdi) => {
    if (!window.confirm(`"${urunAdi}" ürününü menüden tamamen silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteDoc(doc(db, "urunler", urunId));
      alert("Ürün başarıyla silindi.");
      yenile();
    } catch (error) {
      console.error("Ürün silinemedi:", error);
    }
  };

  const handleEditModunuAc = (urun) => {
    setEditingUrunId(urun.id);
    setEditAd(urun.urun_adi);
    setEditFiyat(urun.fiyat);
    setEditAciklama(urun.aciklama);
    setEditKategoriId(urun.kategori_id || (kategoriler[0]?.id || ''));
    setEditResimYolu(urun.gorsel_url || '/resimler/varsayilan_yemek.png');
    setEditPorsiyonlar(urun.porsiyonlar || []);
    setEditSecenekGruplari(urun.secenek_gruplari || []);
  };

  const handleEditResimSecimi = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditResimYolu(`/resimler/${file.name}`);
    }
  };

  const handleAktiflikDegistir = async (urunId, mevcutDurum) => {
    try {
      await updateDoc(doc(db, "urunler", urunId), { aktif_mi: !mevcutDurum });
      yenile();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePorsiyonDegis = (index, field, value) => {
    const yeni = [...editPorsiyonlar];
    yeni[index][field] = field === 'ek_fiyat' ? Number(value) : value;
    setEditPorsiyonlar(yeni);
  };

  const handleGrupDegis = (gIdx, field, value) => {
    const yeni = [...editSecenekGruplari];
    yeni[gIdx][field] = value;
    setEditSecenekGruplari(yeni);
  };

  const handleOgeDegis = (gIdx, oIdx, field, value) => {
    const yeni = [...editSecenekGruplari];
    yeni[gIdx].ogeler[oIdx][field] = field === 'ek_fiyat' ? Number(value) : value;
    setEditSecenekGruplari(yeni);
  };

  const handleYemekGuncelleKaydet = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "urunler", editingUrunId), { 
        urun_adi: editAd.trim(),
        aciklama: editAciklama.trim(),
        fiyat: Number(editFiyat),
        kategori_id: editKategoriId,
        gorsel_url: editResimYolu,
        porsiyonlar: editPorsiyonlar.filter(p => p.isim.trim() !== ''),
        secenek_gruplari: editSecenekGruplari.filter(g => g.grup_adi.trim() !== '')
      });
      alert("Yemek başarıyla güncellendi!");
      setEditingUrunId(null);
      yenile();
    } catch (error) {
      console.error(error);
    }
  };


  const getKategoriAdi = (katId) => {
    const kat = kategoriler.find(k => k.id === katId);
    return kat ? kat.kategori_adi : 'Genel';
  };

  return (
    <section className="menu-yonetimi-section">
      <div className="menu-header-bar">
        <h2> Menü Yönetimi ({menuler.length} Ürün)</h2>
        <div className="kategori-filtre-alani">
          <button 
            onClick={() => setSelectedKategoriId('Tumu')} 
            className={`category-btn ${selectedKategoriId === 'Tumu' ? 'active' : ''}`}
          >
            Tümü
          </button>
          {kategoriler.map((kat) => (
            <button 
              key={kat.id} 
              onClick={() => setSelectedKategoriId(kat.id)} 
              className={`category-btn ${selectedKategoriId === kat.id ? 'active' : ''}`}
            >
              {kat.kategori_adi}
            </button>
          ))}
        </div>
      </div>

      <div className="menu-list">
        {menuler
          .filter(u => selectedKategoriId === 'Tumu' || u.kategori_id === selectedKategoriId)
          .map(u => (
            <div key={u.id} className="menu-item-wrapper" style={{ opacity: u.aktif_mi ? 1 : 0.6 }}>
              <div className="menu-item-card">
                <div className="menu-item-sol">
                  <img src={u.gorsel_url} alt="" className="menu-item-img" />
                  <div className="menu-item-detay">
                    <h4>
                      {u.urun_adi} 
                      <span className="kategori-etiketi">{getKategoriAdi(u.kategori_id)}</span>
                    </h4>
                    <p>{u.aciklama}</p>
                    <span className="fiyat-etiketi">{u.fiyat} TL</span>
                  </div>
                </div>

                <div className="menu-item-sag">
                  <button onClick={() => handleEditModunuAc(u)} className="edit-btn">
                     Düzenle
                  </button>
                  <button 
                    onClick={() => handleAktiflikDegistir(u.id, u.aktif_mi)} 
                    className={`edit-btn ${u.aktif_mi ? 'btn-tukendi' : 'btn-aktif'}`}
                  >
                    {u.aktif_mi ? "Tükendi" : "Aktif"}
                  </button>
                  <button 
                    onClick={() => handleUrunSil(u.id, u.urun_adi)} 
                    className="edit-btn btn-sil"
                  >
                     Sil
                  </button>
                </div>
              </div>

            
              {editingUrunId === u.id && (
                <div className="edit-panel">
                  <form onSubmit={handleYemekGuncelleKaydet} className="urun-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Yemek Adı</label>
                        <input type="text" value={editAd} required onChange={(e) => setEditAd(e.target.value)} />
                      </div>
                      
                      <div className="form-group">
                        <label>Kategori</label>
                        <select value={editKategoriId} required onChange={(e) => setEditKategoriId(e.target.value)}>
                          {kategoriler.map((kat) => (
                            <option key={kat.id} value={kat.id}>{kat.kategori_adi}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Fiyat (TL)</label>
                        <input type="number" value={editFiyat} required onChange={(e) => setEditFiyat(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Yemek Görselini Güncelle</label>
                      <input type="file" accept="image/*" onChange={handleEditResimSecimi} />
                      {editResimYolu && (
                        <div className="gorsel-onizleme">
                          <img src={editResimYolu} alt="Mevcut Görsel" className="onizleme-img" />
                          <span className="gorsel-yol-yazisi">{editResimYolu}</span>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Açıklama</label>
                      <textarea value={editAciklama} required onChange={(e) => setEditAciklama(e.target.value)} />
                    </div>

               
                    <div className="form-section-box">
                      <h4>Porsiyon Ayarları</h4>
                      {editPorsiyonlar.map((ep, i) => (
                        <div key={i} className="porsiyon-satiri">
                          <input type="text" value={ep.isim} required onChange={(e) => handlePorsiyonDegis(i, 'isim', e.target.value)} placeholder="Porsiyon Adı" />
                          <input type="number" value={ep.ek_fiyat} required onChange={(e) => handlePorsiyonDegis(i, 'ek_fiyat', e.target.value)} placeholder="Ek Fiyat" />
                          {editPorsiyonlar.length > 1 && (
                            <button type="button" onClick={() => setEditPorsiyonlar(editPorsiyonlar.filter((_, idx) => idx !== i))} className="silme-btn">×</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setEditPorsiyonlar([...editPorsiyonlar, { isim: '', ek_fiyat: 0 }])} className="btn-secondary">+ Yeni Porsiyon Ekle</button>
                    </div>

                   
                    <div className="form-section-box">
                      <h4>Ekstra Seçenek Grupları</h4>
                      {editSecenekGruplari.map((eg, gIdx) => (
                        <div key={gIdx} className="secenek-grubu-kart">
                          <button type="button" onClick={() => setEditSecenekGruplari(editSecenekGruplari.filter((_, i) => i !== gIdx))} className="grup-sil-btn">Grubu Sil</button>
                          <div className="grup-ust-satir">
                            <input type="text" value={eg.grup_adi} required onChange={(e) => handleGrupDegis(gIdx, 'grup_adi', e.target.value)} placeholder="Grup Adı" />
                            <label className="checkbox-label">
                              <input type="checkbox" checked={eg.zorunlu_mu} onChange={(e) => handleGrupDegis(gIdx, 'zorunlu_mu', e.target.checked)} /> Zorunlu mu?
                            </label>
                          </div>
                          
                          <div style={{ marginTop: '10px' }}>
                            {eg.ogeler?.map((eo, oIdx) => (
                              <div key={oIdx} className="secenek-oge-satiri">
                                <input type="text" value={eo.isim} required onChange={(e) => handleOgeDegis(gIdx, oIdx, 'isim', e.target.value)} />
                                <input type="number" value={eo.ek_fiyat} required onChange={(e) => handleOgeDegis(gIdx, oIdx, 'ek_fiyat', e.target.value)} />
                                {eg.ogeler.length > 1 && (
                                  <button type="button" onClick={() => {
                                    const yeni = [...editSecenekGruplari];
                                    yeni[gIdx].ogeler = yeni[gIdx].ogeler.filter((_, i) => i !== oIdx);
                                    setEditSecenekGruplari(yeni);
                                  }} className="silme-btn">×</button>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => {
                              const yeni = [...editSecenekGruplari];
                              yeni[gIdx].ogeler.push({ isim: '', ek_fiyat: 0 });
                              setEditSecenekGruplari(yeni);
                            }} className="btn-secondary" style={{ marginTop: '6px' }}>+ Seçenek Ekle</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => setEditSecenekGruplari([...editSecenekGruplari, { grup_adi: '', zorunlu_mu: false, coklu_secim: false, ogeler: [{ isim: '', ek_fiyat: 0 }] }])} className="btn-secondary">+ Yeni Seçenek Grubu Ekle</button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>Güncelle</button>
                      <button type="button" onClick={() => setEditingUrunId(null)} className="btn-secondary" style={{ padding: '10px 20px' }}>İptal</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
