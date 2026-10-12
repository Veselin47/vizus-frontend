import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, type DoctorPayload } from '../../api/appointments';
import { uploadImage } from '../../api/upload';
import { API_BASE_URL } from '../../api/axiosClient';
import type { Doctor } from '../../types/Appointment';
import { useToastStore } from '../../store/toastStore';

const weekDays = [
  { label: 'Пон', value: 1 },
  { label: 'Вт', value: 2 },
  { label: 'Ср', value: 3 },
  { label: 'Чет', value: 4 },
  { label: 'Пет', value: 5 },
  { label: 'Съб', value: 6 },
  { label: 'Нед', value: 0 },
];

export function AdminDoctorsPage() {
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const doctorsQuery = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });

  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      resetForm();
      showToast('Лекарят е добавен успешно!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; data: DoctorPayload }) => updateDoctor(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      resetForm();
      showToast('Промените са запазени!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      showToast('Лекарят е премахнат.');
    },
  });

  function toggleDay(day: number) {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch {
      alert('Качването неуспешно.');
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFullName('');
    setSpecialty('');
    setWorkStart('09:00');
    setWorkEnd('17:00');
    setSelectedDays([1, 2, 3, 4, 5]);
    setImageUrl(null);
    setBio('');
    setYearsOfExperience('');
  }

  function startEdit(doctor: Doctor) {
    setEditingId(doctor.id);
    setFullName(doctor.fullName);
    setSpecialty(doctor.specialty);
    setWorkStart(doctor.workStartTime.slice(0, 5));
    setWorkEnd(doctor.workEndTime.slice(0, 5));
    setSelectedDays(doctor.workingDaysCsv.split(',').map(Number));
    setImageUrl(doctor.imageUrl);
    setBio(doctor.bio ?? '');
    setYearsOfExperience(doctor.yearsOfExperience?.toString() ?? '');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleDelete(id: number) {
    if (confirm('Сигурен ли си, че искаш да изтриеш този лекар?')) {
      deleteMutation.mutate(id);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: DoctorPayload = {
      fullName,
      specialty,
      workStartTime: `${workStart}:00`,
      workEndTime: `${workEnd}:00`,
      workingDaysCsv: selectedDays.sort().join(','),
      imageUrl,
      bio: bio || null,
      yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
    };

    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const doctors = doctorsQuery.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const inputClass =
    'w-full border border-ink/20 rounded-lg px-3.5 py-2.5 bg-white focus:border-teal focus:outline-none transition-colors';

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">Лекари</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4 mb-8">
        <h2 className="font-display text-lg text-ink">{editingId !== null ? 'Редактирай лекар' : 'Нов лекар'}</h2>

        <div>
          <label className="block text-sm text-ink/60 mb-1.5">Име</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-1.5">Специалност</label>
          <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} required className={inputClass} />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-ink/60 mb-1.5">Начало</label>
            <input type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} className={inputClass} />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-ink/60 mb-1.5">Край</label>
            <input type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-2">Работни дни</label>
          <div className="flex gap-2 flex-wrap">
            {weekDays.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                  selectedDays.includes(day.value)
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-white text-ink/70 border-ink/20 hover:border-teal'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-2">Снимка</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-ink/70" />
          {uploading && <p className="text-sm text-ink/40 mt-1">Качване...</p>}
          {imageUrl && (
            <img
              src={`${API_BASE_URL}${imageUrl}`}
              alt="Preview"
              className="mt-2 h-20 w-20 object-cover rounded-full border border-ink/10"
            />
          )}
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-1.5">Кратка биография</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Няколко изречения за опита и подхода на лекаря..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-1.5">Години опит</label>
          <input
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            className={inputClass}
          />
        </div>

        {(createMutation.isError || updateMutation.isError) && (
          <p className="text-red-600 text-sm">Грешка при запазване.</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm hover:bg-teal transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Запазване...' : editingId !== null ? 'Запази промените' : 'Добави лекар'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="text-ink/50 px-5 py-2.5 rounded-full text-sm hover:bg-ink/5 transition-colors"
            >
              Откажи
            </button>
          )}
        </div>
      </form>

      <div>
        {doctors.map((doctor) => (
          <div key={doctor.id} className="flex items-center justify-between bg-white border border-ink/10 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-4">
              {doctor.imageUrl && (
                <img
                  src={`${API_BASE_URL}${doctor.imageUrl}`}
                  alt={doctor.fullName}
                  className="h-12 w-12 object-cover rounded-full"
                />
              )}
              <div>
                <h3 className="text-ink">{doctor.fullName}</h3>
                <p className="text-sm text-ink/50">{doctor.specialty}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => startEdit(doctor)} className="text-sm text-teal hover:text-ink transition-colors">
                Редактирай
              </button>
              <button
                onClick={() => handleDelete(doctor.id)}
                className="text-sm text-ink/40 hover:text-red-600 transition-colors"
              >
                Изтрий
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}