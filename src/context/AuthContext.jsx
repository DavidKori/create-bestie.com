import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(
    localStorage.getItem("token") ? true : false
  );

  const login = (token) => {
    localStorage.setItem("token", token);
    setAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
