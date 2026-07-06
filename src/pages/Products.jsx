import { useState } from "react";
import ProductTable from "../components/products/ProductTable";
import ColumnSettings from "../components/products/ColumnSettings";
import { useColumnConfig } from "../hooks/useColumnConfig";
import { useAuth } from "../context/AuthContext";
import { usePublishedProducts } from "../hooks/usePublishedProducts";
import { useMemo, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "../components/products/SearchBar";
import SortDropdown from "../components/products/SortDropdown";

import ProductCard from "../components/products/ProductCard";
import { useProductPolling } from "../hooks/useProductPolling";
import FilterSidebar from "../components/products/FilterSidebar";

const PAGE_SIZE = 12;

function Products() {
  const { products, setProducts, loading, error } = useProducts();
  useProductPolling(products, setProducts, 8000);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { isHidden, toggleHidden } = usePublishedProducts();
  const listingRef = useRef(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const { columns, toggleVisibility, reorderColumn, resetColumns } =
    useColumnConfig();

  // Read state directly from the URL
  const sort = searchParams.get("sort") || "";
  const gender = searchParams.get("gender") || "";
  const selectedGenders = useMemo(() =>
    gender ? gender.split(",") : [],
    [searchParams]
  );
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const selectedCategories = useMemo(
    () =>
      searchParams.get("category")
        ? searchParams.get("category").split(",")
        : [],
    [searchParams],
  );

  const debouncedSearch = useDebounce(search, 400);

  // Helper to update URL params without wiping out other params
  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (
            value === "" ||
            value == null ||
            (Array.isArray(value) && value.length === 0)
          ) {
            next.delete(key);
          } else {
            next.set(key, Array.isArray(value) ? value.join(",") : value);
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const handleClearCategories = useCallback(() => {
    updateParams({ category: [], page: "1" });
  }, [updateParams]);

  const handleSearchChange = useCallback(
    (value) => {
      updateParams({ search: value, page: "1" });
    },
    [updateParams],
  );

  const handleCategoryToggle = useCallback(
    (cat) => {
      const next = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
      updateParams({ category: next, page: "1" });
    },
    [selectedCategories, updateParams],
  );

  const handleGenderToggle = useCallback(
    (g) => {
      const next = selectedGenders.includes(g)
        ? selectedGenders.filter((c) => c !== g)
        : [...selectedGenders, g];
      updateParams({ gender: next, page: "1" });
    },
    [selectedGenders, updateParams]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      updateParams({ page: String(newPage) });
    },
    [updateParams],
  );

  // Update sort parameter when user selects a sorting option
  const handleSortChange = useCallback(
    (value) => {
      updateParams({ sort: value, page: "1" });
    },
    [updateParams],
  );

  const scrollToListing = useCallback(() => {
    listingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleCategoryTileClick = useCallback(
    (category) => {
      handleCategoryToggle(category);
      scrollToListing();
    },
    [handleCategoryToggle, scrollToListing],
  );

  const handleOpenProduct = useCallback(
    (productId) => {
      navigate(`/products/${productId}`);
    },
    [navigate],
  );

  // Derive all available categories from the fetched data
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set).sort();
  }, [products]);

  const categoryTiles = useMemo(() => {
    return categories
      .map((category) => {
        const representative = products.find((p) => p.category === category);
        if (!representative) return null;

        return {
          category,
          label: category.replace(/-/g, " "),
          thumbnail: representative.thumbnail,
          count: products.filter((p) => p.category === category).length,
        };
      })
      .filter(Boolean);
  }, [categories, products]);


  // Filter -> Search -> Sort pipeline (memoized so it only recalculates when inputs change)
  const filteredProducts = useMemo(() => {
    let result = products;

    if (!isAdmin) {
      result = result.filter((p) => !isHidden(p.id));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedGenders.length > 0) {
      result = result.filter((p) => {
        const cat = p.category.toLowerCase();
        if (selectedGenders.includes("men")) {
          if (/mens|men|male/.test(cat)) return true;
        }
        if (selectedGenders.includes("women")) {
          if (/womens|women|female/.test(cat)) return true;
        }
        return false;
      });
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(query));
    }

    if (sort) {
      const [field, direction] = sort.split("-");
      result = [...result].sort((a, b) => {
        let valA = field === "name" ? a.title.toLowerCase() : a[field];
        let valB = field === "name" ? b.title.toLowerCase() : b[field];
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, selectedCategories, selectedGenders, debouncedSearch, sort]);

  // Pagination slice
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading products...</div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>



      <div ref={listingRef} className="flex flex-col lg:flex-row gap-6 mt-5">
        <FilterSidebar
          categories={categories}
          selected={selectedCategories}
          onToggle={handleCategoryToggle}
          onClear={handleClearCategories}
          selectedGenders={selectedGenders}
          onToggleGender={handleGenderToggle}
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <SearchBar value={search} onChange={handleSearchChange} />
            <SortDropdown value={sort} onChange={handleSortChange} />
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex border border-gray-300 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm ${viewMode === "grid" ? "bg-[#FFD232] text-white" : "bg-white text-gray-600"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-[#FFD232] text-white" : "bg-white text-gray-600"}`}
                >
                  Table
                </button>
              </div>
              {viewMode === "table" && (
                <ColumnSettings
                  columns={columns}
                  onToggle={toggleVisibility}
                  onReorder={reorderColumn}
                  onReset={resetColumns}
                />
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>

          {paginatedProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              No products match your filters.
            </p>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  isHidden={isHidden(product.id)}
                  onToggleHidden={() => toggleHidden(product.id)}
                />
              ))}
            </div>
          ) : (
            <ProductTable
              products={paginatedProducts}
              columns={columns}
              isAdmin={isAdmin}
              isHidden={isHidden}
              onToggleHidden={toggleHidden}
            />
          )}

          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
