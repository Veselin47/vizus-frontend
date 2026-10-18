import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
//import nzokLogo from '../assets/nzok_dogowor.png.webp'; 

export function Footer() {
  return (
    <footer className="bg-ink relative overflow-hidden mt-24">
      {/* Декоративен лек градиент за разчупване на черния фон */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal via-lens to-teal opacity-50" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          
          {/* Колона 1: За нас и НЗОК */}
          <div className="lg:col-span-1">
            <span className="font-display text-2xl text-paper tracking-tight">Визус</span>
            <p className="text-sm text-paper/60 mt-4 leading-relaxed mb-6">
              Очен кабинет и оптика на едно място — грижа за зрението ти, с внимание към детайла и доказан професионализъм.
            </p>
            {/* Тук подаваме променливата nzokLogo, за да изчезне грешката */}
            <div className="bg-white/100 border border-white/5 rounded-xl p-3 inline-block">
              <img 
                src='/assets/nzok_dogowor.png.webp' 
                alt="Договор с НЗОК" 
                className="h-8 w-auto object-contain " 
              />
            </div>
          </div>

          {/* Колона 2: Навигация */}
          <div>
            <h3 className="text-sm text-teal font-medium uppercase tracking-wider mb-5">Навигация</h3>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-paper/70 hover:text-paper hover:translate-x-1 transition-all">За нас / Екип</Link>
              <Link to="/optic" className="text-sm text-paper/70 hover:text-paper hover:translate-x-1 transition-all">Оптика</Link>
              <Link to="/booking" className="text-sm text-paper/70 hover:text-paper hover:translate-x-1 transition-all">Запази час</Link>
              <Link to="/cart" className="text-sm text-paper/70 hover:text-paper hover:translate-x-1 transition-all">Количка</Link>
            </div>
          </div>

          {/* Колона 3: Работно време */}
          <div>
            <h3 className="text-sm text-teal font-medium uppercase tracking-wider mb-5">Работно време</h3>
            <div className="flex flex-col gap-3 text-sm text-paper/70">
              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 text-teal/70 shrink-0" />
                <div>
                  <p className="text-paper">Понеделник - Петък</p>
                  <p className="text-paper/50">09:00 - 13:00 и 14:00 - 16:00</p>
                </div>
              </div>
              {/* <div className="flex items-start gap-3 mt-2">
                <Clock size={16} className="mt-0.5 text-teal/70 shrink-0" />
                <div>
                  <p className="text-paper">Събота</p>
                  <p className="text-paper/50">10:00 - 14:00 ч.</p>
                </div>
              </div> */}
              <div className="flex items-start gap-3 mt-2">
                <span className="w-4 flex justify-center text-teal/70 shrink-0">—</span>
                <p className="text-paper/50">Събота и Неделя: Почивен ден</p>
              </div>
            </div>
          </div>

          {/* Колона 4: Контакти */}
          <div>
            <h3 className="text-sm text-teal font-medium uppercase tracking-wider mb-5">Контакти</h3>
            <div className="flex flex-col gap-4 text-sm text-paper/70">
              <a href="https://www.google.com/maps/place/%D0%92%D0%98%D0%97%D0%A3%D0%A1+%D0%9E%D1%87%D0%B5%D0%BD+%D0%9C%D0%B5%D0%B4%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%B8+%D0%A6%D0%B5%D0%BD%D1%82%D1%8A%D1%80/@43.1229196,25.6867831,20z/data=!4m15!1m8!3m7!1s0x40a929184d68a609:0x9b309ae6b2f97be8!2z0KbQtdC90YLRitGALCDRg9C7LiDigJ7QpdCw0L0g0JrRgNGD0LzigJwgNSwgNTEwMCDQk9C-0YDQvdCwINCe0YDRj9GF0L7QstC40YbQsA!3b1!8m2!3d43.1229656!4d25.6868139!16s%2Fg%2F11vsw2mtht!3m5!1s0x40a9291852481c59:0x41d63c331e3a7524!8m2!3d43.1230057!4d25.6868858!16s%2Fg%2F11clhrdp22?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D
              " target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-paper transition-colors group">
                <MapPin size={18} className="text-teal/70 group-hover:text-teal transition-colors shrink-0" />
                <span className="leading-tight">ул. Хан Крум 5,<br/>гр. Горна Оряховица, 5100</span>
              </a>
              <a href="tel:+359888266935" className="flex items-center gap-3 hover:text-paper transition-colors group">
                <Phone size={18} className="text-teal/70 group-hover:text-teal transition-colors shrink-0" />
                <span>+0618/64053, 0888266935</span>
              </a>
              <a href="mailto:office@vizus.bg" className="flex items-center gap-3 hover:text-paper transition-colors group">
                <Mail size={18} className="text-teal/70 group-hover:text-teal transition-colors shrink-0" />
                <span>office@vizus.bg</span>
              </a>
            </div>
          </div>

        </div>

        {/* Долна част: Copyright и Социални мрежи */}
        <div className="border-t border-paper/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} Медицински център Визус. Всички права запазени.
          </p>
          
          {/* Директни SVG икони за Facebook и Instagram */}
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-paper/60 hover:bg-teal hover:text-paper transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-paper/60 hover:bg-teal hover:text-paper transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}