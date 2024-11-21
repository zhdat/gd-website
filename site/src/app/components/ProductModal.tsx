import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, product, onClose, onSave }) => {
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(product);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen || !updatedProduct) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!newImageFile) return null;

    const fileName = `${updatedProduct.id}-${new Date().getTime()}.${newImageFile.name.split('.').pop()}`;
    const { error } = await supabase.storage
      .from('pictures')
      .upload(fileName, newImageFile);

    if (error) {
      console.error('Erreur lors de l’upload de l’image :', error.message);
      return null;
    }

    return fileName;
  };

  const handleSave = async () => {
    setUploading(true);

    let newImageName: null | string = updatedProduct.picture;
    if (newImageFile) {
      newImageName = await uploadImage();
      if (!newImageName) {
        setUploading(false);
        return;
      }
    }

    const updatedData = { ...updatedProduct, picture: newImageName };

    if (updatedProduct.id === '') {
      // Ajouter un nouveau produit
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = updatedData;
      const { data, error } = await supabase.from('Products').insert(rest);
      setUploading(false);

      if (error) {
        console.error('Erreur lors de l’ajout du produit :', error.message);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onSave({ ...updatedData, id: data[0].id });
        }
        onClose();
      }
    } else {
      // Mettre à jour un produit existant
      const { error } = await supabase
        .from('Products')
        .update(updatedData)
        .eq('id', updatedProduct.id);

      setUploading(false);

      if (error) {
        console.error('Erreur lors de la mise à jour du produit :', error.message);
      } else {
        onSave(updatedData);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Modifier le produit</h2>
        <input
          className="w-full p-2 border rounded-md mb-2"
          name="name"
          value={updatedProduct.name}
          onChange={handleChange}
          placeholder="Nom"
        />
        <textarea
          className="w-full p-2 border rounded-md mb-2"
          name="description"
          value={updatedProduct.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          className="w-full p-2 border rounded-md mb-2"
          name="price"
          type="number"
          value={updatedProduct.price}
          onChange={handleChange}
          placeholder="Prix"
        />
        <input
          className="w-full p-2 border rounded-md mb-2"
          name="category"
          value={updatedProduct.category}
          onChange={handleChange}
          placeholder="Catégorie"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Changer l’image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border rounded-md"
          />
        </div>
        {uploading && <p className="text-sm text-gray-500">Téléchargement en cours...</p>}
        <div className="flex justify-end mt-4">
          <button className="btn-secondary mr-2 text-red-500" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-secondary" onClick={handleSave}>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;