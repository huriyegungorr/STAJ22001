import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState(''); 
  const [role, setRole] = useState('customer'); 

  const handleRegister = async (e) => {
    e.preventDefault();

    
    if (phone.length !== 11) {
      return alert("Lütfen telefon numaranızı başında sıfır olacak şekilde 11 haneli olarak giriniz! (Örn: 05321234567)");
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

     
      await setDoc(doc(db, "kullanicilar", user.uid), {
        kullanici_id: user.uid,
        kullanici_adi: username,
        eposta: email,
        telefon: phone, 
        rol: role, 
        adres: "", 
        kayit_tarihi: new Date()
      });

      alert("Kayıt başarıyla tamamlandı!");

      
      if (role === 'restaurant_owner') {
        navigate('/restoran-kayit'); 
      } else {
        navigate('/'); 
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kayıt olurken bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleRegister} className="auth-form">
          
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input 
              type="text" 
              placeholder="Kullanıcı adınızı girin" 
              required 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>E-posta Adresi</label>
            <input 
              type="email" 
              placeholder="E-postanızı girin" 
              required 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

        
          <div className="form-group">
            <label>Telefon Numarası</label>
            <input 
              type="tel" 
              placeholder="Örn: 05XXXXXXXXX" 
              maxLength="11" 
              value={phone}
              required 
              onChange={(e) => {
                
                const sadeceRakam = e.target.value.replace(/[^0-9]/g, '');
                setPhone(sadeceRakam);
              }} 
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input 
              type="password" 
              placeholder="Şifrenizi oluşturun" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

         
          <div className="form-group">
            <label>Üyelik Tipi</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#334155',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="customer">Müşteriyim (Sipariş Vermek İstiyorum)</option>
              <option value="restaurant_owner">Restoran Sahibiyim (Dükkan Açmak İstiyorum)</option>
            </select>
          </div>

          <button type="submit" className="auth-btn">Kayıt Ol</button>
        </form>

        <p className="auth-toggle-text">
          Zaten hesabınız var mı? 
          <Link to="/login" className="auth-link">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;