import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '../../store/toastStore';
import { getAllAppointments, cancelAppointment, updateAppointmentStatus } from '../../api/appointments';

const PAGE_SIZE = 20;

const statusLabels: Record<string, { label: string; className: string }> = {
  Pending: { label: 'Чакащ', className: 'bg-lens/20 text-ink' },
  Confirmed: { label: 'Потвърден', className: 'bg-teal/20 text-teal' },
  Cancelled: { label: 'Отказан', className: 'bg-ink/10 text-ink/40' },
  Completed: { label: 'Завършен', className: 'bg-ink/10 text-ink/60' },
};

type StatusFilter = 'active' | 'all' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type Period = 'all' | 'today' | 'upcoming' | 'past';

const statusTabs: { key: StatusFilter; label: string }[] = [
  { key: 'active', label: 'Активни' },
  { key: 'Pending', label: 'Чакащи' },
  { key: 'Confirmed', label: 'Потвърдени' },
  { key: 'Completed', label: 'Завършени' },
  { key: 'Cancelled', label: 'Отказани' },
  { key: 'all', label: 'Всички' },
];

const periodTabs: { key: Period; label: string }[] = [
  { key: 'all', label: 'Всички' },
  { key: 'today', label: 'Днес' },
  { key: 'upcoming', label: 'Предстоящи' },
  { key: 'past', label: 'Минали' },
];

export function AdminAppointmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const [date, setDate] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const appointmentsQuery = useQuery({ queryKey: ['admin-appointments'], queryFn: getAllAppointments });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: number; status: string }) => updateAppointmentStatus(vars.id, vars.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      showToast('Статусът е обновен.');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      showToast('Часът е отказан.');
    },
  });

  function handleCancel(id: number) {
    if (confirm('Сигурен ли си, че искаш да откажеш този час?')) {
      cancelMutation.mutate(id);
    }
  }

  // При смяна на филтър започваме отново от първите 20 резултата
  function changeFilter(apply: () => void) {
    apply();
    setVisibleCount(PAGE_SIZE);
  }

  const all = appointmentsQuery.data ?? [];
  const now = new Date();
  const todayStr = now.toLocaleDateString('sv-SE'); // формат yyyy-MM-dd в локалното време
  const term = search.trim().toLowerCase();
  const termDigits = term.replace(/\D/g, '');

  const doctorNames = Array.from(new Set(all.map((a) => a.doctorName))).sort();

  function countFor(key: StatusFilter) {
    if (key === 'all') return all.length;
    if (key === 'active') return all.filter((a) => a.status === 'Pending' || a.status === 'Confirmed').length;
    return all.filter((a) => a.status === key).length;
  }

  const filtered = all.filter((a) => {
    if (statusFilter === 'active' && a.status !== 'Pending' && a.status !== 'Confirmed') return false;
    if (statusFilter !== 'active' && statusFilter !== 'all' && a.status !== statusFilter) return false;

    if (doctorFilter && a.doctorName !== doctorFilter) return false;

    // startTime идва като локално време без часова зона, затова първите 10 символа са датата
    const day = a.startTime.slice(0, 10);
    if (date && day !== date) return false;
    if (period === 'today' && day !== todayStr) return false;
    if (period === 'upcoming' && new Date(a.startTime) < now) return false;
    if (period === 'past' && new Date(a.startTime) >= now) return false;

    if (term) {
      const text = [a.patientEmail, a.patientPhone, a.doctorName].join(' ').toLowerCase();
      const phoneMatch = termDigits.length >= 3 && (a.patientPhone ?? '').replace(/\D/g, '').includes(termDigits);
      if (!text.includes(term) && !phoneMatch) return false;
    }

    return true;
  });

  const ascending = period === 'upcoming' || period === 'today';
  const sorted = [...filtered].sort((a, b) =>
    ascending ? a.startTime.localeCompare(b.startTime) : b.startTime.localeCompare(a.startTime),
  );
  const visible = sorted.slice(0, visibleCount);

  const hasActiveFilters =
    search !== '' || statusFilter !== 'active' || doctorFilter !== '' || period !== 'all' || date !== '';

  function resetFilters() {
    setSearch('');
    setStatusFilter('active');
    setDoctorFilter('');
    setPeriod('all');
    setDate('');
    setVisibleCount(PAGE_SIZE);
  }

  const inputClass =
    'border border-ink/20 rounded-lg px-3.5 py-2 bg-white text-sm focus:border-teal focus:outline-none transition-colors';

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">Записани часове</h1>

      {/* Филтри */}
      <div className="bg-white border border-ink/10 rounded-2xl p-5 space-y-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => changeFilter(() => setSearch(e.target.value))}
          placeholder="Търси по имейл, телефон или лекар..."
          className={`${inputClass} w-full`}
        />

        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => changeFilter(() => setStatusFilter(tab.key))}
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

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={doctorFilter}
            onChange={(e) => changeFilter(() => setDoctorFilter(e.target.value))}
            className={inputClass}
          >
            <option value="">Всички лекари</option>
            {doctorNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="flex gap-1.5">
            {periodTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => changeFilter(() => setPeriod(tab.key))}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  period === tab.key ? 'bg-teal/15 text-teal font-medium' : 'text-ink/60 hover:bg-ink/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => changeFilter(() => setDate(e.target.value))}
            className={inputClass}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-ink/50 hover:text-ink transition-colors ml-auto"
            >
              Изчисти филтрите
            </button>
          )}
        </div>
      </div>

      {appointmentsQuery.isLoading && <p className="text-ink/40 text-sm">Зареждане...</p>}

      {!appointmentsQuery.isLoading && (
        <p className="text-xs text-ink/40 mb-2">
          Показани {visible.length} от {sorted.length} часа
        </p>
      )}

      {sorted.length === 0 && !appointmentsQuery.isLoading && (
        <p className="text-ink/40 text-sm py-6">Няма часове, които отговарят на филтрите.</p>
      )}

      <div className="divide-y divide-ink/10">
        {visible.map((appointment) => {
          const statusInfo = statusLabels[appointment.status] ?? {
            label: appointment.status,
            className: 'bg-ink/10 text-ink/60',
          };
          const dateTime = new Date(appointment.startTime).toLocaleString('bg-BG', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={appointment.id} className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-ink">{appointment.doctorName}</h3>
                <p className="text-sm text-ink/50">
                  {[appointment.patientEmail, appointment.patientPhone, dateTime].filter(Boolean).join(' · ')}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={appointment.status}
                  onChange={(e) => statusMutation.mutate({ id: appointment.id, status: e.target.value })}
                  className={`text-xs px-3 py-1 rounded-full font-medium border-0 cursor-pointer ${statusInfo.className}`}
                >
                  <option value="Pending">Чакащ</option>
                  <option value="Confirmed">Потвърден</option>
                  <option value="Completed">Завършен</option>
                  <option value="Cancelled">Отказан</option>
                </select>
                {appointment.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="text-sm text-ink/40 hover:text-red-600 transition-colors"
                  >
                    Откажи
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visible.length < sorted.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          className="mt-6 w-full border border-ink/20 text-ink/70 py-2.5 rounded-full text-sm hover:border-teal hover:text-teal transition-colors"
        >
          Покажи още ({sorted.length - visible.length})
        </button>
      )}
    </div>
  );
}