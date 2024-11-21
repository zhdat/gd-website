"use client";

import {ChevronRight, Star, Clock, Award} from 'lucide-react';
import {useEffect, useState} from "react";
import type {Product} from "@/app/types";
import {fetchProducts} from "@/app/data/products";
import {supabaseUrl} from "@/app/lib/supabase";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

function Page() {
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

  return (
    <>
      <Navbar/>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80"
              alt="Artisan Pastries"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Artisan Pâtisserie</h1>
            <p className="text-xl md:text-2xl mb-8">Des créations uniques, faites avec passion</p>
            <Link
              href="/Products"
              className="inline-flex items-center bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
            >
              Découvrir nos produits
              <ChevronRight className="ml-2 h-5 w-5"/>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-amber-600"/>
                <h3 className="text-xl font-semibold mb-2">Qualité Premium</h3>
                <p className="text-gray-600">Ingrédients soigneusement sélectionnés pour des saveurs
                  exceptionnelles</p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-amber-600"/>
                <h3 className="text-xl font-semibold mb-2">Fait sur Commande</h3>
                <p className="text-gray-600">Chaque pâtisserie est préparée spécialement pour
                  vous</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-amber-600"/>
                <h3 className="text-xl font-semibold mb-2">Artisanat</h3>
                <p className="text-gray-600">Un savoir-faire traditionnel transmis avec passion</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Créations Phares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product, index) => (
                <div key={index}
                     className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src={`${supabaseUrl}/storage/v1/object/public/pictures/${product.picture}`}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600">{product.price}€</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/Products"
                className="inline-flex items-center bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors"
              >
                Voir tous nos produits
                <ChevronRight className="ml-2 h-5 w-5"/>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  );
}

export default Page;