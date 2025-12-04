// Componente Login, el encargado del inicio sesión y registro de cuenta, tomando datos como
// Usuario, Nombre Completo, Correo electrónico y contraseña.

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUsuario, registrarUsuario } from "../api";

export default function Login() {
  const [modo, setModo] = useState("login"); // Estados sí está en login / registro
  const [identifier, setIdentifier] = useState(""); // Identificador de si es Correo o Usuario quien se logea.
  const [password, setPassword] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevoNombreCompleto, setNombreCompleto] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errors, setErrors] = useState({}); // validaciones básicas
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const esEmailBasico = (s) => s && s.includes('@') && s.includes('.');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    const errs = {};
    
    if (!identifier.trim()) errs.identifier = "Ingresa usuario o correo";
    else if (identifier.includes('@') && !esEmailBasico(identifier)) errs.identifier = "Correo inválido";
    else if (!identifier.includes('@') && (identifier.trim().length < 3 || identifier.includes(' '))) errs.identifier = "Usuario inválido";
    if (!password) errs.password = "Ingresa tu contraseña";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      const usuario = await loginUsuario({ identifier, password });
      login({ 
        username: usuario.username, 
        nombreCompleto: usuario.name, 
        email: usuario.email 
      });

      const destino = location.state?.from || "/app";
      navigate(destino);
    } catch (e) {
      setError(e.message || "No se pudo iniciar sesión");
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    // Validaciones para el registro
    const errs = {};
    if (nuevoUsuario.trim().length < 3 || nuevoUsuario.includes(' ')) errs.usuario = "Usuario inválido";
    if ((nuevoNombreCompleto||'').trim().length < 10) errs.nombreCompleto = "Nombre completo inválido (mínimo 10 caracteres)";
    if (nuevoEmail && !esEmailBasico(nuevoEmail)) errs.email = "Correo inválido";
    if ((nuevoPassword||'').length < 6) errs.password = "Mínimo 6 caracteres";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!nuevoUsuario || !nuevoPassword || !nuevoNombreCompleto) {
      setError("Completa usuario, nombre completo y contraseña");
      return;
    }

    try {
      const nuevo = await registrarUsuario({
        username: nuevoUsuario,
        nombreCompleto: nuevoNombreCompleto,
        email: nuevoEmail || null,
        password: nuevoPassword,
      });

      // Inicio de sesión automático tras registrarse
      login({ 
        username: nuevo.username, 
        nombreCompleto: nuevo.name, 
        email: nuevo.email 
      });

      const destino = location.state?.from || "/app";
      navigate(destino);
    } catch (e) {
      setError(e.message || "No se pudo crear la cuenta");
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="auth-card card shadow-sm w-100" style={{maxWidth: 440}}>
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <div className="auth-brand fw-semibold" style={{color:'#2e7d32'}}>BalanceStore</div>
            <div className="auth-legend text-muted">{modo === "login" ? "Bienvenido a la mejor tienda electrónica" : "Crea tu cuenta en segundos"}</div>
          </div>

          <div className="auth-tabs btn-group w-100 mb-3" role="group" aria-label="Cambiar modo">
            <button
              type="button"
              className={`btn ${modo === 'login' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setModo('login')}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={`btn ${modo === 'registro' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setModo('registro')}
            >
              Crear cuenta
            </button>
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">{error}</div>
          )}
          {mensaje && (
            <div className="alert alert-success py-2" role="alert">{mensaje}</div>
          )}

          {modo === "login" ? (
            <form onSubmit={handleLogin} className="needs-validation" noValidate>
              <div className="mb-3">
                <label className="form-label">Usuario o correo</label>
                <input
                  type="text"
                  className={`form-control ${errors.identifier ? 'is-invalid' : ''}`}
                  placeholder="tuusuario o correo@dominio.com"
                  autoComplete="username email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                {errors.identifier && <div className="invalid-feedback">{errors.identifier}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100">
                Ingresar
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegistro} className="needs-validation" noValidate>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  className={`form-control ${errors.usuario ? 'is-invalid' : ''}`}
                  placeholder="Ej.: pepito123"
                  autoComplete="username"
                  value={nuevoUsuario}
                  onChange={(e) => setNuevoUsuario(e.target.value)}
                  required
                />
                {errors.usuario && <div className="invalid-feedback">{errors.usuario}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombreCompleto ? 'is-invalid' : ''}`}
                  placeholder="Ej.: Juan Pérez"
                  value={nuevoNombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  required
                />
                {errors.nombreCompleto && <div className="invalid-feedback">{errors.nombreCompleto}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Correo (opcional)</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="correo@dominio.com"
                  autoComplete="email"
                  value={nuevoEmail}
                  onChange={(e) => setNuevoEmail(e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Crea una contraseña segura"
                  autoComplete="new-password"
                  value={nuevoPassword}
                  onChange={(e) => setNuevoPassword(e.target.value)}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                <small className="form-text text-muted">Mínimo 6 caracteres</small>
              </div>
              <button type="submit" className="btn btn-success w-100">
                Crear cuenta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}