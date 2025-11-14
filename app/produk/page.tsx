"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  ShoppingCart,
  Search,
  Package,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProdukPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch data produk
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
        setError("Gagal memuat produk. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    `${p.title} ${p.brand}`.toLowerCase().includes(search.toLowerCase())
  );

  // Format harga USD ke IDR-like
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-300">
        <Loader2 className="animate-spin w-10 h-10 mb-2 text-blue-500" />
        <p>Memuat produk...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-400">
        <AlertTriangle className="w-8 h-8 mb-2" />
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center sm:text-left">
            🛍️ Daftar Produk
          </h1>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari produk..."
              className="bg-[#1f1f1f] border border-gray-700 text-white pl-10 rounded-xl focus:ring-2 focus:ring-blue-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            Tidak ada produk ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p, idx) => (
              <Card
                key={p.id ?? idx}
                className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:scale-[1.02] hover:bg-white/10 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={p.thumbnail || "/no-image.png"}
                    alt={p.title}
                    className="w-full h-44 object-cover"
                  />

                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full ${
                      p.stock < 10
                        ? "bg-red-600/80"
                        : "bg-green-600/80"
                    }`}
                  >
                    {p.stock < 10 ? "Stok Menipis" : "Ready"} ({p.stock})
                  </span>
                </div>

                <CardContent className="p-5 text-white">
                  <h3 className="font-semibold text-lg mb-1 truncate">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">{p.brand}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(p.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-300 ml-1">
                      {p.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xl font-semibold text-blue-400">
                      {formatPrice(p.price)}
                    </p>
                    <Button
                      variant="secondary"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Beli
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-xs mt-3 line-clamp-3">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
