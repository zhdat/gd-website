"use client";

import React, {useEffect, useState} from 'react';
import {Calendar, Clock, ShoppingBag} from 'lucide-react';
import {supabase, supabaseUrl} from "@/app/lib/supabase";
import {Product} from "@/app/types";
import {fetchProducts} from "@/app/data/products";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";

interface ReservationProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

function Page() {
  const [selectedProducts, setSelectedProducts] = useState<ReservationProduct[]>([]);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    delivery_address: '',
    date: '',
    time: '',
    notes: ''
  })

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

  const handleProductChange = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId));
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === productId);
      if (existing) {
        return prev.map(p => p.id === productId ? {...p, quantity} : p);
      }
      return [...prev, {id: productId, name: product.name, quantity, price: product.price}];
    });
  };

  const total = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reservationData = {
        ...formData,
        content: selectedProducts,
        total_price: total,
        created_at: new Date().toISOString(),
        status: 'En cours'
      };
      const {data, error} = await supabase
        .from('Orders')
        .insert([reservationData]);

      if (error) {
        console.error('Erreur lors de la réservation :', error.message);
        alert("Une erreur est survenue lors de l'enregistrement de la réservation.")
        return;
      }

      console.log('Réservation enregistrée avec succès :', data);
      alert('Réservation soumise avec succès !');
    } catch (error) {
      console.error('Erreur inatendue :', error);
      alert('Une erreur inattendue est survenue.');
    }

    console.log('Reservation submitted:', {formData, selectedProducts, total});
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Réservation</h1>
            <p className="text-lg text-gray-600">
              Commandez vos pâtisseries préférées à l&apos;avance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-2 text-amber-600"/>
                  Sélectionnez vos produits
                </h2>
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id}
                         className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={`${supabaseUrl}/storage/v1/object/public/pictures/${product.picture}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-gray-600">{product.price.toFixed(2)}€</p>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={selectedProducts.find(p => p.id === product.id)?.quantity || 0}
                        onChange={(e) => handleProductChange(product.id, parseInt(e.target.value) || 0)}
                        className="w-20 input"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Détails de la
                  réservation</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        firstname: e.target.value
                      }))}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        lastname: e.target.value
                      }))}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse
                      de livraison</label>
                    <input
                      type="text"
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        delivery_address: e.target.value
                      }))}
                      className="input"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700">Date</label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            date: e.target.value
                          }))}
                          className="input pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700">Heure</label>
                      <div className="relative">
                        <Clock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            time: e.target.value
                          }))}
                          className="input pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes
                      spéciales</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      rows={3}
                      className="input"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{total.toFixed(2)}€</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Le paiement s&apos;effectuera sur place lors du retrait
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn w-full"
                    disabled={selectedProducts.length === 0}
                  >
                    Confirmer la réservation
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Page;