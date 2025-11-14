"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  Lock,
  Calendar,
  User,
  Search,
  Filter,
  LogOut,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const { isAuthenticated, isloadingAuth: loadingAuth, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users);
        setFiltered(data.users);
      } catch (error) {
        console.error("Gagal memuat users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (search) {
      result = result.filter((u) =>
        `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    if (filterGender !== "all") {
      result = result.filter((u) => u.gender === filterGender);
    }
    setFiltered(result);
  }, [search, filterGender, users]);

  if (loading || loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Memuat data user...
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-center tracking-wide text-white">
          👥 Daftar Pengguna
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("produk")}
            className="bg-blue-400 hover:bg-amber-200 text-white items-center gap-2 whitespace-nowrap"
          >
            <Package className="w-4 h-4"></Package>
            Product
          </Button>
          <Button
            onClick={logout}
            className="bg-red-500 text-white hover:bg-red-300 flex items-center gap-2 whitespace-nowrap"
          >
            <LogOut className="w-4 h-4">Logout</LogOut>
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari nama pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white pl-10 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterGender === "all" ? "default" : "outline"}
            className={`${
              filterGender === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-white border-gray-600"
            }`}
            onClick={() => setFilterGender("all")}
          >
            Semua
          </Button>
          <Button
            variant={filterGender === "male" ? "default" : "outline"}
            className={`${
              filterGender === "male"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-white border-gray-600"
            }`}
            onClick={() => setFilterGender("male")}
          >
            Pria
          </Button>
          <Button
            variant={filterGender === "female" ? "default" : "outline"}
            className={`${
              filterGender === "female"
                ? "bg-pink-600 text-white"
                : "bg-gray-800 text-white border-gray-600"
            }`}
            onClick={() => setFilterGender("female")}
          >
            Wanita
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map((u) => (
          <Card
            key={u.id}
            className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 overflow-hidden"
          >
            <CardHeader className="p-0 overflow-hidden">
              <div className="relative group">
                <img
                  src={u.image || "/no-image.png"}
                  alt={`${u.firstName} ${u.lastName}`}
                  className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${
                    u.gender === "male" ? "bg-blue-600/80" : "bg-pink-600/80"
                  }`}
                >
                  {u.gender}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-5 text-white">
              <CardTitle className="text-xl font-semibold mb-2 text-center text-white">
                {u.firstName} {u.lastName}
              </CardTitle>

              <p className="text-sm text-center mb-4 italic text-gray-300">
                {u.maidenName || "-"} ({u.age} tahun)
              </p>

              <div className="space-y-2 text-sm text-white">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>{u.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>{u.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span>{u.username}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-400" />
                  <span className="truncate">{u.password}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>{u.birthDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
