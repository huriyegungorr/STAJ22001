import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "kullanicilar", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const role = userData.rol; 

        alert("Başarıyla giriş yapıldı!");
        
        if (role === 'admin') {
          navigate('/admin-panel'); 
        } else if (role === 'restaurant_owner') {
          navigate('/restoran-panel'); 
        } else {
          navigate('/'); 
        }
      } else {
        alert("Kullanıcı veri profili bulunamadı!"); 
        navigate('/'); 
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş yapılırken bir hata oluştu: " + error.message);
    }
  };

  const handleSifremiUnuttum = async () => {
    if (!email || email.trim() === "") {
      return alert("Şifrenizi sıfırlayabilmemiz için lütfen önce 'E-posta Adresi' alanını doldurun!");
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Şifre sıfırlama bağlantısı "${email}" adresine gönderildi. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol edin! `);
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      alert("Şifre sıfırlama e-postası gönderilirken bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>E-posta Adresi</label>
            <input 
              type="email" 
              placeholder="E-postanızı girin" 
              value={email} 
              required 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input 
              type="password" 
              placeholder="Şifrenizi girin" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '15px' }}>
            <button 
              type="button" 
              onClick={handleSifremiUnuttum}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                padding: '0',
                textDecoration: 'underline'
              }}
              onMouseOver={(e) => e.target.style.color = '#2563eb'}
              onMouseOut={(e) => e.target.style.color = '#3b82f6'}
            >
              Şifremi Unuttum?
            </button>
          </div>

          <button type="submit" className="auth-btn">Giriş Yap</button>
        </form>

        <p className="auth-toggle-text">
          Hesabınız yok mu? 
          <Link to="/register" className="auth-link">Kaydolun</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;