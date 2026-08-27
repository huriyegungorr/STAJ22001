import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import OrderItemCard from '../components/OrderItemCard';
import './Siparislerim.css';

const Siparislerim = () => {
  const [siparisler, setSiparisler] = useState([]);
  const [loading, setLoading] = useState(true);

  const [aktifYorumSiparisId, setAktifYorumSiparisId] = useState(null);
  const [yorumMetni, setYorumMetni] = useState('');
  const [puan, setPuan] = useState(5);
  const [yorumYapilanSiparisler, setYorumYapilanSiparisler] = useState([]);

  const siparisleriGetir = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(
        collection(db, "siparisler"),
        where("kullanici_id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const gelenSiparisler = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      gelenSiparisler.sort((a, b) => b.tarih?.seconds - a.tarih?.seconds);
      setSiparisler(gelenSiparisler);

      const yQuery = query(collection(db, "yorumlar"), where("kullanici_id", "==", auth.currentUser.uid));
      const ySnapshot = await getDocs(yQuery);
      const yapilanlar = ySnapshot.docs.map(d => d.data().siparis_id);
      setYorumYapilanSiparisler(yapilanlar);

    } catch (error) {
      console.error("Siparişler çekilirken hata:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    siparisleriGetir();
  }, []);

  const handleYorumGonder = async (e, siparis) => {
    e.preventDefault();
    if (!yorumMetni.trim()) return;

    try {
      
      await addDoc(collection(db, "yorumlar"), {
        restoran_id: siparis.restoran_id,
        siparis_id: siparis.id,
        kullanici_id: auth.currentUser.uid,
        kullanici_email: auth.currentUser?.email || "Anonim Kullanıcı",
        yorum_metni: yorumMetni.trim(),
        puan: Number(puan),
        tarih: new Date().toLocaleDateString('tr-TR')
      });

  
      const rYorumlarQuery = query(
        collection(db, "yorumlar"), 
        where("restoran_id", "==", siparis.restoran_id)
      );
      const rYorumlarSnap = await getDocs(rYorumlarQuery);
      const tumYorumlar = rYorumlarSnap.docs.map(d => d.data());

      if (tumYorumlar.length > 0) {
        const toplamPuan = tumYorumlar.reduce((toplam, y) => toplam + Number(y.puan), 0);
        const yeniOrtalama = (toplamPuan / tumYorumlar.length).toFixed(1); 
     
        await updateDoc(doc(db, "restoranlar", siparis.restoran_id), {
          rating: yeniOrtalama
        });
      }

      alert("Restoran değerlendirmeniz başarıyla gönderildi ve puan güncellendi! ⭐");
      setYorumYapilanSiparisler([...yorumYapilanSiparisler, siparis.id]);
      setAktifYorumSiparisId(null);
      setYorumMetni('');
      setPuan(5);
    } catch (error) {
      console.error("Yorum gönderilirken veya puan güncellenirken hata:", error);
    }
  };

  const getDurumStili = (durum) => {
    if (durum === "Hazırlanıyor") return { backgroundColor: '#ffeaa7', color: '#d63031' };
    if (durum === "Kuryede" || durum === "Yolda") return { backgroundColor: '#74b9ff', color: '#0984e3' };
    if (durum === "Teslim Edildi") return { backgroundColor: '#55efc4', color: '#00b894' };
    return { backgroundColor: '#eee', color: '#333' };
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Siparişleriniz yükleniyor...</div>;

  return (
    <div className="siparislerim-sayfasi">
      <h2>📦 Siparişlerim ve Takip</h2>
      {siparisler.length === 0 ? (
        <p>Henüz verilmiş bir siparişiniz bulunmuyor.</p>
      ) : (
        <div className="siparis-listesi">
          {siparisler.map((siparis) => (
            <OrderItemCard 
              key={siparis.id}
              siparis={siparis}
              getDurumStili={getDurumStili}
              yorumYapilanSiparisler={yorumYapilanSiparisler}
              aktifYorumSiparisId={aktifYorumSiparisId}
              setAktifYorumSiparisId={setAktifYorumSiparisId}
              puan={puan}
              setPuan={setPuan}
              yorumMetni={yorumMetni}
              setYorumMetni={setYorumMetni}
              onYorumGonder={handleYorumGonder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Siparislerim;