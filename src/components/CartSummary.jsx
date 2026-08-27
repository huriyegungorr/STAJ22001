import React from 'react';

const CartSummary = ({ toplamTutar, onSiparisiTamamla, onSepetiBosalt }) => {
  return (
    <div className="sepet-ozet-karti">
      <h3>Sipariş Özeti</h3>
      <hr />
      <div className="ozet-satir">
        <span>Sepet Toplamı</span>
        <span>{toplamTutar} TL</span>
      </div>
      <div className="ozet-satir">
        <span>Teslimat Ücreti</span>
        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Ücretsiz</span>
      </div>
      <hr />
      <div className="ozet-satir toplam">
        <span>Ödenecek Tutar</span>
        <span>{toplamTutar} TL</span>
      </div>

      <button className="siparisi-onayla-btn" onClick={onSiparisiTamamla}>
        Siparişi Tamamla ({toplamTutar} TL)
      </button>
      
      <button className="sepeti-temizle-btn" onClick={onSepetiBosalt}>
        Sepeti Boşalt
      </button>
    </div>
  );
};

export default CartSummary;