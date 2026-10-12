import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDoctors, getAvailableSlots, createAppointment } from '../api/appointments';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { API_BASE_URL } from '../api/axiosClient';

export function BookingPage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [patientPhone, setPatientPhone] = useState('');

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const doctorsQuery = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });

  const slotsQuery = useQuery({
    queryKey: ['available-slots', selectedDoctorId, selectedDate],
    queryFn: () => getAvailableSlots(selectedDoctorId!, selectedDate),
    enabled: selectedDoctorId !== null && selectedDate !== '',
  });

  const bookingMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      setSelectedSlot(null);
      showToast('Заявката е приета! Провери имейла си и потвърди часа.');
    },
  });

  function handleBook() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedDoctorId || !selectedSlot) return;
    bookingMutation.mutate({ doctorId: selectedDoctorId, startTime: selectedSlot, patientPhone });
  }

  const doctors = doctorsQuery.data ?? [];
  const slots = slotsQuery.data ?? [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Запази час</h1>
      <p className="text-ink/50 mt-2">Избери лекар, дата и удобен за теб час.</p>

      <div className="mt-10 space-y-8">
        {/* Стъпка 1 — лекар */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-ink text-paper text-xs font-medium">
              1
            </span>
            <label className="text-sm text-ink/70">Избери лекар</label>
          </div>

          {doctorsQuery.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-ink/8 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {doctors.map((doctor) => {
                const isSelected = selectedDoctorId === doctor.id;
                return (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => {
                      setSelectedDoctorId(doctor.id);
                      setSelectedSlot(null);
                    }}
                    className={`flex flex-col items-center text-center gap-2 p-4 rounded-xl border transition-colors ${isSelected ? 'border-ink bg-ink/5' : 'border-ink/15 bg-white hover:border-teal'
                      }`}
                  >
                    {doctor.imageUrl ? (
                      <img
                        src={`${API_BASE_URL}${doctor.imageUrl}`}
                        alt={doctor.fullName}
                        className="h-14 w-14 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-teal/15 flex items-center justify-center text-teal text-lg font-display">
                        {doctor.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-ink">{doctor.fullName}</p>
                      <p className="text-xs text-ink/50">{doctor.specialty}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {/* Стъпка 2 — дата */}
        <div className={selectedDoctorId ? '' : 'opacity-40 pointer-events-none'}>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-ink text-paper text-xs font-medium">
              2
            </span>
            <label className="text-sm text-ink/70">Избери дата</label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white focus:border-teal focus:outline-none transition-colors"
          />
        </div>

        {/* Стъпка 3 — час */}
        <AnimatePresence>
          {selectedDoctorId && selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-ink text-paper text-xs font-medium">
                  3
                </span>
                <label className="text-sm text-ink/70">Избери час</label>
              </div>

              {slotsQuery.isLoading && (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 bg-ink/8 rounded-full animate-pulse" />
                  ))}
                </div>
              )}
              {slotsQuery.data && slots.length === 0 && (
                <p className="text-ink/40 text-sm">Няма свободни часове за тази дата.</p>
              )}

              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const time = new Date(slot.start).toLocaleTimeString('bg-BG', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const isSelected = selectedSlot === slot.start;

                  return (
                    <button
                      key={slot.start}
                      onClick={() => setSelectedSlot(slot.start)}
                      className={`py-2.5 rounded-full text-sm border transition-colors ${isSelected
                        ? 'bg-ink text-paper border-ink'
                        : 'bg-white text-ink/70 border-ink/15 hover:border-teal'
                        }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {selectedSlot && (
          <div>
            <label className="block text-sm text-ink/60 mb-1.5">Телефон за връзка</label>
            <input
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="08XXXXXXXX"
              className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white focus:border-teal focus:outline-none transition-colors"
            />
          </div>
        )}
        <AnimatePresence>
          {selectedSlot && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={handleBook}
              disabled={bookingMutation.isPending || patientPhone.trim().length < 7}
              className="w-full bg-ink text-paper py-3.5 rounded-full text-sm hover:bg-teal transition-colors disabled:opacity-50"
            >
              {bookingMutation.isPending ? 'Запазване...' : 'Потвърди резервацията'}
            </motion.button>
          )}
        </AnimatePresence>

        {bookingMutation.isError && (
          <p className="text-red-600 text-sm">
            Часът вече не е свободен или възникна грешка. Опитай друг час.
          </p>
        )}
      </div>
    </div>
  );
}