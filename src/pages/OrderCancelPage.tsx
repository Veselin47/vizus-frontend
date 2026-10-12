import { Link } from 'react-router-dom';

export function OrderCancelPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Плащането беше отказано</h1>
      <p className="text-gray-600 mb-6">Количката ти е запазена, можеш да опиташ отново.</p>
      <Link to="/cart" className="text-blue-600 hover:underline">
        Обратно към количката
      </Link>
    </div>
  );
}