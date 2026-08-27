import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import BolgeYonetimi from '../components/admin/BolgeYonetimi';
import RestoranYonetimi from '../components/admin/RestoranYonetimi';
import KullaniciYonetimi from '../components/admin/KullaniciYonetimi';
import MutfakYonetimi from '../components/admin/MutfakYonetimi';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('bolgeler');
  const [loading, setLoading] = useState(true);
  const [bolgeler, setBolgeler] = useState([]);
  const [restoranlar, setRestoranlar] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [mutfaklar, setMutfaklar] = useState([]);

  const verileriYukle = async () => {
    setLoading(true);
    const [bSnap, rSnap, kSnap, mSnap] = await Promise.all([
      getDocs(collection(db, "bolgeler")),
      getDocs(collection(db, "restoranlar")),
      getDocs(collection(db, "kullanicilar")),
      getDocs(collection(db, "mutfaklar"))
    ]);
    setBolgeler(bSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setRestoranlar(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setKullanicilar(kSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setMutfaklar(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { verileriYukle(); }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar rol="admin" activeTab={activeTab} setActiveTab={setActiveTab} baslik="Admin" altBaslik="Sistem Yöneticisi" />
      <main className="main-content">
        {activeTab === 'bolgeler' && <BolgeYonetimi bolgeler={bolgeler} yenile={verileriYukle} />}
        {activeTab === 'restoranlar' && <RestoranYonetimi restoranlar={restoranlar} yenile={verileriYukle} />}
        {activeTab === 'kullanicilar' && <KullaniciYonetimi kullanicilar={kullanicilar} yenile={verileriYukle} />}
        {activeTab === 'mutfaklar' && <MutfakYonetimi mutfaklar={mutfaklar} yenile={verileriYukle} />}
      </main>
    </div>
  );
}