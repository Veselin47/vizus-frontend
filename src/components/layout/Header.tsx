import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '/assets/logo_bg.jpg';

export function Header() {
  const { isAuthenticated, fullName, role, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <header className="bg-paper/85 backdrop-blur-md border-b border-ink/5 sticky top-0 z-50 transition-all duration-300">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Лого */}
        <Link to="/" className="font-display text-2xl text-ink tracking-tight flex items-center transition-opacity hover:opacity-90">
          <img
            src={logoImg}
            alt="Визус Очен Център"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Навигация */}
        <div className="flex items-center gap-8">
          <Link to="/" className="relative text-sm text-ink/70 hover:text-teal transition-colors group py-1">
            Начало
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
          </Link>
          
          <Link to="/optic" className="relative text-sm text-ink/70 hover:text-teal transition-colors group py-1">
            Оптика
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
          </Link>
          
          <Link to="/booking" className="relative text-sm text-ink/70 hover:text-teal transition-colors group py-1">
            Запази час
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
          </Link>
          
          <Link to="/about" className="relative text-sm text-ink/70 hover:text-teal transition-colors group py-1">
            За нас
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
          </Link>
          
          <Link to="/cart" className="relative text-sm text-ink/70 hover:text-teal transition-colors group py-1">
            Количка
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
            
            {/* Брояч на количката */}
            {itemCount > 0 && (
              <AnimatePresence mode="wait">
                <motion.span
                  key={itemCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-2.5 -right-4 bg-lens text-paper text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
                >
                  {itemCount}
                </motion.span>
              </AnimatePresence>
            )}
          </Link>

          <div className="w-px h-5 bg-ink/15" />

          {/* Потребителски профил / Вход */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-ink/70 font-medium">{fullName}</span>
              {role === 'Admin' && (
                <Link to="/admin" className="text-sm text-teal hover:text-ink transition-colors font-medium">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="text-sm text-ink/50 hover:text-ink transition-colors">
                Изход
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-ink/70 hover:text-teal transition-colors">
                Вход
              </Link>
              <Link
                to="/register"
                className="bg-ink text-paper text-sm px-5 py-2 rounded-full hover:bg-teal transition-colors shadow-sm"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}