import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import './UrunEkleme.css';

export default function UrunEkleme({ restoran, yenile }) {
  const [yemekAdi, setYemekAdi] = useState('');
  const [yemekFiyati, setYemekFiyati] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [seciliKategoriId, setSeciliKategoriId] = useState('');
  const [kategoriler, setKategoriler] = useState([]);
  const [resimYolu, setResimYolu] = useState('/resimler/varsayilan_yemek.png');

  const [porsiyonlar, setPorsiyonlar] = useState([{ isim: 'Normal Porsiyon', ek_fiyat: 0 }]);
  const [secenekGruplari, setSecenekGruplari] = useState([]);

  useEffect(() => {
    const kategorileriYukle = async () => {
      if (!restoran?.id) return;
      try {
        const q = query(collection(db, "kategoriler"), where("restoran_id", "==", restoran.id));
        const snap = await getDocs(q);
        const liste = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setKategoriler(liste);
        if (liste.length > 0) {
          setSeciliKategoriId(liste[0].id);
        }
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
      }
    };
    kategorileriYukle();
  }, [restoran?.id]);

  const handleYemekResimSecimi = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResimYolu(`/resimler/${file.name}`);
    }
  };

  
  const handlePorsiyonEkle = () => setPorsiyonlar([...porsiyonlar, { isim: '', ek_fiyat: 0 }]);
  const handlePorsiyonSil = (index) => setPorsiyonlar(porsiyonlar.filter((_, i) => i !== index));
  const handlePorsiyonDegis = (index, field, value) => {
    const yeni = [...porsiyonlar];
    yeni[index][field] = field === 'ek_fiyat' ? Number(value) : value;
    setPorsiyonlar(yeni);
  };

  const handleGrupEkle = () => {
    setSecenekGruplari([
      ...secenekGruplari,
      { grup_adi: '', zorunlu_mu: false, coklu_secim: false, ogeler: [{ isim: '', ek_fiyat: 0 }] }
    ]);
  };
  const handleGrupSil = (gIndex) => setSecenekGruplari(secenekGruplari.filter((_, i) => i !== gIndex));
  const handleGrupDegis = (grupIndex, field, value) => {
    const yeni = [...secenekGruplari];
    yeni[grupIndex][field] = value;
    setSecenekGruplari(yeni);
  };

  const handleOgeEkle = (grupIndex) => {
    const yeni = [...secenekGruplari];
    yeni[grupIndex].ogeler.push({ isim: '', ek_fiyat: 0 });
    setSecenekGruplari(yeni);
  };
  const handleOgeSil = (grupIndex, ogeIndex) => {
    const yeni = [...secenekGruplari];
    yeni[grupIndex].ogeler = yeni[grupIndex].ogeler.filter((_, i) => i !== ogeIndex);
    setSecenekGruplari(yeni);
  };
  const handleOgeDegis = (grupIndex, ogeIndex, field, value) => {
    const yeni = [...secenekGruplari];
    yeni[grupIndex].ogeler[ogeIndex][field] = field === 'ek_fiyat' ? Number(value) : value;
    setSecenekGruplari(yeni);
  };


  const handleYemekEkle = async (e) => {
    e.preventDefault();
    if (!seciliKategoriId) {
      return alert("Lütfen önce Kategori Yönetimi sekmesinden en az bir kategori oluşturun!");
    }

    try {
      await addDoc(collection(db, "urunler"), {
        restoran_id: restoran.id,
        kategori_id: seciliKategoriId, 
        urun_adi: yemekAdi.trim(),
        fiyat: Number(yemekFiyati),
        aciklama: aciklama.trim(),
        gorsel_url: resimYolu,
        
        porsiyonlar: porsiyonlar.filter(p => p.isim.trim() !== ''),
        secenek_gruplari: secenekGruplari.filter(g => g.grup_adi.trim() !== ''),
        aktif_mi: true
      });

      alert("Yemek başarıyla menüye eklendi!");
      setYemekAdi('');
      setYemekFiyati('');
      setAciklama('');
      setResimYolu('/resimler/varsayilan_yemek.png');
      setPorsiyonlar([{ isim: 'Normal Porsiyon', ek_fiyat: 0 }]);
      setSecenekGruplari([]);
      yenile();
    } catch (error) {
      console.error("Yemek kaydedilirken hata:", error);
    }
  };

  return (
    <section className="urun-ekleme-section">
      <h2>➕ Menüye Yemek Ekle</h2>
      
      <form onSubmit={handleYemekEkle} className="urun-form">
        <div className="form-row">
          <div className="form-group">
            <label>Yemek Adı</label>
            <input 
              type="text" 
              placeholder="Örn: Gurme Burger" 
              value={yemekAdi} 
              required 
              onChange={(e) => setYemekAdi(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Menü Kategorisi</label>
            <select 
              value={seciliKategoriId} 
              required 
              onChange={(e) => setSeciliKategoriId(e.target.value)}
            >
              {kategoriler.length === 0 ? (
                <option value="">Kategori bulunamadı (Önce ekleyin)</option>
              ) : (
                kategoriler.map((kat) => (
                  <option key={kat.id} value={kat.id}>{kat.kategori_adi}</option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Taban Fiyat (TL)</label>
            <input 
              type="number" 
              placeholder="Örn: 180" 
              value={yemekFiyati} 
              required 
              onChange={(e) => setYemekFiyati(e.target.value)} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Yemek Görseli Seç</label>
          <input type="file" accept="image/*" onChange={handleYemekResimSecimi} />
          {resimYolu && (
            <div className="gorsel-onizleme">
              <img src={resimYolu} alt="Önizleme" className="onizleme-img" />
              <span className="gorsel-yol-yazisi">{resimYolu}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>İçindekiler / Açıklama</label>
          <textarea 
            placeholder="Malzemeler ve ürün detayı..." 
            value={aciklama} 
            required 
            onChange={(e) => setAciklama(e.target.value)} 
          />
        </div>

       
        <div className="form-section-box">
          <h4>Porsiyon / Boyut Ayarları</h4>
          {porsiyonlar.map((p, index) => (
            <div key={index} className="porsiyon-satiri">
              <input 
                type="text" 
                placeholder="Örn: 1.5 Porsiyon" 
                value={p.isim} 
                required 
                onChange={(e) => handlePorsiyonDegis(index, 'isim', e.target.value)} 
              />
              <input 
                type="number" 
                placeholder="Ek Ücret (TL)" 
                value={p.ek_fiyat} 
                required 
                onChange={(e) => handlePorsiyonDegis(index, 'ek_fiyat', e.target.value)} 
              />
              {porsiyonlar.length > 1 && (
                <button type="button" onClick={() => handlePorsiyonSil(index)} className="silme-btn">×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handlePorsiyonEkle} className="btn-secondary">+ Yeni Porsiyon Ekle</button>
        </div>

       
        <div className="form-section-box">
          <h4>Ekstra Seçenek Grupları (Soslar, Ekstralar)</h4>
          {secenekGruplari.map((g, gIndex) => (
            <div key={gIndex} className="secenek-grubu-kart">
              <button type="button" onClick={() => handleGrupSil(gIndex)} className="grup-sil-btn">Grubu Sil</button>
              
              <div className="grup-ust-satir">
                <input 
                  type="text" 
                  placeholder="Grup Adı (Örn: Sos Seçimi)" 
                  value={g.grup_adi} 
                  required 
                  onChange={(e) => handleGrupDegis(gIndex, 'grup_adi', e.target.value)} 
                />
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={g.zorunlu_mu} 
                    onChange={(e) => handleGrupDegis(gIndex, 'zorunlu_mu', e.target.checked)} 
                  /> 
                  Zorunlu mu?
                </label>
              </div>

              <div style={{ marginTop: '10px' }}>
                {g.ogeler.map((o, oIndex) => (
                  <div key={oIndex} className="secenek-oge-satiri">
                    <input 
                      type="text" 
                      placeholder="Öğe İsmi (Örn: Ranch)" 
                      value={o.isim} 
                      required 
                      onChange={(e) => handleOgeDegis(gIndex, oIndex, 'isim', e.target.value)} 
                    />
                    <input 
                      type="number" 
                      placeholder="Ek Fiyat" 
                      value={o.ek_fiyat} 
                      required 
                      onChange={(e) => handleOgeDegis(gIndex, oIndex, 'ek_fiyat', e.target.value)} 
                    />
                    {g.ogeler.length > 1 && (
                      <button type="button" onClick={() => handleOgeSil(gIndex, oIndex)} className="silme-btn">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => handleOgeEkle(gIndex)} className="btn-secondary" style={{ marginTop: '6px' }}>
                  + Seçenek Ekle
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleGrupEkle} className="btn-secondary">+ Yeni Seçenek Grubu Ekle</button>
        </div>

        <button type="submit" className="btn-primary">Ürünü Kaydet</button>
      </form>
    </section>
  );
}