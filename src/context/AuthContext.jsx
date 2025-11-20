import { createContext, useState, useEffect } from "react";
import apiClient from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      if (accessToken && storedUser) {
        try {
          // Verificar token con /me
          const { data } = await apiClient.get("/users/me");
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token inválido, deslogueando");
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    // ✅ CAMBIO: Crear FormData en lugar de JSON
    const formData = new URLSearchParams();
    formData.append("username", email); // ⚠️ IMPORTANTE: 'username', no 'email'
    formData.append("password", password);

    const { data } = await apiClient.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (userData) => {
    const { data } = await apiClient.post("/auth/register", userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
