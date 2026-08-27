import React, { createContext, useState, useContext } from 'react';

const SepetContext = createContext();

export const SepetProvider = ({ children }) => {
  const [sepetUrunleri, setSepetUrunleri] = useState([]);

 
const sepeteEkle = (urun, restoranId, restoranAdi) => {
  setSepetUrunleri((oncekiUrunler) => {
    if (oncekiUrunler.length > 0 && oncekiUrunler[0].restoranId !== restoranId) {
      const onay = window.confirm("Sepetinizde başka bir restorana ait ürünler var. Temizlensin mi?");
      if (onay) {
        return [{ ...urun, adet: 1, restoranId, restoranAdi }]; 
      }
      return oncekiUrunler;
    }

   
    const varMi = oncekiUrunler.find((item) => item.id === urun.id);
    if (varMi) {
      return oncekiUrunler.map((item) =>
        item.id === urun.id ? { ...item, adet: item.adet + 1 } : item
      );
    }
   
    return [...oncekiUrunler, { ...urun, adet: urun.adet || 1, restoranId, restoranAdi }];
  });
};

  
  const sepettenCikar = (urunId) => {
    setSepetUrunleri((oncekiUrunler) => {
      const mevcutUrun = oncekiUrunler.find((item) => item.id === urunId);
      if (mevcutUrun?.adet === 1) {
        return oncekiUrunler.filter((item) => item.id !== urunId);
      } else {
        return oncekiUrunler.map((item) =>
          item.id === urunId ? { ...item, adet: item.adet - 1 } : item
        );
      }
    });
  };

  const sepetiBosalt = () => setSepetUrunleri([]);
  const toplamAdet = sepetUrunleri.reduce((toplam, item) => toplam + item.adet, 0);
  const toplamTutar = sepetUrunleri.reduce((toplam, item) => toplam + item.fiyat * item.adet, 0);

  return (
    <SepetContext.Provider value={{ sepetUrunleri, sepeteEkle, sepettenCikar, sepetiBosalt, toplamAdet, toplamTutar }}>
      {children}
    </SepetContext.Provider>
  );
};

export const useSepet = () => useContext(SepetContext);