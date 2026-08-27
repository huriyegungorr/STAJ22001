import React from 'react';

const OrderCheckoutSummary = ({ sepetUrunleri, toplamTutar }) => {
  return (
    <div className="odeme-ozet">
      <h3>Sipariş Detayı</h3>
      <p className="odeme-restoran">🏪 {sepetUrunleri[0]?.restoranAdi}</p>
      <hr />
      {sepetUrunleri.map((item) => (
        <div key={item.id} className="ozet-item">
          <span>{item.yemek_adi} x {item.adet}</span>
          <span>{item.fiyat * item.adet} TL</span>
        </div>
      ))}
      <hr />
      <div className="total-tutar">
        <strong>Toplam:</strong>
        <strong>{toplamTutar} TL</strong>
      </div>
    </div>
  );
};

export default OrderCheckoutSummary;