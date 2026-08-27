
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Profilim.css'; 

const Profilim = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  

  const [adSoyad, setAdSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [adres, setAdres] = useState('');
  const [profilSehir, setProfilSehir] = useState('');
  const [profilIlce, setProfilIlce] = useState('');

  
  const [sehirlerListesi, setSehirlerListesi] = useState([]);
  const [aktifIlceler, setAktifIlceler] = useState([]);

  useEffect(() => {
    const verileriHazirla = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          alert("Lütfen önce giriş yapın!");
          return navigate('/login');
        }

        const sehirlerSnapshot = await getDocs(collection(db, "bolgeler"));
        const sehirler = sehirlerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSehirlerListesi(sehirler);

        const userDocRef = doc(db, "kullanicilar", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setAdSoyad(userData.kullanici_adi || '');
          setTelefon(userData.telefon || '');
          setAdres(userData.adres || '');
          setProfilSehir(userData.kayitli_sehir || '');
          setProfilIlce(userData.kayitli_ilce || '');

          if (userData.kayitli_sehir) {
            const sehirDoc = sehirler.find(s => s.id === userData.kayitli_sehir);
            if (sehirDoc) setAktifIlceler(sehirDoc.ilceler || []);
          }
        }
      } catch (error) {
        console.error("Profil bilgileri yüklenirken hata:", error);
      }
      setLoading(false);
    };

    verileriHazirla();
  }, [navigate]);

  const handleSehirDegisim = (e) => {
    const secilenSehirId = e.target.value;
    setProfilSehir(secilenSehirId);
    setProfilIlce(''); 

    const sehirDoc = sehirlerListesi.find(s => s.id === secilenSehirId);
    if (sehirDoc) {
      setAktifIlceler(sehirDoc.ilceler || []);
    } else {
      setAktifIlceler([]);
    }
  };

  const handleGuncelle = async (e) => {
    e.preventDefault();

    if (telefon.length !== 11) {
      return alert("Telefon numarası başında sıfır olacak şekilde 11 haneli olmalıdır!");
    }

    try {
      const currentUser = auth.currentUser;
      const userDocRef = doc(db, "kullanicilar", currentUser.uid);
      
      await updateDoc(userDocRef, {
        kullanici_adi: adSoyad,
        telefon: telefon,
        adres: adres,
        kayitli_sehir: profilSehir,
        kayitli_ilce: profilIlce
      });

      alert("Profil bilgileriniz ve varsayılan bölgeniz başarıyla güncellendi!");
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      alert("Güncelleme yapılırken bir hata oluştu.");
    }
  };

  if (loading) return <div className="profil-loading">Profil yükleniyor...</div>;

  return (
    <div className="profil-container">
      <h2 className="profil-title"> Profil Bilgilerim</h2>
      
      <form onSubmit={handleGuncelle} className="profil-form">
        
        <div className="form-group">
          <label>Ad Soyad</label>
          <input 
            type="text" value={adSoyad} required
            onChange={(e) => setAdSoyad(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Telefon Numarası</label>
          <input 
            type="tel" value={telefon} required maxLength="11"
            placeholder="Örn: 05321234567"
            onChange={(e) => setTelefon(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>

        <div className="form-row-grid">
          <div className="form-group">
            <label>Varsayılan Şehir</label>
            <select value={profilSehir} onChange={handleSehirDegisim}>
              <option value="">Şehir Seçiniz</option>
              {sehirlerListesi.map(s => <option key={s.id} value={s.id}>{s.sehir_adi}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Varsayılan İlçe</label>
            <select value={profilIlce} onChange={(e) => setProfilIlce(e.target.value)}>
              <option value="">İlçe Seçiniz</option>
              {aktifIlceler.map((ilce, i) => <option key={i} value={ilce}>{ilce}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Açık Teslimat Adresi</label>
          <textarea 
            value={adres} 
            placeholder="Siparişlerinizin varsayılan olarak gönderileceği mahalle, cadde, kapı no bilgilerini detaylıca yazın..."
            onChange={(e) => setAdres(e.target.value)}
          />
        </div>

        <button type="submit" className="profil-submit-btn">
          Bilgilerimi ve Adresimi Güncelle
        </button>
      </form>
    </div>
  );
};

export default Profilim;