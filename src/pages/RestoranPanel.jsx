import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import SiparisTakibi from '../components/restoran/SiparisTakibi';
import KategoriYonetimi from '../components/restoran/KategoriYonetimi';
import UrunEkleme from '../components/restoran/UrunEkleme';
import MenuYonetimi from '../components/restoran/MenuYonetimi';
import RestoranProfilAyarlari from '../components/restoran/RestoranProfilAyarlari';
import './RestoranPanel.css';

export default function RestoranPanel() {
  const { user } = useAuth();
  const [restoran, setRestoran] = useState(null);
  const [menuler, setMenuler] = useState([]);
  const [siparisler, setSiparisler] = useState([]);
  const [tumIlceler, setTumIlceler] = useState([]);
  const [activeTab, setActiveTab] = useState('siparisler');
  const [loading, setLoading] = useState(true);

  const verileriYukle = async () => {
    if (!user) return;
    try {
      const bSnapshot = await getDocs(collection(db, "bolgeler"));
      const tumSehirler = bSnapshot.docs.map(d => d.data());
      const birlesikIlceler = tumSehirler.flatMap(sehir => sehir.ilceler || []);
      setTumIlceler([...new Set(birlesikIlceler)]);

      const rQuery = query(collection(db, "restoranlar"), where("sahip_id", "==", user.uid));
      const rSnapshot = await getDocs(rQuery);

      if (!rSnapshot.empty) {
        const rDoc = rSnapshot.docs[0];
        const rData = { id: rDoc.id, ...rDoc.data() };
        setRestoran(rData);

        const mQuery = query(collection(db, "urunler"), where("restoran_id", "==", rDoc.id));
        const mSnapshot = await getDocs(mQuery);
        setMenuler(mSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

        const sQuery = query(collection(db, "siparisler"), where("restoran_id", "==", rDoc.id));
        const sSnapshot = await getDocs(sQuery);
        setSiparisler(sSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (error) {
      console.error("Veriler yüklenirken hata oluştu:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    verileriYukle();
  }, [user]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Yükleniyor...</div>;
  if (!restoran) return <div style={{ padding: '50px', textAlign: 'center' }}>Restoran bilgisi bulunamadı.</div>;

  return (
    <div className="dashboard-container">
      <Sidebar 
        rol="restaurant_owner" 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        baslik={restoran.restoran_adi} 
        altBaslik={restoran.kategori}
        logoUrl={restoran.logo_url}
      />

      <main className="main-content">
        {activeTab === 'siparisler' && <SiparisTakibi siparisler={siparisler} yenile={verileriYukle} />}
        {activeTab === 'kategoriler' && <KategoriYonetimi restoranId={restoran.id} />}
        {activeTab === 'urun-ekle' && <UrunEkleme restoran={restoran} yenile={verileriYukle} />}
        {activeTab === 'menu-listesi' && <MenuYonetimi menuler={menuler} yenile={verileriYukle} restoranId={restoran.id} />}
        {activeTab === 'profil' && <RestoranProfilAyarlari restoran={restoran} tumIlceler={tumIlceler} yenile={verileriYukle} />}
      </main>
    </div>
  );
}