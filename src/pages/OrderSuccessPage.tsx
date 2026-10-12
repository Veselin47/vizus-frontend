import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-green-600 text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold mb-2">Плащането е успешно!</h1>
      <p className="text-gray-600 mb-6">
        Поръчка №{orderId} беше приета. Ще получиш потвърждение по имейл.
      </p>
      <Link to="/optic" className="text-blue-600 hover:underline">
        Продължи с пазаруването
      </Link>
    </div>
  );
}