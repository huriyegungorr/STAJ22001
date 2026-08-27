import React from 'react';
import { useSepet } from '../context/SepetContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import './Sepet.css';

const Sepet = () => {
  const { sepetUrunleri, sepeteEkle, sepettenCikar, sepetiBosalt, toplamTutar } = useSepet();
  const navigate = useNavigate();

  const handleSiparisiTamamla = () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Sipariş verebilmek için lütfen önce giriş yapın veya kayıt olun!");
      navigate('/login');
      return;
    }

    navigate('/odeme');
  };

  if (sepetUrunleri.length === 0) {
    return (
      <div className="sepet-bos-container">
        <span className="sepet-bos-ikon">🛒</span>
        <h2>Sepetiniz henüz boş</h2>
        <p>Lezzetli yemekleri keşfetmek için hemen alışverişe başlayın!</p>
        <button className="kesfet-btn" onClick={() => navigate('/')}>
          Restoranları Keşfet
        </button>
      </div>
    );
  }

  return (
    <div className="sepet-sayfasi">
      <div className="sepet-baslik-alani">
        <h2>Sepetim</h2>
        <span className="restoran-etiket"> {sepetUrunleri[0]?.restoranAdi}</span>
      </div>

      <div className="sepet-icerik-yapisi">
       
        <div className="sepet-urunler-listesi">
          {sepetUrunleri.map((urun) => (
            <CartItem 
              key={urun.id} 
              urun={urun} 
              onEkle={sepeteEkle} 
              onCikar={sepettenCikar} 
            />
          ))}
        </div>

       
        <CartSummary 
          toplamTutar={toplamTutar} 
          onSiparisiTamamla={handleSiparisiTamamla} 
          onSepetiBosalt={sepetiBosalt} 
        />
      </div>
    </div>
  );
};

export default Sepet;