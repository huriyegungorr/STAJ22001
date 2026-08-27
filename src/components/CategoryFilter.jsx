import React from 'react';

const CategoryFilter = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <section className="categories-section">
      <h3>Mutfaklar</h3>
      <div className="categories-list">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.isim}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;