import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; 
import { signOut, onAuthStateChanged } from 'firebase/auth'; 
import { useNavigate, Outlet, useLocation } from 'react-router-dom'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useSepet } from '../context/SepetContext';
import './MainLayout.css'; 

const MainLayout = ({ searchTerm, setSearchTerm, secilenSehir, setSecilenSehir, secilenIlce, setSecilenIlce }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { toplamAdet, toplamTutar } = useSepet();
  
  const [sehirlerListesi, setSehirlerListesi] = useState([]);
  const [aktifIlceler, setAktifIlceler] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        try {
          const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.kayitli_sehir) setSecilenSehir(userData.kayitli_sehir);
            if (userData.kayitli_ilce) setSecilenIlce(userData.kayitli_ilce);
          }
        } catch (error) {
          console.error("Kullanıcı profil bölgesi alınamadı:", error);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [setSecilenSehir, setSecilenIlce]);


  useEffect(() => {
    const sehirleriGetir = async () => {
      const querySnapshot = await getDocs(collection(db, "bolgeler"));
      const sehirler = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSehirlerListesi(sehirler);
      

      if (!secilenSehir && sehirler.length > 0) {
        setSecilenSehir(sehirler[0].id);
      }
    };
    sehirleriGetir();
  }, [secilenSehir, setSecilenSehir]);


useEffect(() => {
  const ilceleriGuncelle = async () => {
    if (!secilenSehir) return;
    const docRef = doc(db, "bolgeler", secilenSehir);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const ilceler = docSnap.data().ilceler || [];
      setAktifIlceler(ilceler);
      

      if (!secilenIlce || !ilceler.includes(secilenIlce)) {
        setSecilenIlce(ilceler[0] || '');
      }
    }
  };
  ilceleriGuncelle();
}, [secilenSehir, secilenIlce, setSecilenIlce]);

  const handleLogout = async () => {
    if (window.confirm("Çıkış yapmak istiyor musunuz?")) {
      await signOut(auth);
      navigate("/home"); 
    }
  };

  return (
    <div className="home-container"> 
      <header className="home-header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🍔 yemek-sipariş
        </div>

        <div className="search-bar">
          {location.pathname === '/' ? (
            <input type="text" placeholder="Restoran arayın..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          ) : (
            <button onClick={() => navigate('/')} style={{ background: 'none', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>⬅ Anasayfaya Dön</button>
          )}
        </div>

      
        <div className='location' style={{ display: 'flex', gap: '10px', alignItems: 'center' , width:'250px'}}>
          <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
            <option value="">Şehir Seçiniz</option>
            {sehirlerListesi.map(s => <option key={s.id} value={s.id}>{s.sehir_adi}</option>)}
          </select>
          <select value={secilenIlce} onChange={(e) => setSecilenIlce(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
            <option value="">İlçe Seçiniz</option>
            {aktifIlceler.map((ilce, i) => <option key={i} value={ilce}>{ilce}</option>)}
          </select>
        </div>

        <div className="sepet-ozeti" onClick={() => navigate('/sepet')} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          🛒 Sepetim ({toplamAdet}) - {toplamTutar} TL
        </div>
        
        
        <div className="user-profile">
          {currentUser ? (
            <>
             
              <button onClick={() => navigate('/siparislerim')} style={{ background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Siparişlerim</button>
              <button onClick={() => navigate('/profilim')} style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}> Bilgilerim</button>
              <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Çıkış Yap</button>
            </>
          ) : (
            
            <button onClick={() => navigate('/login')} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Giriş Yap</button>
          )}
        </div>
      </header>

      <main className="layout-content" style={{ padding: '20px' }}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;