import type { Product } from '../types';
import {supabaseUrl} from "@/app/lib/supabase";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64">
        <Image
          src={`${supabaseUrl}/storage/v1/object/public/pictures/${product.picture}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white font-semibold text-lg">{product.name}</p>
          <p className="text-white/90">{product.price.toFixed(2)}€</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <button
          onClick={() => onSelect(product)}
          className="btn w-full"
        >
          Commander
        </button>
      </div>
    </div>
  );
}

export default ProductCard;