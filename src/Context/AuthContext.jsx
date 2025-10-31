import React, { createContext, useContext, useState, useEffect } from "react";
import axiosConfig from "../Service/AxiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [user_id, setUserId] = useState(() => {
    try {
      const saved = localStorage.getItem("user_id");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosConfig.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (token, user_id, userData = {}) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", JSON.stringify(user_id));
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUserId(user_id);
    setUser(userData);

    axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("mobileno");
    localStorage.removeItem("profile_completed");
    setToken(null);
    setUser(null);
    setUserId(null);
    delete axiosConfig.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, user_id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
