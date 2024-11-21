"use client";

import {useEffect, useState} from 'react';
import {fetchProducts} from "@/app/data/products";
import {supabaseUrl} from "@/app/lib/supabase";
import {Product, ProductCategory} from "@/app/types";
import CategoryFilter from "@/app/components/CategoryFilter";
import ProductCard from "@/app/components/ProductCard";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";

function Page() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([])
  const [, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setLoading(false)
    }
    loadProducts().catch(error => console.error('Failed to load products:', error));
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  console.log(filteredProducts);

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Créations</h1>
            <p className="text-lg text-gray-600">
              Découvrez notre sélection de pâtisseries artisanales, préparées chaque jour avec
              passion
            </p>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>

          {/* Product Modal */}
          {selectedProduct && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-lg w-full p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                <Image
                  src={`${supabaseUrl}/storage/v1/object/public/pictures/${selectedProduct.picture}`}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">{selectedProduct.price.toFixed(2)}€</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      window.location.href = '/reservation';
                    }}
                    className="btn"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Page;