import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { productsApi } from "@/api/products";
import { mediaApi } from "@/api/media";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/CartDrawer";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import DataTable from "@/components/DataTable";
import { ProductCardSkeletonGrid } from "@/components/Skeletons";

const CATEGORIES = [
  { id: "all", label: "All Items", icon: "✨" },
  { id: "Electronics", label: "Electronics", icon: "⚡" },
  { id: "Audio", label: "Audio", icon: "🎧" },
  { id: "Furniture", label: "Furniture", icon: "🪑" },
  { id: "Wearables", label: "Wearables", icon: "⌚" },
  { id: "Accessories", label: "Accessories", icon: "🎒" },
  { id: "Computing", label: "Computing", icon: "💻" },
];

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg =
    type === "success"
      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
      : type === "warn"
        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
        : "bg-rose-500/20 border-rose-500/40 text-rose-300";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${bg}`}
    >
      <span>{type === "success" ? "✓" : type === "warn" ? "ℹ" : "✕"}</span>
      <span>{message}</span>
    </div>
  );
}

const Products = () => {
  const {
    addToCart,
    setIsCartOpen,
    totalItems,
    total,
    items: cartItems,
  } = useCart();
  const { toggleWishlist, isInWishlist, totalWishlistItems } = useWishlist();

  const [products, setProducts] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [toast, setToast] = useState(null);

  // Controls
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [refreshKey, setRefreshKey] = useState(0);

  const queryKey = `${page}||${limit}||${search}||${selectedCategory}||${sortField}||${sortOrder}||${refreshKey}`;
  const [settledKey, setSettledKey] = useState("");
  const loading = queryKey !== settledKey;

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  // Modal / Drawer States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [inspectingProduct, setInspectingProduct] = useState(null);

  // Product Form State
  const [formData, setFormData] = useState({
    title: "",
    price: 99.99,
    category: "Electronics",
    stock: 25,
    rating: 4.8,
    description: "",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // Fetch Products via useEffect
  useEffect(() => {
    let cancelled = false;

    productsApi
      .getAll({
        page,
        limit,
        search,
        category: selectedCategory,
        sort: sortField,
        order: sortOrder,
      })
      .then((res) => {
        if (cancelled) return;
        const list = res.data || [];
        setProducts(list);
        setPagination(
          res.pagination ||
            res.meta || {
              page,
              limit,
              total: list.length,
              totalPages: Math.ceil(list.length / limit) || 1,
            },
        );
        setSettledKey(queryKey);
      })
      .catch((err) => {
        if (cancelled) return;
        showToast(err.message || "Failed to load products", "error");
        setSettledKey(queryKey);
      });

    return () => {
      cancelled = true;
    };
  }, [
    queryKey,
    page,
    limit,
    search,
    selectedCategory,
    sortField,
    sortOrder,
    refreshKey,
    showToast,
  ]);

  // Handle 1-Click Seed
  const handleSeedStore = async () => {
    setSeeding(true);
    try {
      const res = await productsApi.seedStore("ecommerce");
      showToast(res.message || "E-Commerce store seeded with 10 products!");
      setPage(1);
      refresh();
    } catch (err) {
      showToast(err.message || "Failed to seed store", "error");
    } finally {
      setSeeding(false);
    }
  };

  // Create Product Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setMutating(true);
    try {
      const titleVal = formData.title.trim();
      const payload = {
        name: titleVal,
        title: titleVal,
        price: Number(formData.price) || 0,
        category: formData.category,
        stock: Number(formData.stock) || 0,
        rating: Number(formData.rating) || 5,
        description: formData.description.trim(),
      };

      await productsApi.create(payload);
      showToast(`Product "${titleVal}" created successfully!`);
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        price: 99.99,
        category: "Electronics",
        stock: 25,
        rating: 4.8,
        description: "",
      });
      refresh();
    } catch (err) {
      showToast(err.message || "Failed to create product", "error");
    } finally {
      setMutating(false);
    }
  };

  // Edit Product Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setMutating(true);
    try {
      const titleVal = formData.title.trim();
      const payload = {
        name: titleVal,
        title: titleVal,
        price: Number(formData.price) || 0,
        category: formData.category,
        stock: Number(formData.stock) || 0,
        rating: Number(formData.rating) || 5,
        description: formData.description.trim(),
      };

      await productsApi.update(editingProduct.id, payload);
      showToast(`Product #${editingProduct.id} updated!`);
      setEditingProduct(null);
      refresh();
    } catch (err) {
      showToast(err.message || "Failed to update product", "error");
    } finally {
      setMutating(false);
    }
  };

  // Delete Product
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setMutating(true);
    try {
      await productsApi.delete(deletingProduct.id);
      showToast(`Product #${deletingProduct.id} deleted from sandbox`);
      setDeletingProduct(null);
      refresh();
    } catch (err) {
      showToast(err.message || "Failed to delete product", "error");
    } finally {
      setMutating(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: "",
      price: 129.99,
      category: "Audio",
      stock: 30,
      rating: 4.9,
      description:
        "Ultra-low latency wireless audio with active noise cancellation.",
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.name || product.title || "",
      price: product.price || 0,
      category: product.category || "Electronics",
      stock: product.stock || 0,
      rating: product.rating || 5,
      description: product.description || "",
    });
  };

  // Metric computations
  const metrics = useMemo(() => {
    const total = pagination.total || products.length;
    const inStock = products.filter((p) => (p.stock || 0) > 0).length;
    const avgPrice = products.length
      ? Math.round(
          products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) /
            products.length,
        )
      : 0;
    return { total, inStock, avgPrice };
  }, [pagination.total, products]);

  // Table Column Definitions
  const tableColumns = [
    {
      header: "Product",
      key: "title",
      width: "2.5fr",
      render: (p) => {
        const displayName = p.name || p.title || "Product Item";
        return (
          <div className="flex items-center gap-3">
            <img
              src={mediaApi.getThumbnailUrl(`product-${p.id}`, {
                width: 120,
                height: 80,
                text: p.category || displayName,
              })}
              alt={displayName}
              className="w-12 h-8 rounded-lg object-cover border border-[#1e293b] shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {p.description || "No description"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      key: "category",
      width: "1.2fr",
      render: (p) => (
        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold font-mono">
          {p.category || "General"}
        </span>
      ),
    },
    {
      header: "Price",
      key: "price",
      width: "1fr",
      render: (p) => (
        <span className="text-sm font-extrabold text-emerald-400 font-mono">
          ${Number(p.price || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Stock",
      key: "stock",
      width: "1fr",
      render: (p) => {
        const qty = Number(p.stock) || 0;
        const color =
          qty > 15
            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            : qty > 0
              ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
              : "text-rose-400 bg-rose-500/10 border-rose-500/20";
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-mono border ${color}`}
          >
            {qty > 0 ? `${qty} units` : "Out of stock"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      key: "actions",
      width: "1.4fr",
      align: "right",
      render: (p) => {
        const qty = Number(p.stock) || 0;
        const displayName = p.name || p.title || "Product";
        return (
          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled={qty <= 0}
              onClick={() => {
                addToCart(p, 1);
                showToast(`Added "${displayName}" to cart! 🛒`);
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                qty <= 0
                  ? "opacity-40 cursor-not-allowed bg-[#080e1a] border-[#1e293b] text-slate-500"
                  : "bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border-amber-500/30"
              }`}
              title={qty <= 0 ? "Out of stock" : "Add to cart"}
            >
              🛒
            </button>
            <button
              type="button"
              onClick={() => setInspectingProduct(p)}
              className="p-1.5 rounded-lg bg-[#080e1a] hover:bg-[#131d33] text-slate-300 hover:text-white border border-[#1e293b] text-xs transition-colors cursor-pointer"
              title="Inspect JSON"
            >
              👁️
            </button>
            <button
              type="button"
              onClick={() => openEditModal(p)}
              className="p-1.5 rounded-lg bg-[#080e1a] hover:bg-amber-500/10 text-amber-400 border border-[#1e293b] hover:border-amber-500/30 text-xs transition-colors cursor-pointer"
              title="Edit Product"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={() => setDeletingProduct(p)}
              className="p-1.5 rounded-lg bg-[#080e1a] hover:bg-rose-500/10 text-rose-400 border border-[#1e293b] hover:border-rose-500/30 text-xs transition-colors cursor-pointer"
              title="Delete Product"
            >
              🗑️
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Executive Header Banner ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-purple-500 to-sky-500 opacity-80" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Protected Dynamic Resource /custom/products
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              E-Commerce Products Hub
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore dynamic overlay mutation collections. Seed e-commerce mock
              inventories, test full CRUD cycles, search, and category filtering
              in your private sandbox.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap xl:flex-nowrap items-center gap-2.5 shrink-0">
            {/* Quick Access Badges (Wishlist + Cart) */}
            <div className="flex items-center gap-1 p-1 bg-[#080e1a] rounded-xl border border-[#1e293b] shadow-xs">
              <Link
                to="/wishlist"
                className="px-3 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="View Saved Wishlist"
              >
                <span>❤️</span>
                <span className="font-medium">Wishlist</span>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-extrabold border border-rose-500/30">
                  {totalWishlistItems}
                </span>
              </Link>

              <div className="w-px h-4 bg-[#1e293b]" />

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-1.5 rounded-lg hover:bg-amber-500/10 text-amber-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                title="Open Cart Drawer"
              >
                <span>🛒</span>
                <span className="font-medium">Cart</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold">
                  {totalItems}
                </span>
                {totalItems > 0 && (
                  <span className="text-emerald-400 font-mono text-[11px] hidden sm:inline">
                    ${total.toFixed(0)}
                  </span>
                )}
              </button>
            </div>

            {/* Catalog Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSeedStore}
                disabled={seeding}
                className="px-3.5 py-2 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-amber-400 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                {seeding ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Seeding...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Reseed Catalog</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-amber-500/15 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>+</span>
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Products
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {metrics.total}
          </div>
          <div className="text-[11px] text-slate-400">
            In session collection
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Avg Unit Price
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
            ${metrics.avgPrice}
          </div>
          <div className="text-[11px] text-slate-400">
            Across active catalog
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Stock Availability
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono">
            {metrics.inStock} / {products.length}
          </div>
          <div className="text-[11px] text-slate-400">Readily dispatchable</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Custom Gateway
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Dynamic
          </div>
          <div className="text-[11px] text-slate-400">REST overlay CRUD</div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-3.5 shadow-sm">
        {/* Top Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="w-full sm:w-80">
            <SearchInput
              placeholder="Search products or descriptions..."
              onSearch={(term) => {
                setSearch(term);
                setPage(1);
              }}
            />
          </div>

          {/* Right Controls: Sort & View Toggle & Reset */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
            {(search || selectedCategory !== "all" || sortField) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSortField("");
                  setSortOrder("asc");
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#080e1a] hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-[#1e293b] hover:border-rose-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                title="Reset all filters"
              >
                <span>✕</span>
                <span className="hidden xs:inline">Reset</span>
              </button>
            )}

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortField ? `${sortField}_${sortOrder}` : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setSortField("");
                    setSortOrder("asc");
                  } else {
                    const [f, o] = val.split("_");
                    setSortField(f);
                    setSortOrder(o);
                  }
                  setPage(1);
                }}
                className="bg-[#080e1a] border border-[#1e293b] text-slate-300 hover:text-white text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-amber-500 font-medium cursor-pointer transition-colors appearance-none"
              >
                <option value="">Default Sorting</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Title: A - Z</option>
                <option value="stock_desc">Stock: Highest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* View Mode Segmented Control */}
            <div className="flex p-1 rounded-xl bg-[#080e1a] border border-[#1e293b]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "table"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Table View"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Segmented Scroll Track */}
        <div className="pt-2.5 border-t border-[#1e293b]/70 flex items-center gap-2 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Categories:
          </span>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 select-none ${
                  isSelected
                    ? "bg-linear-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/20 border border-amber-300 scale-[1.02]"
                    : "bg-[#080e1a] text-slate-300 hover:text-white hover:bg-[#131d33] border border-[#1e293b] hover:border-slate-600"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Empty State Banner with 1-Click Seed ── */}
      {!loading && products.length === 0 && (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0f172a] border border-[#1e293b] text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-2xl">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              No Products in Custom Collection
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your custom products sandbox overlay is currently empty. Click the
              button below to instantly populate 10 realistic e-commerce
              products with categories, prices, and stock.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSeedStore}
            disabled={seeding}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer inline-flex items-center gap-2"
          >
            {seeding ? "Seeding Catalog..." : "⚡ Seed E-Commerce Catalog Now"}
          </button>
        </div>
      )}

      {/* ── Main Catalog Grid / Table ── */}
      {loading ? (
        viewMode === "grid" ? (
          <ProductCardSkeletonGrid count={limit} />
        ) : (
          <DataTable
            columns={tableColumns}
            data={[]}
            loading={true}
            pagination={{ page, limit, total: 0, totalPages: 1 }}
          />
        )
      ) : products.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => {
              const qty = Number(p.stock) || 0;
              const displayName = p.name || p.title || "Product Item";
              const imgUrl = mediaApi.getThumbnailUrl(`prod-${p.id}`, {
                width: 600,
                height: 400,
                text: displayName,
                description: `$${p.price} · ${p.category || "Product"}`,
              });

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-md"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="rounded-xl overflow-hidden border border-[#1e293b] relative group-hover:shadow-lg transition-all">
                      <img
                        src={imgUrl}
                        alt={displayName}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Wishlist Heart Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const added = toggleWishlist(p);
                          showToast(
                            added
                              ? `Saved "${displayName}" to wishlist! ❤️`
                              : `Removed "${displayName}" from wishlist`,
                          );
                        }}
                        className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg backdrop-blur-md text-xs transition-all cursor-pointer shadow-sm ${
                          isInWishlist(p.id)
                            ? "bg-rose-500 text-white border border-rose-400 scale-105 shadow-rose-500/30"
                            : "bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-rose-400 border border-slate-700/50"
                        }`}
                        title={
                          isInWishlist(p.id)
                            ? "Remove from wishlist"
                            : "Save to wishlist"
                        }
                      >
                        {isInWishlist(p.id) ? "❤️" : "🤍"}
                      </button>

                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                        ${Number(p.price || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Category & Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold font-mono uppercase tracking-wider">
                        {p.category || "General"}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          qty > 10
                            ? "text-emerald-400"
                            : qty > 0
                              ? "text-amber-400"
                              : "text-rose-400"
                        }`}
                      >
                        {qty > 0 ? `● ${qty} in stock` : "○ Out of stock"}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {displayName}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {p.description ||
                          "No detailed specifications provided for this product."}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[#1e293b] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-amber-400 font-mono">
                        {"★".repeat(Math.round(p.rating || 5))}{" "}
                        <span className="text-slate-400">
                          ({p.rating || 5}.0)
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setInspectingProduct(p)}
                          className="p-1.5 rounded-lg bg-[#080e1a] hover:bg-[#131d33] text-slate-300 hover:text-white border border-[#1e293b] text-xs transition-colors cursor-pointer"
                          title="Inspect JSON"
                        >
                          👁️
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-[#080e1a] hover:bg-amber-500/10 text-amber-400 border border-[#1e293b] hover:border-amber-500/30 text-xs transition-colors cursor-pointer"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-lg bg-[#080e1a] hover:bg-rose-500/10 text-rose-400 border border-[#1e293b] hover:border-rose-500/30 text-xs transition-colors cursor-pointer"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Action */}
                    {(() => {
                      const inCart = cartItems.find((item) => item.id === p.id);
                      const cartCount = inCart?.quantity || 0;
                      return (
                        <button
                          type="button"
                          disabled={qty <= 0}
                          onClick={() => {
                            addToCart(p, 1);
                            showToast(`Added "${displayName}" to cart! 🛒`);
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            qty <= 0
                              ? "bg-slate-800/50 text-slate-500 border border-slate-700/30 cursor-not-allowed"
                              : cartCount > 0
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950"
                                : "bg-[#080e1a] hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-[#1e293b] hover:border-amber-400 shadow-xs"
                          }`}
                        >
                          <span>🛒</span>
                          <span>
                            {qty <= 0
                              ? "Out of Stock"
                              : cartCount > 0
                                ? `In Cart (${cartCount}) · Add More`
                                : "Add to Cart"}
                          </span>
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={products}
            loading={false}
            pagination={pagination}
            onRowClick={(p) => setInspectingProduct(p)}
          />
        )
      ) : null}

      {/* ── Pagination ── */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => setPage(p)}
          pageSize={limit}
          onPageSizeChange={(sz) => {
            setLimit(sz);
            setPage(1);
          }}
          pageSizeOptions={[4, 8, 12, 24]}
        />
      )}

      {/* ── Create / Edit Product Modal ── */}
      {(isCreateModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingProduct
                    ? `Edit Product #${editingProduct.id}`
                    : "Add New Product"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Changes persist to your session overlay sandbox.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={editingProduct ? handleEditSubmit : handleCreateSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Product Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Unit Price ($) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Stock Inventory
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed product highlights and tech specs..."
                  className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#1e293b] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutating}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {mutating
                    ? "Saving Product..."
                    : editingProduct
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] border border-rose-500/30 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-base font-bold text-white">
                Delete Product #{deletingProduct.id}?
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-white font-semibold">
                {deletingProduct.name || deletingProduct.title}
              </strong>
              ? This mutation will be recorded in your sandbox overlay.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl bg-[#080e1a] text-slate-300 text-xs font-semibold border border-[#1e293b]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={mutating}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20"
              >
                {mutating ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Inspect Product Drawer ── */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border-l border-[#1e293b] h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-[#1e293b] pb-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white leading-tight">
                      Product Details
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/30 shrink-0">
                      Custom Resource
                    </span>
                  </div>
                  <p
                    className="text-[11px] font-mono text-amber-400/90 truncate"
                    title={String(inspectingProduct.id)}
                  >
                    ID: #{String(inspectingProduct.id)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingProduct(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <img
                  src={mediaApi.getThumbnailUrl(
                    `prod-${inspectingProduct.id}`,
                    {
                      width: 600,
                      height: 400,
                      text:
                        inspectingProduct.name ||
                        inspectingProduct.title ||
                        "Product",
                    },
                  )}
                  alt={inspectingProduct.name || inspectingProduct.title}
                  className="w-full h-44 rounded-xl object-cover border border-[#1e293b]"
                />

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">
                    {inspectingProduct.name || inspectingProduct.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {inspectingProduct.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#080e1a] border border-[#1e293b]">
                    <span className="text-slate-500 text-[10px] block">
                      Price
                    </span>
                    <span className="text-emerald-400 font-bold">
                      ${Number(inspectingProduct.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080e1a] border border-[#1e293b]">
                    <span className="text-slate-500 text-[10px] block">
                      Stock
                    </span>
                    <span className="text-amber-400 font-bold">
                      {inspectingProduct.stock} units
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Raw JSON Payload
                  </label>
                  <pre className="p-4 rounded-xl bg-[#080e1a] border border-[#1e293b] font-mono text-[11px] text-amber-300/90 overflow-x-auto whitespace-pre">
                    {JSON.stringify(inspectingProduct, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => {
                  const added = toggleWishlist(inspectingProduct);
                  showToast(
                    added
                      ? `Saved "${inspectingProduct.name || inspectingProduct.title}" to wishlist! ❤️`
                      : `Removed from wishlist`,
                  );
                }}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                  isInWishlist(inspectingProduct.id)
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-[#080e1a] hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 border-[#1e293b]"
                }`}
                title={
                  isInWishlist(inspectingProduct.id)
                    ? "Remove from wishlist"
                    : "Save to wishlist"
                }
              >
                {isInWishlist(inspectingProduct.id)
                  ? "❤️ Saved"
                  : "🤍 Wishlist"}
              </button>
              <button
                type="button"
                onClick={() => setInspectingProduct(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-slate-300 text-xs font-semibold hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={Number(inspectingProduct.stock || 0) <= 0}
                onClick={() => {
                  addToCart(inspectingProduct, 1);
                  showToast(
                    `Added "${inspectingProduct.name || inspectingProduct.title}" to cart! 🛒`,
                  );
                }}
                className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>🛒 Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Products;
