import type { Product } from '../types';
import { supabase } from '../lib/supabase';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
        .from('Products')
        .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des produits :', error.message);
      return [];
    }

    return data as Product[];
  } catch (err) {
    console.error('Erreur inattendue :', err);
    return [];
  }
};
