import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { createOrder } from '../api/orders';
import { getEcontCities, getEcontOffices } from '../api/shipping';
import type { DeliveryType } from '../types/Shipping';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const { isAuthenticated, email } = useAuthStore();
  const navigate = useNavigate();

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState(email ?? '');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Pickup');

  const [citySearch, setCitySearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedOfficeCode, setSelectedOfficeCode] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (items.length === 0) navigate('/cart');
  }, [isAuthenticated, items.length, navigate]);

  const debouncedCitySearch = useDebouncedValue(citySearch.trim(), 300);

  const citiesQuery = useQuery({
    queryKey: ['econt-cities', debouncedCitySearch],
    queryFn: () => getEcontCities(debouncedCitySearch),
    enabled:
      debouncedCitySearch.length >= 2 && deliveryType === 'EcontOffice' && selectedCityId === null,
  });

  const officesQuery = useQuery({
    queryKey: ['econt-offices', selectedCityId],
    queryFn: () => getEcontOffices(selectedCityId!),
    enabled: selectedCityId !== null,
  });

  const checkoutMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const selectedOffice = officesQuery.data?.find((o) => o.code === selectedOfficeCode);

    checkoutMutation.mutate({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      recipientName,
      recipientPhone,
      recipientEmail,
      deliveryType,
      econtOfficeCode: deliveryType === 'EcontOffice' ? selectedOfficeCode : null,
      econtOfficeName: deliveryType === 'EcontOffice' ? selectedOffice?.name ?? null : null,
      deliveryAddress: deliveryType === 'EcontAddress' ? deliveryAddress : null,
    });
  }

  const inputClass =
    'w-full border border-ink/20 rounded-lg px-3.5 py-2.5 bg-white focus:border-teal focus:outline-none transition-colors';

  const isDeliveryValid =
    deliveryType === 'Pickup' ||
    (deliveryType === 'EcontOffice' && selectedOfficeCode !== null) ||
    (deliveryType === 'EcontAddress' && deliveryAddress.trim().length > 5);

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">Данни за доставка</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg text-ink">Контакти</h2>

          <div>
            <label className="block text-sm text-ink/60 mb-1.5">Име за получаване</label>
            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-ink/60 mb-1.5">Телефон</label>
            <input
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
              placeholder="08XXXXXXXX"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-ink/60 mb-1.5">Имейл</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg text-ink">Начин на доставка</h2>

          <div className="space-y-2">
            {[
              { value: 'Pickup' as const, label: 'Вземане от клиниката' },
              { value: 'EcontOffice' as const, label: 'Еконт офис / автомат' },
              { value: 'EcontAddress' as const, label: 'Еконт до адрес' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${deliveryType === option.value ? 'border-teal bg-teal/5' : 'border-ink/15'
                  }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === option.value}
                  onChange={() => {
                    setDeliveryType(option.value);
                    setSelectedCityId(null);
                    setSelectedOfficeCode(null);
                  }}
                  className="accent-teal"
                />
                <span className="text-sm text-ink">{option.label}</span>
              </label>
            ))}
          </div>

          {deliveryType === 'EcontOffice' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm text-ink/60 mb-1.5">Търси град</label>
                <input
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setSelectedCityId(null);
                    setSelectedOfficeCode(null);
                  }}
                  placeholder="напр. София"
                  className={inputClass}
                />
                {citiesQuery.isFetching && <p className="text-sm text-ink/40">Търсене...</p>}

                {citiesQuery.data?.length === 0 && !citiesQuery.isFetching && selectedCityId === null && (
                  <p className="text-sm text-ink/40">Няма намерени градове.</p>
                )}
              </div>

              {citiesQuery.data && citiesQuery.data.length > 0 && selectedCityId === null && (
                <div className="border border-ink/10 rounded-lg divide-y divide-ink/10 max-h-40 overflow-y-auto">
                  {citiesQuery.data.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        setSelectedCityId(city.id);
                        setCitySearch(city.name);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm hover:bg-teal/5 transition-colors"
                    >
                      {city.name} ({city.postCode})
                    </button>
                  ))}
                </div>
              )}

              {selectedCityId !== null && (
                <div>
                  <label className="block text-sm text-ink/60 mb-1.5">Избери офис</label>
                  {officesQuery.isLoading && <p className="text-sm text-ink/40">Зареждане...</p>}
                  <select
                    value={selectedOfficeCode ?? ''}
                    onChange={(e) => setSelectedOfficeCode(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">-- Избери офис --</option>
                    {officesQuery.data?.map((office) => (
                      <option key={office.code} value={office.code}>
                        {office.name} — {office.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {deliveryType === 'EcontAddress' && (
            <div className="pt-2">
              <label className="block text-sm text-ink/60 mb-1.5">Пълен адрес за доставка</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                placeholder="Град, улица, номер, етаж, апартамент..."
                className={inputClass}
              />
            </div>
          )}
        </div>

        {checkoutMutation.isError && (
          <p className="text-red-600 text-sm">Грешка при създаване на поръчката. Опитай отново.</p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-paper/50 border border-ink/5 rounded-2xl p-5">
          <span className="font-display text-xl text-ink">{totalPrice().toFixed(2)} €</span>
          <button
            type="submit"
            disabled={checkoutMutation.isPending || !isDeliveryValid}
            className="bg-ink text-paper px-7 py-3 rounded-full text-sm hover:bg-teal transition-colors disabled:opacity-50"
          >
            {checkoutMutation.isPending ? 'Пренасочване...' : 'Към плащане'}
          </button>
        </div>
      </form>
    </div>
  );
}