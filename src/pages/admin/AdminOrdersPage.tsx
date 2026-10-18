import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import { useToastStore } from '../../store/toastStore';

const statusLabels: Record<string, { label: string; className: string }> = {
  Pending: { label: 'Неплатена', className: 'bg-ink/10 text-ink/50' },
  Paid: { label: 'Нова (платена)', className: 'bg-lens/20 text-ink' },
  Shipped: { label: 'Изпратена', className: 'bg-teal/20 text-teal' },
  Completed: { label: 'Завършена', className: 'bg-ink/10 text-ink/60' },
  Cancelled: { label: 'Отказана', className: 'bg-red-50 text-red-600' },
};

const tabs = [
  { key: 'Paid', label: 'Нови' },
  { key: 'Shipped', label: 'Изпратени' },
  { key: 'Completed', label: 'Завършени' },
  { key: 'Cancelled', label: 'Отказани' },
  { key: 'Pending', label: 'Неплатени' },
  { key: 'all', label: 'Всички' },
];

const deliveryLabels: Record<string, string> = {
  Pickup: 'Вземане от клиниката',
  EcontOffice: 'Еконт офис',
  EcontAddress: 'Еконт до адрес',
};

// Датите от базата са в UTC, но идват без "Z" и браузърът ги чете като локални
function toDate(value: string) {
  return new Date(value.endsWith('Z') ? value : `${value}Z`);
}

export function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('Paid');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const ordersQuery = useQuery({ queryKey: ['admin-orders'], queryFn: getAllOrders });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: number; status: string }) => updateOrderStatus(vars.id, vars.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      showToast('Статусът е обновен.');
    },
  });

  const all = ordersQuery.data ?? [];
  const term = search.trim().toLowerCase();
  const termDigits = term.replace(/\D/g, '');

  const filtered = all.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (!term) return true;

    const text = [`#${o.id}`, o.recipientName, o.recipientEmail, o.recipientPhone].join(' ').toLowerCase();
    const phoneMatch = termDigits.length >= 3 && o.recipientPhone.replace(/\D/g, '').includes(termDigits);
    return text.includes(term) || phoneMatch;
  });

  function countFor(key: string) {
    return key === 'all' ? all.length : all.filter((o) => o.status === key).length;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">Поръчки</h1>

      <div className="bg-white border border-ink/10 rounded-2xl p-5 space-y-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Търси по номер, име, имейл или телефон..."
          className="w-full border border-ink/20 rounded-lg px-3.5 py-2 bg-white text-sm focus:border-teal focus:outline-none transition-colors"
        />

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                statusFilter === tab.key
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-white text-ink/70 border-ink/20 hover:border-teal'
              }`}
            >
              {tab.label} <span className="opacity-60">({countFor(tab.key)})</span>
            </button>
          ))}
        </div>
      </div>

      {ordersQuery.isLoading && <p className="text-ink/40 text-sm">Зареждане...</p>}

      {!ordersQuery.isLoading && filtered.length === 0 && (
        <p className="text-ink/40 text-sm py-6">Няма поръчки, които отговарят на филтъра.</p>
      )}

      <div className="space-y-3">
        {filtered.map((order) => {
          const statusInfo = statusLabels[order.status] ?? {
            label: order.status,
            className: 'bg-ink/10 text-ink/60',
          };
          const isOpen = expandedId === order.id;
          const date = toDate(order.createdAt).toLocaleString('bg-BG', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={order.id} className="bg-white border border-ink/10 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : order.id)}
                  className="text-left flex-1 min-w-0"
                >
                  <p className="text-ink font-medium">
                    №{order.id} · {order.recipientName}
                  </p>
                  <p className="text-sm text-ink/50">
                    {date} · {order.totalAmount.toFixed(2)} € ·{' '}
                    {deliveryLabels[order.deliveryType] ?? order.deliveryType}
                  </p>
                </button>

                <select
                  value={order.status}
                  onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer ${statusInfo.className}`}
                >
                  <option value="Pending" disabled>
                    Неплатена
                  </option>
                  <option value="Paid">Нова (платена)</option>
                  <option value="Shipped">Изпратена</option>
                  <option value="Completed">Завършена</option>
                  <option value="Cancelled">Отказана</option>
                </select>
              </div>

              {isOpen && (
                <div className="border-t border-ink/10 p-4 space-y-4 text-sm">
                  <div>
                    <p className="text-ink/40 text-xs uppercase tracking-wide mb-2">Продукти</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between py-1">
                        <span className="text-ink">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="text-ink/70">{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-1 border-t border-ink/10 font-medium text-ink">
                      <span>Общо</span>
                      <span>{order.totalAmount.toFixed(2)} €</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-ink/40 text-xs uppercase tracking-wide mb-2">Доставка</p>
                    <p className="text-ink">{deliveryLabels[order.deliveryType] ?? order.deliveryType}</p>
                    {order.econtOfficeName && <p className="text-ink/70">{order.econtOfficeName}</p>}
                    {order.deliveryAddress && <p className="text-ink/70">{order.deliveryAddress}</p>}
                  </div>

                  <div>
                    <p className="text-ink/40 text-xs uppercase tracking-wide mb-2">Контакти</p>
                    <p className="text-ink">{order.recipientName}</p>
                    <p>
                      <a href={`tel:${order.recipientPhone}`} className="text-teal hover:text-ink transition-colors">
                        {order.recipientPhone}
                      </a>
                    </p>
                    <p>
                      <a href={`mailto:${order.recipientEmail}`} className="text-teal hover:text-ink transition-colors">
                        {order.recipientEmail}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}