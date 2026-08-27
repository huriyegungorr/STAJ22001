import React from 'react';

const ReviewForm = ({ 
  puan, 
  setPuan, 
  yorumMetni, 
  setYorumMetni, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <form onSubmit={onSubmit} style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
      <h5 style={{ margin: '0 0 8px 0' }}>Restorana Puan Ver & Yorum Yaz</h5>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <select value={puan} onChange={(e) => setPuan(e.target.value)} style={{ padding: '4px', borderRadius: '4px' }}>
          <option value="5">⭐⭐⭐⭐⭐ 5 Mükemmel</option>
          <option value="4">⭐⭐⭐⭐ 4 Çok İyi</option>
          <option value="3">⭐⭐⭐ 3 Ortalama</option>
          <option value="2">⭐⭐ 2 Kötü</option>
          <option value="1">⭐ 1 Çok Kötü</option>
        </select>
      </div>
      <textarea 
        placeholder="Yemek lezzeti, servis hızı nasıldı? Yorumunuzu yazın..." 
        value={yorumMetni} 
        onChange={(e) => setYorumMetni(e.target.value)} 
        required 
        style={{ width: '100%', height: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px', fontSize: '13px', fontFamily: 'inherit' }} 
      />
      <div style={{ display: 'flex', gap: '6px' }}>
        <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          Gönder
        </button>
        <button type="button" onClick={onCancel} style={{ backgroundColor: '#64748b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
          İptal
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;