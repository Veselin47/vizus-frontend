import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { confirmAppointment } from '../api/appointments';

type Status = 'loading' | 'success' | 'error';

export function ConfirmAppointmentPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error');

  useEffect(() => {
    if (!token) return;
    // В dev режим StrictMode изпълнява ефекта два пъти, но бекендът е идемпотентен,
    // така че двойното извикване е безопасно.
    confirmAppointment(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      {status === 'loading' && <p className="text-ink/50">Потвърждаване...</p>}

      {status === 'success' && (
        <>
          <div className="text-teal text-5xl mb-4">✓</div>
          <h1 className="font-display text-3xl text-ink">Часът е потвърден!</h1>
          <p className="text-ink/60 mt-3">Очакваме те. Ако се наложи промяна, свържи се с нас.</p>
          <Link to="/" className="inline-block mt-8 text-teal hover:text-ink transition-colors">
            ← Към началото
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="font-display text-3xl text-ink">Линкът не е валиден</h1>
          <p className="text-ink/60 mt-3">Часът може да е отказан или линкът да е изтекъл.</p>
          <Link to="/booking" className="inline-block mt-8 text-teal hover:text-ink transition-colors">
            Запази нов час →
          </Link>
        </>
      )}
    </div>
  );
}