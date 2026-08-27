import React from 'react';
import ReviewForm from './ReviewForm';

const OrderItemCard = ({ 
  siparis, 
  getDurumStili, 
  yorumYapilanSiparisler, 
  aktifYorumSiparisId, 
  setAktifYorumSiparisId, 
  puan, 
  setPuan, 
  yorumMetni, 
  setYorumMetni, 
  onYorumGonder 
}) => {
  return (
    <div className="siparis-kart">
      <div className="siparis-kart-header">
        <div>
          <h3>{siparis.restoran_adi}</h3>
          <small>Sipariş ID: #{siparis.id.substring(0, 8)}</small>
        </div>
        <span className="durum-etiket" style={getDurumStili(siparis.durum)}>
          ● {siparis.durum}
        </span>
      </div>
      
      <div className="siparis-kart-icerik">
        {siparis.urunler?.map((urun, index) => (
          <p key={index}>• {urun.yemek_adi} <strong>x {urun.adet}</strong></p>
        ))}
      </div>
      <hr />
      <div className="siparis-kart-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span><strong>Adres:</strong> {siparis.teslimat_adresi}</span>
        <span className="toplam-fiyat">Toplam: {siparis.toplam_tutar} TL</span>
      </div>

      
      {siparis.durum === "Teslim Edildi" && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1' }}>
          {yorumYapilanSiparisler.includes(siparis.id) ? (
            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}>✓ Bu siparişi zaten değerlendirdiniz.</span>
          ) : aktifYorumSiparisId !== siparis.id ? (
            <button 
              onClick={() => setAktifYorumSiparisId(siparis.id)} 
              style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              ⭐ Restoranı Değerlendir
            </button>
          ) : (
            <ReviewForm 
              puan={puan}
              setPuan={setPuan}
              yorumMetni={yorumMetni}
              setYorumMetni={setYorumMetni}
              onSubmit={(e) => onYorumGonder(e, siparis)}
              onCancel={() => setAktifYorumSiparisId(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OrderItemCard;