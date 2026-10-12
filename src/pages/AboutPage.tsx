import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '../api/appointments';
import { getImageUrl } from '../utils/getImageUrl';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { DecorativeBlob } from '../components/ui/DecorativeBlob';
import { Link } from 'react-router-dom';

export function AboutPage() {
  const doctorsQuery = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });
  const doctors = doctorsQuery.data ?? [];

  const totalExperience = doctors.reduce((sum, d) => sum + (d.yearsOfExperience ?? 0), 0);

  // "Featured" лекар — този с най-много години опит (естествен избор без нужда от отделен флаг в базата)
  const featured = [...doctors].sort(
    (a, b) => (b.yearsOfExperience ?? 0) - (a.yearsOfExperience ?? 0),
  )[0];
  //const restOfTeam = doctors.filter((d) => d.id !== featured?.id);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <DecorativeBlob color="teal" className="-top-40 -left-40" />

        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-5xl text-ink leading-tight">
            Грижа за зрението ти,
            <br />
            с внимание към детайла.
          </h1>
          <p className="mt-6 text-ink/60 leading-relaxed">
            Екипът на Vizus обединява опитни специалисти в офталмологията и оптометрията, посветени
            на едно нещо — да виждаш света възможно най-ясно.
          </p>
        </div>
      </div>

      {/* Featured лекар */}
      {featured && (
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <ScrollReveal>
            <div className="bg-white border border-ink/10 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                {featured.imageUrl ? (
                  <img
                    src={getImageUrl(featured.imageUrl) ?? ''}
                    alt={featured.fullName}
                    // Задаваме ширина, портретна пропорция (3:4) и леко заоблени ъгли
                    className="w-64 md:w-72 aspect-[3/4] object-cover rounded-2xl shadow-sm"
                  />
                ) : (
                  // Променяме и заместителя, за да отговаря на новата форма, ако няма снимка
                  <div className="w-64 md:w-72 aspect-[3/4] rounded-2xl bg-teal/15 flex items-center justify-center text-teal text-7xl font-display">
                    {featured.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs text-teal font-medium uppercase tracking-wide">
                  Управител на клиниката
                </span>
                <h2 className="font-display text-3xl text-ink mt-2">{featured.fullName}</h2>
                <p className="text-sm text-ink/50 mt-1">{featured.specialty}</p>

               {featured.yearsOfExperience !== null && (
                  <div className="inline-flex items-center gap-2 bg-lens/15 rounded-full px-4 py-1.5 mt-4">
                    <span className="font-display text-xl text-ink">{featured.yearsOfExperience}+</span>
                    <span className="text-xs text-ink/60">години опит</span>
                  </div>
                )}

                {/* Статично, добре форматирано био за основателя */}
                <div className="mt-6 space-y-4 text-sm text-ink/80 leading-relaxed">
                  <p>
                    Основател на Медицински център „ВИЗУС“ (2005 г.) и носител на общинска награда за принос към здравеопазването. Под нейно ръководство центърът осигурява висококвалифицирана грижа за над 6500 пациенти годишно.
                  </p>
                  
                  <ul className="space-y-2 mt-4">
                    <li className="flex gap-2">
                      <span className="text-teal font-bold">•</span>
                      <span>
                        <strong className="text-ink font-medium">Образование:</strong> Завършва медицина във ВМИ – Плевен. Специалност „Очни болести“ придобива в Медицинска Академия – София (1989 г.).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal font-bold">•</span>
                      <span>
                        <strong className="text-ink font-medium">Специализации:</strong> Ехография, Компютърна периметрия, Флуоресцеинова ангиография и Лазери в офталмологията.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal font-bold">•</span>
                      <span>
                        <strong className="text-ink font-medium">Членства:</strong> Българско офталмологично дружество и Съюз на очните лекари в България. Ежегодни участия в международни конгреси (ESCRS, EURETINA).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Останалият екип */}
      {doctors.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-24">
          <h2 className="font-display text-2xl text-ink mb-10 text-center">Екип</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
                            <ScrollReveal key={doctor.id} delay={(index % 3) * 0.08}>
                <Link
                  to={`/about/${doctor.id}`}
                  className="bg-white border border-ink/10 rounded-2xl p-6 h-full flex flex-col items-center text-center hover:border-teal transition-colors"
                >
                  {doctor.imageUrl ? (
                    <img
                      src={getImageUrl(doctor.imageUrl) ?? ''}
                      alt={doctor.fullName}
                      className="h-24 w-24 object-cover rounded-full mb-4"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-teal/15 flex items-center justify-center text-teal text-2xl font-display mb-4">
                      {doctor.fullName.charAt(0)}
                    </div>
                  )}

                  <h3 className="font-display text-lg text-ink">{doctor.fullName}</h3>
                  <span className="text-xs text-teal font-medium mt-1">{doctor.specialty}</span>

                  {doctor.yearsOfExperience !== null && (
                    <span className="text-xs text-ink/40 mt-1">{doctor.yearsOfExperience} години опит</span>
                  )}

                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {doctorsQuery.isLoading && (
        <p className="text-center text-ink/40 pb-24">Зареждане...</p>
      )}

      {totalExperience === 0 && !doctorsQuery.isLoading && (
        <p className="text-center text-ink/40 pb-24">Все още няма добавени лекари.</p>
      )}
    </div>
  );
}