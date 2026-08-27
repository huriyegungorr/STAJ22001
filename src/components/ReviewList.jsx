import React from 'react';

const ReviewList = ({ yorumlar }) => {
  return (
    <div className="yorumlar-section" style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#1e293b', marginBottom: '16px' }}>💬 Müşteri Yorumları ({yorumlar.length})</h3>
      {yorumlar.length === 0 ? (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Bu restorana henüz yorum yapılmamış.</p>
      ) : (
        yorumlar.map((y, index) => (
          <div key={index} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ color: '#1e293b', fontSize: '0.95rem' }}>{y.kullanici_email || 'Misafir Müşteri'}</strong>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{y.tarih || ''}</span>
            </div>
            <div style={{ color: '#f59e0b', marginBottom: '8px', fontSize: '1rem' }}>
              {"⭐".repeat(Number(y.puan) || 5)}
            </div>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: '1.4' }}>{y.yorum_metni}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;