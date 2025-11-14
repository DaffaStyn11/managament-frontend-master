"use client";

import { useEffect, useState } from "react";
import { getProducts, getProductDetail } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  ShoppingCart,
  Search,
  Package,
  AlertTriangle,
  Loader2,
  LogOut,
  Users,
  Eye,
  X,
  Truck,
  Shield,
  Ruler,
  Tag,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

import { useRouter } from "next/navigation";

export default function ProdukPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // State untuk modal detail produk
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Fungsi untuk membuka detail produk
  const handleViewDetail = async (productId: number) => {
    setLoadingDetail(true);
    setIsModalOpen(true);
    setSelectedImageIndex(0);
    
    try {
      const detail = await getProductDetail(productId);
      setSelectedProduct(detail);
    } catch (err) {
      console.error("Gagal memuat detail produk:", err);
      setSelectedProduct(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedImageIndex(0);
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-300">
        <Loader2 className="animate-spin w-10 h-10 mb-2 text-blue-500" />
        <p>Memuat produk...</p>
      </div>
    );

  // Jika tidak terautentikasi, useAuth akan redirect ke login
  if (!isAuthenticated) return null;

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

          <div className="flex flex-col sm:flex-row gap-4 items-center">
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

            {/* Tombol User & Logout */}
            <div className="flex gap-2">
              <Button
                onClick={() => router.push("/user")}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                User
              </Button>
              <Button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
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
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-xs mt-3 line-clamp-3">
                    {p.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleViewDetail(p.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Beli
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Produk - VERSI SEDERHANA */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 text-white border border-gray-700">
          {loadingDetail ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin w-12 h-12 mb-4 text-blue-500" />
              <p className="text-gray-400">Memuat detail produk...</p>
            </div>
          ) : selectedProduct ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  {selectedProduct.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Gambar Produk */}
                <div className="w-full h-80 bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Harga & Rating */}
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
                  <div>
                    <p className="text-3xl font-bold text-blue-400">
                      {formatPrice(selectedProduct.price)}
                    </p>
                    {selectedProduct.discountPercentage > 0 && (
                      <p className="text-sm text-green-400">
                        Diskon {selectedProduct.discountPercentage.toFixed(1)}%
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-semibold">
                      {selectedProduct.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="bg-gray-800 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Info Tambahan Singkat */}
                <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Brand</p>
                    <p className="font-semibold">{selectedProduct.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Kategori</p>
                    <p className="font-semibold capitalize">
                      {selectedProduct.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Stok</p>
                    <p
                      className={`font-semibold ${
                        selectedProduct.stock < 10
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {selectedProduct.stock} unit
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Berat</p>
                    <p className="font-semibold">{selectedProduct.weight} kg</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                  >
                    Tutup
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Beli Sekarang
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-400">Gagal memuat detail produk</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
