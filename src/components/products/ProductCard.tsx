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
  
  // Добавяме локален стейт, за да проследяваме кога е натиснат бутонът
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // 1. Добавяме в глобалния стейт (количката)
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    
    // 2. Показваме глобалното съобщение (Toast) долу вдясно
    showToast(`${product.name} е добавен в количката`);

    // 3. Задействаме локалната анимация на бутона
    setIsAdded(true);
    
    // Връщаме бутона в нормално състояние след 2 секунди
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group bg-white rounded-2xl border border-ink/10 shadow-sm p-4 hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-teal/5 mb-4">
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

        {/* Анимиран бутон за добавяне */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded} // Предотвратява спамене на кликове докато трае анимацията
          className={`absolute bottom-3 right-3 text-xs px-4 py-2 rounded-full flex items-center justify-center min-w-[90px] shadow-sm transition-all duration-300
            ${isAdded 
              ? 'bg-teal text-paper opacity-100' // Когато е добавено: синьо и винаги видимо
              : 'bg-ink text-paper opacity-0 group-hover:opacity-100 hover:scale-105 hover:shadow-md' // По подразбиране: тъмно и видимо само на hover
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
      <h3 className="font-display text-lg text-ink mt-1 truncate">{product.name}</h3>
      <p className="text-sm font-semibold text-ink/70 mt-1">{product.price.toFixed(2)} лв.</p>
    </div>
  );
}