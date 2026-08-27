import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; 
import { useSepet } from '../context/SepetContext';

import FoodCard from '../components/FoodCard';
import VariationModal from '../components/VariationModal';
import ReviewList from '../components/ReviewList';

const RestoranDetay = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { sepeteEkle } = useSepet(); 
  
  const [restoran, setRestoran] = useState(null);
  const [kategoriler, setKategoriler] = useState([]); 
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yorumlar, setYorumlar] = useState([]);

  const [secilenUrun, setSecilenUrun] = useState(null); 
  const [seciliPorsiyon, setSeciliPorsiyon] = useState(null); 
  const [seciliEkstralar, setSeciliEkstralar] = useState([]); 

  useEffect(() => {
    const verileriGetir = async () => {
      try {
      
        const rDocRef = doc(db, "restoranlar", id);
        const rDocSnap = await getDoc(rDocRef);

        if (rDocSnap.exists()) {
          setRestoran({ id: rDocSnap.id, ...rDocSnap.data() });

         
          const kQuery = query(collection(db, "kategoriler"), where("restoran_id", "==", id));
          const kSnapshot = await getDocs(kQuery);
          setKategoriler(kSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

       
          const uQuery = query(
            collection(db, "urunler"), 
            where("restoran_id", "==", id),
            where("aktif_mi", "==", true)
          );
          const uSnapshot = await getDocs(uQuery);
          setUrunler(uSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

          const yQuery = query(collection(db, "yorumlar"), where("restoran_id", "==", id));
          const ySnapshot = await getDocs(yQuery);
          setYorumlar(ySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          alert("Restoran bulunamadı!");
          navigate("/");
        }
      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
      }
      setLoading(false);
    };

    verileriGetir();
  }, [id, navigate]);

  const handleSepeteEkleTikla = (urun) => {
    setSecilenUrun(urun);
    if (urun.porsiyonlar && urun.porsiyonlar.length > 0) {
      setSeciliPorsiyon(urun.porsiyonlar[0]);
    } else {
      setSeciliPorsiyon({ isim: "Normal Porsiyon", ek_fiyat: 0 });
    }
    setSeciliEkstralar([]); 
  };

  const handleEkstraToggle = (oge) => {
    const varMi = seciliEkstralar.find(e => e.isim === oge.isim);
    if (varMi) {
      setSeciliEkstralar(seciliEkstralar.filter(e => e.isim !== oge.isim));
    } else {
      setSeciliEkstralar([...seciliEkstralar, oge]);
    }
  };

  const handleModalSepeteGonder = () => {
    if (secilenUrun.secenek_gruplari && secilenUrun.secenek_gruplari.length > 0) {
      for (const grup of secilenUrun.secenek_gruplari) {
        if (grup.zorunlu_mu) {
          const gruptanSecilenVarMi = grup.ogeler.some(oge => 
            seciliEkstralar.some(e => e.isim === oge.isim)
          );
          if (!gruptanSecilenVarMi) {
            alert(`Lütfen "${grup.grup_adi}" alanından en az bir seçim yapınız!`);
            return; 
          }
        }
      }
    }

    const ekstralarToplami = seciliEkstralar.reduce((toplam, e) => toplam + e.ek_fiyat, 0);
    const nihaiFiyat = secilenUrun.fiyat + (seciliPorsiyon?.ek_fiyat || 0) + ekstralarToplami;

    const sepetSatirId = `${secilenUrun.id}-${seciliPorsiyon?.isim}-${seciliEkstralar.map(e => e.isim).join('-')}`;

    const sepeteGidecekUrun = {
      id: sepetSatirId,
      urunRealId: secilenUrun.id,
      yemek_adi: secilenUrun.urun_adi,
      fiyat: nihaiFiyat,
      secili_porsiyon: seciliPorsiyon?.isim || "",
      secili_secenekler: seciliEkstralar.map(e => e.isim)
    };

    sepeteEkle(sepeteGidecekUrun, restoran.id, restoran.restoran_adi);
    setSecilenUrun(null); 
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div className="detay-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      
   
      <div className="restoran-header-card" style={{ display: 'flex', gap: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9', alignItems: 'center' }}>
        <img src={restoran?.logo_url || '/resimler/varsayilan_logo.png'} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
        <div>
          <h1 style={{ margin: '0 0 5px 0' }}>{restoran?.restoran_adi}</h1>
          <p style={{ margin: '0 0 10px 0', color: '#666' }}>{restoran?.aciklama}</p>
          <span style={{ backgroundColor: '#e0e0e0', padding: '4px 8px', borderRadius: '4px' }}>{restoran?.kategori}</span>
        </div>
      </div>

      <h2 style={{ marginTop: '30px' }}>Menü</h2>
      
      
      <div className="detay-menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {kategoriler.map((kat) => {
          
          const kategoriUrunleri = urunler.filter(
            u => u.kategori_id === kat.id || u.alt_kategori === kat.kategori_adi
          );

          if (kategoriUrunleri.length === 0) return null;

          return (
            <div key={kat.id} className="kategori-grubu">
              <h3 style={{ borderBottom: '2px solid #ffc107', paddingBottom: '5px', marginBottom: '15px' }}>
                {kat.kategori_adi}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {kategoriUrunleri.map((urun) => (
                  <FoodCard key={urun.id} urun={urun} onSelect={handleSepeteEkleTikla} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

   
      <VariationModal 
        secilenUrun={secilenUrun}
        seciliPorsiyon={seciliPorsiyon}
        setSeciliPorsiyon={setSeciliPorsiyon}
        seciliEkstralar={seciliEkstralar}
        onEkstraToggle={handleEkstraToggle}
        onClose={() => setSecilenUrun(null)}
        onAddToCart={handleModalSepeteGonder}
      />

      <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />
      
    
      <ReviewList yorumlar={yorumlar} />

    </div>
  );
};

export default RestoranDetay;