"useclient";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isloadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    //CEK TOKE DILOCALSTORAGE

    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/");
    }
    setLoadingAuth(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token"), setIsAuthenticated(false);
    router.push("/");
  };

  return {isAuthenticated, isloadingAuth, logout}
}
