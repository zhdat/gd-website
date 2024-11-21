"use client";

import {useEffect, useState} from 'react';
import {Package2, ShoppingBag, Users, Settings} from 'lucide-react';
import {fetchProducts} from "@/app/data/products";
import {fetchOrders} from "@/app/data/orders";
import {supabase, supabaseUrl} from "@/app/lib/supabase";
import StatusModal from "@/app/components/StatusModal";
import EditProductModal from "@/app/components/ProductModal";
import {Order, Product} from "@/app/types";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type Tab = 'products' | 'orders' | 'customers' | 'settings' | 'orderDetails';

function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  const [products, setProducts] = useState<Product[]>([])
  const [, setLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProducts();
      const fetchedOrders = await fetchOrders();
      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
      setLoading(false)
    }
    load().catch(error => console.error('Failed to load products and orders:', error));
  }, [products, orders]);

  const tabs = [
    {id: 'orders' as Tab, name: 'Commandes', icon: ShoppingBag},
    {id: 'products' as Tab, name: 'Produits', icon: Package2},
    {id: 'customers' as Tab, name: 'Clients', icon: Users},
    {id: 'settings' as Tab, name: 'Paramètres', icon: Settings},
    {id: 'orderDetails' as Tab, name: 'Détail de la commande', icon: ShoppingBag},
  ];

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveTab('orderDetails');
  };

  const handleSaveStatus = async (newStatus: string) => {
    if (selectedOrder) {
      const updatedOrder = {...selectedOrder, status: newStatus};
      const {error} = await supabase
        .from('Orders')
        .update({status: newStatus})
        .eq('id', selectedOrder.id);

      if (error) {
        console.error('Erreur lors de la mise à jour de la commande :', error.message);
      } else {
        setOrders((orders) =>
          orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
        );
      }
    }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg h-screen fixed">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">Administration</h2>
            </div>
            <nav className="mt-4">
              {tabs.map(({id, name, icon: Icon}) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3"/>
                  {name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64 p-8">
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Commandes
                    récentes</h1>
                  <div className="flex gap-4">
                    <select className="input">
                      <option>Tous les statuts</option>
                      <option>En attente</option>
                      <option>Confirmé</option>
                      <option>Terminé</option>
                    </select>
                    <button className="btn-secondary">
                      Exporter
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Articles
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.firstname + " " + order.lastname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(order.content as unknown as never[]).length} articles
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total_price.toFixed(2)}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                            {order.status === 'pending' && 'En attente'}
                            {order.status === 'confirmed' && 'Confirmé'}
                            {order.status === 'completed' && 'Terminé'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-amber-600 hover:text-amber-900 mr-3"
                            onClick={() => handleViewOrder(order)}
                          >
                            Voir
                          </button>
                          <button
                            className="text-amber-600 hover:text-amber-900"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsStatusModalOpen(true);
                            }}
                          >
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                  <StatusModal
                    isOpen={isStatusModalOpen}
                    currentStatus={selectedOrder?.status || ''}
                    onClose={() => setIsStatusModalOpen(false)}
                    onSave={handleSaveStatus}
                  />
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <>
                <div className={"z-0"}>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des
                      produits</h1>
                    <button className="btn" onClick={() => {
                      console.log("ajouter");
                      setIsAddModalOpen(true)
                      console.log(isAddModalOpen);
                    }}>
                      Ajouter un produit
                    </button>
                    <EditProductModal
                      isOpen={isAddModalOpen}
                      product={selectedProduct || {
                        id: '',
                        name: '',
                        description: '',
                        price: 0,
                        category: '',
                        picture: ''
                      }}
                      onClose={() => {
                        setIsAddModalOpen(false);
                        setSelectedProduct(null);
                      }}
                      onSave={(updatedProduct) => {
                        setProducts((products) =>
                          products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                        );
                        if (!selectedProduct) {
                          setProducts((products) => [...products, updatedProduct]);
                        }
                        setIsAddModalOpen(false);
                        setSelectedProduct(null);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id}
                           className="bg-white rounded-lg shadow p-6">
                        <img
                          src={`${supabaseUrl}/storage/v1/object/public/pictures/${product.picture}`}
                          alt={product.name}
                          className="w-full h-48 object-contain rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                                            <span
                                              className="font-semibold">{product.price.toFixed(2)}€</span>
                          <div className="space-x-2">
                            <button className="btn-secondary" onClick={() => {
                              setSelectedProduct(product);
                              setIsEditModalOpen(true);
                            }}>Modifier
                            </button>
                            <button
                              className="btn-secondary text-red-600"
                              onClick={async () => {
                                const {error} = await supabase
                                  .from('Products')
                                  .delete()
                                  .eq('id', product.id);

                                if (error) {
                                  console.error('Erreur lors de la suppression du produit :', error.message);
                                }
                                setProducts((products) => products.filter((p) => p.id !== product.id));
                              }
                              }
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isEditModalOpen && (
                      <EditProductModal
                        isOpen={isEditModalOpen}
                        product={selectedProduct}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={(updatedProduct) => {
                          setProducts((products) =>
                            products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
                <Footer/>
              </>
            )}

            {activeTab === 'customers' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des
                  clients</h1>
                {/* Customer management interface will be implemented here */}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>
                {/* Settings interface will be implemented here */}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>
                {/* Settings interface will be implemented here */}
              </div>
            )}

            {activeTab === 'orderDetails' && selectedOrder && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Détail de la
                  commande #{selectedOrder.id}</h1>
                <div className="bg-white rounded-lg shadow p-6">
                  <p>
                    <strong>Client:</strong> {selectedOrder.firstname} {selectedOrder.lastname}
                  </p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Téléphone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Adresse de
                    livraison:</strong> {selectedOrder.delivery_address}</p>
                  <div>
                    <strong>Contenu :</strong>
                    <ul>
                      {(selectedOrder.content as unknown as never[]).map((item: {
                        id: string;
                        name: string;
                        quantity: number;
                        price: number
                      }) => (
                        <li key={item.id}>
                          {item.name} - {item.quantity} x {item.price.toFixed(2)}€
                          soit {selectedOrder.total_price.toFixed(2)}€
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Prix
                    total:</strong> {selectedOrder.total_price.toFixed(2)}€</p>
                  <p><strong>Statut:</strong> {selectedOrder.status}</p>
                  <p><strong>Date:</strong> {selectedOrder.date}</p>
                  <p><strong>Heure:</strong> {selectedOrder.time}</p>
                  <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                  <button className="btn mt-4" onClick={() => {
                    setActiveTab('orders')
                    setSelectedOrder(null)
                  }
                  }>Retour
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}

export default Admin;