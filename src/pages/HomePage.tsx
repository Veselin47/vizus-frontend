import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Baby, Eye, ScanEye, Glasses, Award, Heart, Monitor, ShieldCheck } from 'lucide-react';
import { DecorativeBlob } from '../components/ui/DecorativeBlob';
import { ScrollReveal } from '../components/ui/ScrollReveal';

// ДОБАВЕНИ СА ПЪТИЩА КЪМ СНИМКИТЕ НА АПАРАТУРАТА
const equipment = [
  { 
    name: 'OCT (Оптична кохерентна томография)', 
    description: '3D срезове на ретината с ултрависока резолюция. Безконтактно изследване, незаменимо при глаукома и макулна дегенерация.',
    image: '/assets/oct-machine.jpg' // Смени с реалното име на файла
  },
  { 
    name: 'Флуоресцеинова ангиография', 
    description: 'Диагностика на съдови заболявания чрез контрастно вещество. Ключова при диабетна ретинопатия и тумори.',
    image: '/assets/angiography.jpg'
  },
  { 
    name: 'Компютърна периметрия', 
    description: 'Прецизно изследване на зрителния нерв и зрителното поле. Реална необходимост за контрол на глаукома.',
    image: '/assets/perimeter.jpg'
  },
  { 
    name: 'Комбиниран Тонометър и Пахиметър', 
    description: 'Измерване на вътреочно налягане и дебелина на роговицата с безконтактен апарат от най-ново поколение.',
    image: '/assets/tonometer.jpg'
  },
  { 
    name: 'А-Ехография', 
    description: 'Изследване на очните тъкани дори при непрозрачни среди. Изчислява диоптъра на лещата преди операция на катаракта.',
    image: '/assets/echography.jpg'
  },
  { 
    name: 'Автофлуоресценция', 
    description: 'Нов, неинвазивен метод за ранна диагностика на дегенеративни промени в ретината, подходящ и за деца.',
    image: '/assets/autofluorescence.png'
  },
];

const stats = [
  { value: '15+', label: 'Години опит' },
  { value: '6500+', label: 'Доверени пациенти годишно' },
  { value: '600+', label: 'Оперативни лечения' },
];

const services = [
  { title: 'Детска офталмология', description: 'Специализирани прегледи за най-малките с търпение и подход.', icon: Baby },
  { title: 'Катаракта и Глаукома', description: 'Ранна диагностика, съвременно лечение и стриктно проследяване.', icon: Eye },
  { title: 'Корекция на зрението', description: 'Точно измерване на диоптър и напасване на контактни лещи.', icon: ScanEye },
  { title: 'Оптика', description: 'Богат избор от рамки и висококачествени стъкла на едно място.', icon: Glasses },
];

const reasons = [
  {
    id: '01',
    title: 'Професионален опит',
    description: 'Съчетаваме дългогодишен професионален опит с най-новите постижения на медицината за пълноценна и надеждна грижа.',
    icon: Award,
  },
  {
    id: '02',
    title: 'Персонализирана грижа',
    description: 'При нас всеки пациент получава индивидуален подход и внимание, съобразени с неговите конкретни нужди.',
    icon: Heart,
  },
  {
    id: '03',
    title: 'Модерна апаратура',
    description: 'Клиниката е оборудвана с най-съвременната апаратура за диагностика и лечение на всички видове очни заболявания.',
    icon: Monitor,
  },
  {
    id: '04',
    title: 'Договор с НЗОК',
    description: 'Работим с Националната здравноосигурителна каса, за да осигурим достъпно лечение за нашите пациенти.',
    icon: ShieldCheck,
  },
];

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxOffset = 14;
    const x = Math.max(-maxOffset, Math.min(maxOffset, (e.clientX - centerX) / 12));
    const y = Math.max(-maxOffset, Math.min(maxOffset, (e.clientY - centerY) / 12));

    setPupil({ x, y });
  }

  return (
    <div className="relative overflow-hidden">
      <DecorativeBlob color="teal" className="-top-40 -left-40" />
      <DecorativeBlob color="lens" className="top-1/3 -right-40" />

      {/* Hero */}
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPupil({ x: 0, y: 0 })}
        className="relative max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.05]">
            Виждай света
            <br />
            по-ясно.
          </h1>
          <p className="mt-6 text-ink/60 max-w-sm leading-relaxed">
            Очен кабинет и оптика на едно място — прегледи от специалисти и рамки, които подхождат
            точно на теб.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/booking" className="bg-ink text-paper px-6 py-3 rounded-full text-sm hover:bg-teal transition-colors">
              Запази преглед
            </Link>
            <Link to="/optic" className="border border-ink/20 text-ink px-6 py-3 rounded-full text-sm hover:border-ink transition-colors">
              Разгледай оптиката
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto">
            {/* Външна рамка (ink) */}
            <circle cx="140" cy="140" r="135" fill="none" stroke="#0F172A" strokeOpacity="0.1" strokeWidth="1" />
            {/* Ирис - външна част (teal/logo blue) */}
            <circle cx="140" cy="140" r="95" fill="#235B9C" fillOpacity="0.12" />
            {/* Ирис - вътрешна част (teal/logo blue) */}
            <circle cx="140" cy="140" r="70" fill="#235B9C" fillOpacity="0.25" />
            {/* Зеница (ink) */}
            <circle
              cx={140 + pupil.x}
              cy={140 + pupil.y}
              r="34"
              fill="#0F172A"
              style={{ transition: 'cx 0.15s ease-out, cy 0.15s ease-out' }}
            />
            {/* Отблясък (paper) */}
            <circle
              cx={140 + pupil.x - 10}
              cy={140 + pupil.y - 10}
              r="8"
              fill="#F8FAFC"
              fillOpacity="0.8"
              style={{ transition: 'cx 0.15s ease-out, cy 0.15s ease-out' }}
            />
          </svg>
        </div>
      </div>

      {/* Лента със статистика */}
      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-lens/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-around items-center gap-8 text-center border border-teal/10">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div>
                <div className="font-display text-4xl text-teal mb-2">{stat.value}</div>
                <div className="text-sm text-ink/70 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Медицински направления */}
      <div className="relative max-w-6xl mx-auto px-6 py-16 bg-paper/50 rounded-3xl mb-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display text-3xl text-ink">Медицински направления</h2>
          <p className="text-ink/60 mt-3">Цялостна грижа за вашето зрение от водещи специалисти.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-ink/5 hover:border-teal/30 hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="mb-5 bg-teal/10 w-12 h-12 rounded-xl flex items-center justify-center text-teal">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg text-ink mb-2">{service.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed flex-grow">{service.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Философия и Предимства (Тъмна секция) */}
      <section className="bg-ink py-16 md:py-24 relative overflow-hidden mt-12 mb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          <div className="relative max-w-md mx-auto lg:mx-0 mt-8 lg:mt-0">
            <div className="w-4/5 aspect-[3/4] rounded-3xl overflow-hidden relative z-10 border-4 border-ink shadow-2xl">
              <img 
                src="/assets/3_58.jpg" 
                alt="Очен кабинет" 
                className="w-full h-full object-cover bg-paper/10" 
              />
            </div>
            <div className="absolute -bottom-10 -right-4 w-2/3 aspect-[4/3] rounded-3xl overflow-hidden z-20 border-8 border-ink shadow-2xl">
              <img 
                src="/assets/3_53.jpg" 
                alt="Очен преглед" 
                className="w-full h-full object-cover bg-paper/20" 
              />
            </div>
            <div className="absolute top-4 right-0 lg:-right-12 z-30 w-32 h-32 md:w-36 md:h-36 bg-ink rounded-full flex items-center justify-center shadow-xl border border-white/10 text-paper">
               <div className="text-center relative z-10 flex flex-col items-center mt-2">
                 <span className="text-3xl md:text-4xl font-display font-bold text-teal leading-none">15+</span>
                 <span className="text-[9px] md:text-[10px] uppercase tracking-widest mt-1 opacity-80">години опит</span>
               </div>
               <svg className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                 <path id="curve" fill="transparent" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                 <text className="text-[8.5px] font-medium uppercase tracking-[0.15em] fill-paper/60">
                   <textPath href="#curve" startOffset="0">Медицински център Визус • Очна клиника •</textPath>
                 </text>
               </svg>
            </div>
          </div>

          <div>
            <div className="mb-12">
              <span className="text-teal font-medium tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
                <Award size={16} /> Философия
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-paper leading-tight">
                Защо да се доверите на нас за Вашето здраве
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <ScrollReveal key={reason.id} delay={index * 0.1}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden h-full hover:bg-white/10 transition-colors group">
                      <span className="absolute top-2 right-4 text-6xl font-display font-bold text-white/5 pointer-events-none select-none transition-transform group-hover:scale-110 group-hover:text-white/10">
                        {reason.id}
                      </span>
                      <div className="mb-5 text-teal/80 group-hover:text-teal transition-colors">
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-display text-paper mb-2">{reason.title}</h3>
                      <p className="text-sm text-paper/60 leading-relaxed relative z-10">
                        {reason.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Апаратура (С дизайн подобен на стария сайт) */}
      <div className="relative max-w-5xl mx-auto px-6 py-20 border-t border-ink/5">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-ink">Диагностика от най-високо ниво</h2>
            <p className="text-ink/60 mt-4 leading-relaxed">
              Разполагаме с апаратура, еквивалентна на водещите европейски клиники, позволяваща ни да диагностицираме и лекуваме заболявания в най-ранен стадий.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-колонна мрежа за по-лесно четене */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {equipment.map((item, index) => (
            <ScrollReveal key={item.name} delay={(index % 2) * 0.1}>
              {/* Flex контейнер: Снимка отляво, Текст отдясно */}
              <div className="flex items-start gap-6 group">
                
                {/* Контейнер за снимката на уреда */}
                <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden bg-white border border-ink/10 p-2 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-teal/30 transition-all">
                  {/* mix-blend-multiply помага за премахване на белия фон на снимката (ако има такъв) спрямо контейнера */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                    // Временно резервно решение, ако снимката липсва
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('bg-teal/10');
                    }}
                  />
                </div>
                
                {/* Контейнер за текста */}
                <div>
                  <h3 className="text-lg text-ink font-semibold mb-2 group-hover:text-teal transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-ink/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        <ScrollReveal delay={0.3}>
          <div className="mt-16 text-center">
            <Link to="/about" className="inline-flex items-center gap-2 bg-paper border border-ink/20 px-6 py-3 rounded-full text-ink font-medium hover:border-teal hover:text-teal transition-colors">
              Вижте нашите специалисти
              <span>→</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* CTA */}
      <div className="relative max-w-4xl mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="bg-ink rounded-3xl px-8 py-14 text-center">
            <h2 className="font-display text-3xl text-paper">Готов ли си за преглед?</h2>
            <p className="text-paper/60 mt-3 max-w-md mx-auto">
              Запази удобен за теб час online — отнема по-малко от минута.
            </p>
            <Link
              to="/booking"
              className="inline-block mt-6 bg-lens text-ink px-7 py-3 rounded-full text-sm font-medium hover:bg-paper transition-colors"
            >
              Запази час сега
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}