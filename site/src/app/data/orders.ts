import type { Order } from '../types';
import { supabase } from '../lib/supabase';

export const fetchOrders = async (): Promise<Order[]> => {
    try {
        const { data, error } = await supabase
            .from('Orders')
            .select('*');

        if (error) {
            console.error('Erreur lors de la récupération des commandes :', error.message);
            return [];
        }

        return data as Order[];
    } catch (err) {
        console.error('Erreur inattendue :', err);
        return [];
    }
};
