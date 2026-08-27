import React from 'react';

const CartItem = ({ urun, onEkle, onCikar }) => {
  return (
    <div className="sepet-urun-kart">
      <div className="sepet-urun-detay">
        <h4>{urun.yemek_adi}</h4>
        
       
        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {urun.secili_porsiyon && <span> Boyut: <b>{urun.secili_porsiyon}</b></span>}
          {urun.secili_secenekler?.length > 0 && <span> Ekstralar: <i>{urun.secili_secenekler.join(', ')}</i></span>}
        </div>

        <p className="sepet-urun-fiyat">{urun.fiyat} TL</p>
      </div>
      
     
      <div className="sepet-adet-kontrol">
        <button onClick={() => onCikar(urun.id)} className="adet-btn azalt">-</button>
        <span className="sepet-adet-sayi">{urun.adet}</span>
        <button onClick={() => onEkle(urun, urun.restoranId, urun.restoranAdi)} className="adet-btn artir">+</button>
      </div>

      <div className="sepet-urun-toplam">
        {urun.fiyat * urun.adet} TL
      </div>
    </div>
  );
};

export default CartItem;