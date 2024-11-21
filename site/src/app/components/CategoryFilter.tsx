import React from 'react';
import type { ProductCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
}

function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'all', label: 'Tous les produits' },
    { value: 'patisseries', label: 'Pâtisseries' },
    { value: 'viennoiseries', label: 'Viennoiseries' },
    { value: 'gateaux', label: 'Gâteaux' },
    { value: 'macarons', label: 'Macarons' },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onCategoryChange(value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === value
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;