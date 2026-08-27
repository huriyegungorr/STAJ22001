import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div className="restaurant-card">
      <div 
        className="restaurant-image-wrapper" 
        style={{ height: '150px', overflow: 'hidden', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {restaurant.logo_url && (
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.restoran_adi} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="restaurant-info">
        <h4>{restaurant.restoran_adi}</h4>
        <p className="restaurant-category">{restaurant.kategori}</p>
        <div className="restaurant-meta">
          <span className="rating">⭐ {restaurant.rating || "0.0"}</span>
          <span className="time">⏱️ {restaurant.time || "20-30 dk"}</span>
        </div>
        <div className="restaurant-footer">
          <span className="min-order">Min. Tutar: {restaurant.min_order} TL</span>
          <button 
            className="view-menu-btn"
            onClick={() => navigate(`/restoran/${restaurant.id}`)}
          >
            Menüyü Gör
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;