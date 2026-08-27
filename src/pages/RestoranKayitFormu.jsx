import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';

const RestoranKayitFormu = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restoran_adi: '',
    mutfak_id: '',       
    kategori_adi: '',    
    min_order: '',
    time: '20-30 dk',
    logo_url: '' 
  });

  const [mutfaklar, setMutfaklar] = useState([]); 

  useEffect(() => {
    const mutfaklariGetir = async () => {
      try {
        const qSnapshot = await getDocs(collection(db, "mutfaklar"));
      
        const list = qSnapshot.docs.map(doc => ({
          id: doc.id,
          isim: doc.data().isim
        }));
        setMutfaklar(list);
        
        if (list.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            mutfak_id: list[0].id,
            kategori_adi: list[0].isim 
          }));
        }
      } catch (error) {
        console.error("Mutfaklar çekilirken hata oluştu:", error);
      }
    };
    mutfaklariGetir();
  }, []);

  const handleKategoriChange = (e) => {
    const secilenId = e.target.value;
    const secilenMutfak = mutfaklar.find(m => m.id === secilenId);
    setFormData(prev => ({
      ...prev,
      mutfak_id: secilenId,
      kategori_adi: secilenMutfak ? secilenMutfak.isim : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return alert("Lütfen önce giriş yapın!");
      if (!formData.mutfak_id) return alert("Lütfen bir mutfak kategorisi seçiniz!");

      await addDoc(collection(db, "restoranlar"), {
        restoran_adi: formData.restoran_adi,
        mutfak_id: formData.mutfak_id,        
        kategori: formData.kategori_adi,      
        min_order: Number(formData.min_order),
        time: formData.time,
        logo_url: formData.logo_url || '/resimler/varsayilan_logo.png', 
        rating: 0.0,
        aktif_mi: true,
        sahip_id: currentUser.uid 
      });

      alert("Restoranınız başarıyla kaydedildi! Panele yönlendiriliyorsunuz.");
      navigate("/restoran-panel");
    } catch (error) {
      console.error("Restoran kaydedilirken hata:", error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Restoran Bilgilerini Tamamla</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Restoran Adı" required
          onChange={(e) => setFormData({...formData, restoran_adi: e.target.value})}
        />
        
        <select 
          value={formData.mutfak_id}
          required
          onChange={handleKategoriChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Kategori Seçiniz...</option>
          {mutfaklar.map((m) => (
            <option key={m.id} value={m.id}>{m.isim}</option>
          ))}
        </select>

        <input 
          type="number" placeholder="Min. Paket Tutarı (TL)" required
          onChange={(e) => setFormData({...formData, min_order: e.target.value})}
        />
        <input 
          type="text" placeholder="Teslimat Süresi (Örn: 20-30 dk)"
          value={formData.time}
          onChange={(e) => setFormData({...formData, time: e.target.value})}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Kaydet ve Devam Et
        </button>
      </form>
    </div>
  );
};

export default RestoranKayitFormu;