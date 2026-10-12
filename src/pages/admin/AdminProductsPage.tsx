import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '../../api/categories';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { uploadImage } from '../../api/upload';
import { API_BASE_URL } from '../../api/axiosClient';
import type { Product } from '../../types/Product';
import type { ProductPayload } from '../../api/products';

const emptyForm: ProductPayload = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  categoryId: 0,
  imageUrl: null,
};

export function AdminProductsPage() {
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; data: ProductPayload }) => updateProduct(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingId(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch {
      alert('Качването на снимката неуспешно.');
    } finally {
      setUploading(false);
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    const category = categories.find((c) => c.name === product.categoryName);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: category?.id ?? 0,
      imageUrl: product.imageUrl,
    });
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
    if (confirm('Сигурен ли си, че искаш да изтриеш този продукт?')) {
      deleteMutation.mutate(id);
    }
  }

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const inputClass =
    'w-full border border-ink/20 rounded-lg px-3.5 py-2.5 bg-white focus:border-teal focus:outline-none transition-colors';

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">Продукти</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4 mb-10">
        <h2 className="font-display text-lg text-ink">
          {editingId !== null ? 'Редактирай продукт' : 'Нов продукт'}
        </h2>

        <input
          placeholder="Име"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className={inputClass}
        />
        <textarea
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
        />
        <div className="flex gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="Цена"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Наличност"
            value={form.stockQuantity || ''}
            onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
            required
            className={inputClass}
          />
        </div>
        <select
          value={form.categoryId || ''}
          onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
          required
          className={inputClass}
        >
          <option value="">-- Категория --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block text-sm text-ink/60 mb-2">Снимка</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-ink/70" />
          {uploading && <p className="text-sm text-ink/40 mt-1">Качване...</p>}
          {form.imageUrl && (
            <img
              src={`${API_BASE_URL}${form.imageUrl}`}
              alt="Preview"
              className="mt-2 h-20 w-20 object-cover rounded-lg border border-ink/10"
            />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm hover:bg-teal transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Запазване...' : editingId !== null ? 'Запази промените' : 'Създай продукт'}
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

      <input
        type="text"
        placeholder="Търси по име..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`${inputClass} mb-4`}
      />

      <div className="divide-y divide-ink/10">
        {filteredProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {product.imageUrl && (
                <img
                  src={`${API_BASE_URL}${product.imageUrl}`}
                  alt={product.name}
                  className="h-12 w-12 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-ink">{product.name}</h3>
                <p className="text-sm text-ink/50">
                  {product.categoryName} · {product.price.toFixed(2)} €. · наличност: {product.stockQuantity}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => startEdit(product)} className="text-sm text-teal hover:text-ink transition-colors">
                Редактирай
              </button>
              <button
                onClick={() => handleDelete(product.id)}
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