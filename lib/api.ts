const BASE_URL = "https://dummyjson.com";
/**
 * Login User
 */
export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login Gagal");

  // simpan ke localstorage
  localStorage.setItem("token", data.accessToken);
  return data;
}

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Gagal mengambil produk");
  return await res.json();
}

export async function getUsers(){
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Gagal menampilkan user");
  return await res.json();
}
