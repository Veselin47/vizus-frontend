import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const navLinks = [
  { to: '/', label: 'Начало' },
  { to: '/optic', label: 'Оптика' },
  { to: '/booking', label: 'Запази час' },
  { to: '/about', label: 'За нас' },
];

function CartBadge({ count, className }: { count: number; className: string }) {
  if (count === 0) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 1.4 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`absolute bg-lens text-paper text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-sm ${className}`}
    >
      {count}
    </motion.span>
  );
}

const underline =
  'absolute bottom-0 left-0 w-full h-0.5 bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, fullName, role, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
  }

  return (
    <header className="bg-paper/85 backdrop-blur-md border-b border-ink/5 sticky top-0 z-50 transition-all duration-300">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 lg:py-5 flex items-center justify-between">
        {/* Лого */}
        <Link
          to="/"
          onClick={closeMenu}
          className="font-display text-2xl text-ink tracking-tight flex items-center transition-opacity hover:opacity-90"
        >
          <img src="/assets/logo_bg.jpg" alt="Визус Очен Център" className="h-9 sm:h-10 w-auto object-contain" />
        </Link>

        {/* Десктоп навигация */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative text-sm text-ink/70 hover:text-teal transition-colors group py-1"
            >
              {link.label}
              <span className={underline} />
            </Link>
          ))}

          <Link to="/cart" className="relative text-sm text-ink/70 hover:text-teal transition-colors group py-1">
            Количка
            <span className={underline} />
            <CartBadge count={itemCount} className="-top-2.5 -right-4" />
          </Link>

          <div className="w-px h-5 bg-ink/15" />

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

        {/* Мобилни контроли: количка + хамбургер */}
        <div className="flex lg:hidden items-center">
          <Link
            to="/cart"
            onClick={closeMenu}
            aria-label="Количка"
            className="relative h-11 w-11 flex items-center justify-center text-ink"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            <CartBadge count={itemCount} className="top-0.5 right-0" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Затвори менюто' : 'Отвори менюто'}
            aria-expanded={menuOpen}
            className="h-11 w-11 flex items-center justify-center text-ink"
          >
            {menuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Мобилно меню */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-ink/10 bg-paper"
          >
            <div className="px-6 py-3 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className="py-3.5 text-ink border-b border-ink/10"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <p className="pt-4 pb-1 text-sm text-ink/50">Здравей, {fullName}</p>
                  {role === 'Admin' && (
                    <Link to="/admin" onClick={closeMenu} className="py-3 text-teal">
                      Admin панел
                    </Link>
                  )}
                  <button onClick={handleLogout} className="py-3 text-left text-ink/60">
                    Изход
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-4 pb-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 text-center border border-ink/20 text-ink py-3 rounded-full text-sm"
                  >
                    Вход
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex-1 text-center bg-ink text-paper py-3 rounded-full text-sm"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    
  );
}