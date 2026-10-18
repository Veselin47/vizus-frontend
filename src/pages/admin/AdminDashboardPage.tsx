import { Link } from 'react-router-dom';

const adminSections = [
  { title: 'Продукти', description: 'Добавяне на нови продукти в оптиката', path: '/admin/products' },
  { title: 'Поръчки', description: 'Преглед на поръчките и доставките', path: '/admin/orders' },
  { title: 'Категории', description: 'Управление на категории продукти', path: '/admin/categories' },
  { title: 'Лекари', description: 'Добавяне на лекари и работно време', path: '/admin/doctors' },
  { title: 'Записани часове', description: 'Преглед и отказване на резервации', path: '/admin/appointments' },
];

export function AdminDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Admin панел</h1>
      <p className="text-ink/50 mt-2">Управление на съдържанието на сайта.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {adminSections.map((section) => (
          <Link
            key={section.path}
            to={section.path}
            className="bg-white border border-ink/10 rounded-2xl p-6 hover:border-teal hover:shadow-sm transition-all"
          >
            <h2 className="font-display text-xl text-ink">{section.title}</h2>
            <p className="text-sm text-ink/50 mt-2">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}