import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryPayload,
} from '../../api/categories';
import type { Category } from '../../types/Product';
import { useToastStore } from '../../store/toastStore';


const emptyForm: CategoryPayload = { name: '', parentCategoryId: null };

export function AdminCategoriesPage() {
  const [form, setForm] = useState<CategoryPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setForm(emptyForm);
      showToast('Категорията е създадена успешно!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; data: CategoryPayload }) => updateCategory(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setForm(emptyForm);
      showToast('Промените са запазени!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Категорията е изтрита.');
    },
  });

  function startEdit(category: Category) {
    setEditingId(category.id);
    setForm({ name: category.name, parentCategoryId: category.parentCategoryId });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  function handleDelete(id: number) {
    if (confirm('Сигурен ли си? Продуктите в тази категория може да останат без категория.')) {
      deleteMutation.mutate(id);
    }
  }

  const categories = categoriesQuery.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">Категории</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4 mb-8">        <h2 className="font-display text-lg text-ink">
        {editingId !== null ? 'Редактирай категория' : 'Нова категория'}
      </h2>

        <input
          placeholder="Име"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border border-ink/20 rounded-lg px-3.5 py-2.5 bg-white focus:border-teal focus:outline-none transition-colors"
        />

        {(createMutation.isError || updateMutation.isError) && (
          <p className="text-red-600 text-sm">Грешка при запазване.</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm hover:bg-teal transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Запазване...' : editingId !== null ? 'Запази промените' : 'Създай категория'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-ink/50 px-5 py-2.5 rounded-full text-sm hover:bg-ink/5 transition-colors"
            >
              Откажи
            </button>
          )}
        </div>
      </form>

      <div className="divide-y divide-ink/10">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between py-4">
            <span className="text-ink">{category.name}</span>
            <div className="flex gap-4">
              <button
                onClick={() => startEdit(category)}
                className="text-sm text-teal hover:text-ink transition-colors"
              >
                Редактирай
              </button>
              <button
                onClick={() => handleDelete(category.id)}
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