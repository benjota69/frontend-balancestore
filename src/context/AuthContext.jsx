// Autenticación del LOGIN

import { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext();

// Clave en localStorage para persistir el usuario autenticado
const CLAVE_USUARIO = "authUser";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const datosGuardados = localStorage.getItem(CLAVE_USUARIO);
      return datosGuardados ? JSON.parse(datosGuardados) : null;
    } catch (_e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(CLAVE_USUARIO, JSON.stringify(user));
      } else {
        localStorage.removeItem(CLAVE_USUARIO);
      }
    } catch (_e) {
    }
  }, [user]);

  // Nombres descriptivos
  const iniciarSesion = useCallback((datosUsuario) => {
    setUser(datosUsuario);
  }, []);

  const cerrarSesion = useCallback(() => {
    setUser(null);
  }, []);

  // Aliases compatibles con el código existente
  const login = iniciarSesion;
  const logout = cerrarSesion;

  return (
    <AuthContext.Provider value={{ user, iniciarSesion, cerrarSesion, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
