import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '../api/appointments';
import { getImageUrl } from '../utils/getImageUrl';

const dayNames: Record<number, string> = {
  0: 'Неделя',
  1: 'Понеделник',
  2: 'Вторник',
  3: 'Сряда',
  4: 'Четвъртък',
  5: 'Петък',
  6: 'Събота',
};

export function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const doctorsQuery = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });

  const doctor = doctorsQuery.data?.find((d) => d.id === Number(id));

  if (doctorsQuery.isLoading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink/40">Зареждане...</div>;
  }

  if (!doctor) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-ink/50">Лекарят не е намерен.</p>
        <Link to="/about" className="text-teal hover:text-ink transition-colors mt-4 inline-block">
          ← Обратно към екипа
        </Link>
      </div>
    );
  }

  const workingDays = doctor.workingDaysCsv
    .split(',')
    .map(Number)
    .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b)); // подрежда неделя накрая, не в началото

  const timeRange = `${doctor.workStartTime.slice(0, 5)} - ${doctor.workEndTime.slice(0, 5)}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to="/about" className="text-sm text-ink/50 hover:text-teal transition-colors">
        ← Обратно към екипа
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {doctor.imageUrl ? (
            <img
              src={getImageUrl(doctor.imageUrl) ?? ''}
              alt={doctor.fullName}
              className="w-full aspect-square object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-teal/15 flex items-center justify-center text-teal text-6xl font-display">
              {doctor.fullName.charAt(0)}
            </div>
          )}

          <div className="bg-white border border-ink/10 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-ink mb-3">Работно време</h3>
            <div className="space-y-2">
              {workingDays.map((day) => (
                <div key={day} className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">{dayNames[day]}</span>
                  <span className="text-ink">{timeRange}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal/10 rounded-2xl p-5 text-center">
            <span className="text-xs text-teal font-medium uppercase tracking-wide">Отделение</span>
            <p className="text-ink font-display text-lg mt-1">{doctor.specialty}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <h1 className="font-display text-4xl text-ink">{doctor.fullName}</h1>
          <p className="text-teal text-sm font-medium mt-2">{doctor.specialty}</p>

          {doctor.yearsOfExperience !== null && (
            <div className="inline-flex items-center gap-2 bg-lens/15 rounded-full px-4 py-1.5 mt-4">
              <span className="font-display text-xl text-ink">{doctor.yearsOfExperience}+</span>
              <span className="text-xs text-ink/60">години опит</span>
            </div>
          )}

          {doctor.bio ? (
            <p className="text-ink/60 leading-relaxed mt-6">{doctor.bio}</p>
          ) : (
            <p className="text-ink/40 leading-relaxed mt-6 italic">Все още няма добавена биография.</p>
          )}

          <Link
            to="/booking"
            className="inline-block mt-8 bg-ink text-paper px-6 py-3 rounded-full text-sm hover:bg-teal transition-colors"
          >
            Запази час при {doctor.fullName}
          </Link>
        </div>
      </div>
    </div>
  );
}