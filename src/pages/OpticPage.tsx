import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import { ProductCard } from '../components/products/ProductCard';
import { useState } from 'react';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ProductCardSkeleton } from '../components/products/ProductCardSkeleton';
import { motion } from 'framer-motion';

export function OpticPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  if (productsQuery.isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="h-10 w-32 bg-ink/8 rounded-full animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (productsQuery.isError) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-red-600">
        Грешка при зареждане на продуктите.
      </div>
    );
  }

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const filteredProducts = selectedCategoryId
    ? products.filter(
        (p) => p.categoryName === categories.find((c) => c.id === selectedCategoryId)?.name,
      )
    : products;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Оптика</h1>
      <p className="text-ink/50 mt-2">Рамки, стъкла и лещи, подбрани с грижа.</p>

      {/* Анимирани филтри (Framer Motion Layout) */}
      <div className="flex gap-3 mt-8 mb-12 flex-wrap">
        
        {/* Бутон "Всички" */}
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
            selectedCategoryId === null ? 'text-paper' : 'text-ink/60 hover:text-ink'
          }`}
        >
          {selectedCategoryId === null && (
            <motion.div
              layoutId="activeCategoryFilter"
              className="absolute inset-0 bg-ink rounded-full shadow-md"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">Всички</span>
        </button>

        {/* Динамични категории (Слънчеви, Диоптрични и др.) */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              selectedCategoryId === category.id ? 'text-paper' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {selectedCategoryId === category.id && (
              <motion.div
                layoutId="activeCategoryFilter"
                className="absolute inset-0 bg-ink rounded-full shadow-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Мрежа с продукти */}
      {filteredProducts.length === 0 ? (
        <p className="text-ink/50">Няма продукти в тази категория.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filteredProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={(index % 3) * 0.08}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}