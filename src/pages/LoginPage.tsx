import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.email, data.fullName);
      navigate('/');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ email, password });
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl text-ink mb-8">Вход</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-ink/60 mb-1.5">Имейл</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-ink/20 rounded-lg px-3.5 py-2.5 focus:border-teal focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-1.5">Парола</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-ink/20 rounded-lg px-3.5 py-2.5 focus:border-teal focus:outline-none transition-colors"
          />
        </div>

        {mutation.isError && <p className="text-red-600 text-sm">Грешен имейл или парола.</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-ink text-paper py-3 rounded-full text-sm hover:bg-teal transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Влизане...' : 'Влез'}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-6">
        Нямаш акаунт?{' '}
        <Link to="/register" className="text-teal hover:text-ink transition-colors">
          Регистрирай се
        </Link>
      </p>
    </div>
  );
}