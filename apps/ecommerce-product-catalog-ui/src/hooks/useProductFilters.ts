import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Product } from "../data/types";

export type SortOption = "price-asc" | "price-desc" | "rating-desc";

interface FilterState {
  category: string;
  brand: string;
  search: string;
  sort: SortOption;
  showFavoritesOnly: boolean;
}

const sortFns: Record<SortOption, (a: Product, b: Product) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
};

export function useProductFilters(products: Product[], favoriteIds: number[]) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    brand: "",
    search: "",
    sort: "price-asc",
    showFavoritesOnly: false,
  });

  // Sync URL params into filter state
  useEffect(() => {
    const sortParam = searchParams.get("sort") as SortOption | null;
    const filterParam = searchParams.get("filter");

    setFilters((prev) => ({
      ...prev,
      sort: sortParam ?? prev.sort,
      showFavoritesOnly: filterParam === "favorites",
    }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    const result = products.filter(
      (p) =>
        (!filters.category || p.category === filters.category) &&
        (!filters.brand || p.brand === filters.brand) &&
        (!filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase())) &&
        (!filters.showFavoritesOnly || favoriteIds.includes(p.id))
    );
    return result.sort(sortFns[filters.sort]);
  }, [products, filters, favoriteIds]);

  const setCategory = (category: string) => setFilters((f) => ({ ...f, category }));
  const setBrand = (brand: string) => setFilters((f) => ({ ...f, brand }));
  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const setSort = (sort: SortOption) => setFilters((f) => ({ ...f, sort }));

  return {
    filters,
    filtered,
    setCategory,
    setBrand,
    setSearch,
    setSort,
  };
}
