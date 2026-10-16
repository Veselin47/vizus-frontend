import { useState } from 'react';
import type { Product } from '../../types/Product';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import { API_BASE_URL } from '../../api/axiosClient';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    showToast(`${product.name} е добавен в количката`);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group bg-white rounded-2xl border border-ink/10 shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-teal/5 mb-3 sm:mb-4">
        {product.imageUrl ? (
          <img
            src={`${API_BASE_URL}${product.imageUrl}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink/30 text-sm">
            Няма снимка
          </div>
        )}

        {/* Анимиран бутон за добавяне: на тъчскрийн е винаги видим, на устройства с hover - при посочване */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-xs px-3 sm:px-4 py-2.5 sm:py-2 rounded-full flex items-center justify-center min-w-[90px] shadow-sm transition-all duration-300
            ${
              isAdded
                ? 'bg-teal text-paper opacity-100'
                : 'bg-ink text-paper can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:focus-visible:opacity-100 hover:scale-105 hover:shadow-md'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="added"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 font-medium"
              >
                <Check size={14} strokeWidth={3} />
                Добавено
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingBag size={14} />
                Добави
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <span className="text-xs text-teal font-medium uppercase tracking-wider">{product.categoryName}</span>
      <h3 className="font-display text-base sm:text-lg text-ink mt-1 truncate">{product.name}</h3>
      <p className="text-sm font-semibold text-ink/70 mt-1">{product.price.toFixed(2)} €</p>
    </div>
  );
}