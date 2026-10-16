import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { getImageUrl } from '../utils/getImageUrl';

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  }

  function handleIncrement(productId: number, currentQuantity: number) {
    updateQuantity(productId, currentQuantity + 1);
  }

  function handleDecrement(productId: number, currentQuantity: number) {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 sm:py-24 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-ink/5 rounded-full flex items-center justify-center mb-6 text-ink/20">
          <Trash2 size={32} />
        </div>
        <h1 className="font-display text-3xl text-ink">Количката е празна</h1>
        <p className="text-ink/60 mt-2">Все още не сте добавили продукти.</p>
        <Link
          to="/optic"
          className="inline-block mt-8 bg-ink text-paper px-7 py-3 rounded-full text-sm hover:bg-teal transition-colors"
        >
          Разгледай оптиката
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="font-display text-3xl text-ink">Количка</h1>
        <Link to="/optic" className="text-sm text-teal flex items-center gap-2 hover:text-ink transition-colors">
          <ArrowLeft size={16} /> Продължи пазаруването
        </Link>
      </div>

      <div className="divide-y divide-ink/10 border-t border-ink/10">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-20 h-20 bg-ink/5 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  <img src={getImageUrl(item.imageUrl) ?? ''} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-ink/20" size={24} />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-ink font-medium break-words">{item.name}</h3>
                <p className="text-sm text-teal font-semibold mt-1">{item.price.toFixed(2)} €</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center border border-ink/20 rounded-full bg-white">
                <button
                  onClick={() => handleDecrement(item.productId, item.quantity)}
                  className="w-11 h-11 flex items-center justify-center text-ink/50 hover:text-ink transition-colors disabled:opacity-30"
                  disabled={item.quantity <= 1}
                  aria-label="Намали количеството"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleIncrement(item.productId, item.quantity)}
                  className="w-11 h-11 flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
                  aria-label="Увеличи количеството"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                className="w-11 h-11 flex items-center justify-center text-ink/40 hover:text-red-500 bg-red-500/0 hover:bg-red-500/10 rounded-full transition-all"
                title="Премахни продукт"
                aria-label="Премахни продукт"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-paper/50 rounded-3xl p-6 md:p-8 border border-ink/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-ink/60 mb-1">Обща сума</p>
          <span className="font-display text-3xl text-ink">{totalPrice().toFixed(2)} €</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full md:w-auto bg-ink text-paper px-8 py-4 rounded-full text-sm font-medium hover:bg-teal transition-colors flex items-center justify-center gap-2"
        >
          Към плащане
        </button>
      </div>
    </div>
  );
}