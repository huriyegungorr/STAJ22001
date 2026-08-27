import React, { useState, useEffect } from 'react';
import { useSepet } from '../context/SepetContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';


import PaymentForm from '../components/PaymentForm';
import OrderCheckoutSummary from '../components/OrderCheckoutSummary';
import './Odeme.css';

const Odeme = () => {
  const { sepetUrunleri, toplamTutar, sepetiBosalt } = useSepet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [adres, setAdres] = useState('');

  
  useEffect(() => {
    const varsayilanAdresiGetir = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "kullanicilar", currentUser.uid));
          if (userDoc.exists() && userDoc.data().adres) {
            setAdres(userDoc.data().adres);
          }
        } catch (error) {
          console.error("Ödeme adımında profil adresi çekilemedi:", error);
        }
      }
    };
    varsayilanAdresiGetir();
  }, []);

  const handleOdemeYap = async (e) => {
    e.preventDefault();
    if (!adres.trim()) return alert("Lütfen teslimat adresi giriniz!");
    
    setLoading(true);

    try {
      await addDoc(collection(db, "siparisler"), {
        kullanici_id: auth.currentUser?.uid,
        kullanici_email: auth.currentUser?.email,
        restoran_id: sepetUrunleri[0].restoranId,
        restoran_adi: sepetUrunleri[0].restoranAdi,
        urunler: sepetUrunleri,
        toplam_tutar: toplamTutar,
        teslimat_adresi: adres,
        durum: "Hazırlanıyor",
        tarih: serverTimestamp()
      });

      alert("Ödeme Başarılı! Siparişiniz restoran tarafından alındı. ");
      sepetiBosalt();
      navigate('/siparislerim');
    } catch (error) {
      console.error("Sipariş kaydedilirken hata:", error);
      alert("Sipariş oluşturulamadı, lütfen tekrar deneyin.");
    }
    setLoading(false);
  };

  if (sepetUrunleri.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Ödeme yapılacak ürün bulunamadı.</div>;
  }

  return (
    <div className="odeme-sayfasi">
      <h2>💳 Güvenli Ödeme Aşaması</h2>
      <div className="odeme-grid">
        
        <PaymentForm 
          adres={adres}
          setAdres={setAdres}
          onSubmit={handleOdemeYap}
          loading={loading}
          toplamTutar={toplamTutar}
        />

        
        <OrderCheckoutSummary 
          sepetUrunleri={sepetUrunleri}
          toplamTutar={toplamTutar}
        />
      </div>
    </div>
  );
};

export default Odeme;