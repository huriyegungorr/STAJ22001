import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import RestaurantCard from '../components/RestaurantCard';
import CategoryFilter from '../components/CategoryFilter';
import './Home.css';

const Home = ({ searchTerm, secilenIlce }) => { 
  const [selectedCategoryId, setSelectedCategoryId] = useState('tum');
  const [restaurants, setRestaurants] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([{ id: 'tum', isim: 'Tümü' }]);

  useEffect(() => {
    const mutfaklariGetir = async () => {
      try {
        const qSnapshot = await getDocs(collection(db, "mutfaklar"));
        const list = qSnapshot.docs.map(doc => ({
          id: doc.id,
          isim: doc.data().isim
        }));
        setCategories([{ id: 'tum', isim: 'Tümü' }, ...list]);
      } catch (error) {
        console.error("Mutfaklar çekilirken hata oluştu:", error);
      }
    };
    mutfaklariGetir();
  }, []);

  useEffect(() => {
    const restoranlariGetir = async () => {
      setLoading(true);
      try {
        const restoranRef = collection(db, "restoranlar");
        let constraints = [where("aktif_mi", "==", true)];

        if (selectedCategoryId !== 'tum') {
          constraints.push(where("mutfak_id", "==", selectedCategoryId));
        }

   
        if (secilenIlce && secilenIlce.trim() !== "") {
          constraints.push(where("teslimat_bolgeleri", "array-contains", secilenIlce));
        }

        const q = query(restoranRef, ...constraints);
        const querySnapshot = await getDocs(q);
        const gelenRestoranlar = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRestaurants(gelenRestoranlar);
      } catch (error) {
        console.error("Restoranlar çekilirken hata oluştu:", error);
      }
      setLoading(false);
    };

    restoranlariGetir();
  }, [selectedCategoryId, secilenIlce]); 

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return restaurant.restoran_adi?.toLowerCase().includes(searchTerm?.toLowerCase() || '');
  });

  return (
    <>
      <CategoryFilter 
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <section className="restaurants-section">
        <h3>
          {secilenIlce ? ` ${secilenIlce} Bölgesindeki Restoranlar` : " Tüm Popüler Restoranlar"} 
          ({filteredRestaurants.length})
        </h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Restoranlar yükleniyor...</div>
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map((res) => (
              <RestaurantCard key={res.id} restaurant={res} />
            ))}
          </div>
        )}

        {!loading && filteredRestaurants.length === 0 && (
          <div className="no-results">Bu kriterlere uygun aktif restoran bulunamadı.</div>
        )}
      </section>
    </>
  );
};

export default Home;