import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SepetProvider } from './context/SepetContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import RestoranKayitFormu from './pages/RestoranKayitFormu';
import RestoranPanel from './pages/RestoranPanel';
import RestoranDetay from './pages/RestoranDetay';
import MainLayout from './layouts/MainLayout';
import Sepet from './pages/Sepet';
import Odeme from './pages/Odeme';
import Siparislerim from './pages/Siparislerim';
import AdminPanel from './pages/AdminPanel';
import Profilim from './pages/Profilim';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [secilenSehir, setSecilenSehir] = useState(''); 
  const [secilenIlce, setSecilenIlce] = useState('');

  return (
    <AuthProvider>
      <SepetProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
          
            <Route path="/restoran-kayit" element={<ProtectedRoute><RestoranKayitFormu /></ProtectedRoute>} />
            <Route path="/restoran-panel" element={<ProtectedRoute allowedRoles={['restaurant_owner']}><RestoranPanel /></ProtectedRoute>} />  
            <Route path="/admin-panel" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />

            <Route element={
              <MainLayout 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                secilenSehir={secilenSehir}
                setSecilenSehir={setSecilenSehir}
                secilenIlce={secilenIlce} 
                setSecilenIlce={setSecilenIlce} 
              />
            }>
              <Route path="/" element={<Home searchTerm={searchTerm} secilenIlce={secilenIlce} />} />
              <Route path="restoran/:id" element={<RestoranDetay />} />
              <Route path="sepet" element={<Sepet />} />

              <Route path="odeme" element={<ProtectedRoute><Odeme /></ProtectedRoute>} />
              <Route path="siparislerim" element={<ProtectedRoute><Siparislerim /></ProtectedRoute>} />
              <Route path="profilim" element={<ProtectedRoute><Profilim /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </SepetProvider>
    </AuthProvider>
  );
}

export default App;