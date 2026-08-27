import React from 'react';

const PaymentForm = ({ adres, setAdres, onSubmit, loading, toplamTutar }) => {
  return (
    <form onSubmit={onSubmit} className="odeme-formu">
      <h3>Teslimat ve Kart Bilgileri</h3>
      
      <label>Teslimat Adresi</label>
      <textarea 
        placeholder="Açık adresinizi yazınız..." 
        value={adres} 
        onChange={(e) => setAdres(e.target.value)} 
        required 
      />

      <label>Kart Sahibi</label>
      <input type="text" placeholder="Ad Soyad" required />

      <label>Kart Numarası</label>
      <input type="text" placeholder="0000 0000 0000 0000" maxLength="16" required />

      <div className="kart-tarih-cvc">
        <div>
          <label>S.K.T</label>
          <input type="text" placeholder="AA/YY" maxLength="5" required />
        </div>
        <div>
          <label>CVC</label>
          <input type="text" placeholder="000" maxLength="3" required />
        </div>
      </div>

      <button type="submit" disabled={loading} className="odeme-bitir-btn">
        {loading ? "Ödeme Onaylanıyor..." : `Ödemeyi Tamamla (${toplamTutar} TL)`}
      </button>
    </form>
  );
};

export default PaymentForm;