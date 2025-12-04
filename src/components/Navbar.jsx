// Componente NavBar, básicamente barra que está en la parte superior de la página.
// Encargado de poder navegar por las páginas, ver catálogo, etc.

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor:'#e9f5ec', borderBottom:'1px solid #cfe8d8' }}>
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-semibold" to="/app" style={{color:'#2e7d32'}}>BalanceStore</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/app" style={({isActive})=>({color:isActive?'#1b5e20':'#2e7d32'})}>Home</NavLink>
            </li>
          
            <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={({isActive})=>({color:isActive?'#1b5e20':'#2e7d32'})}> 
              Categorías </NavLink>
              <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/app/catalogo" >Catálogo</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=perifericos" >Periféricos</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=audio" >Audio</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=notebook" >Notebook</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=celulares" >Celulares</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=mobiliario" >Mobiliario</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=pantallas" >Pantallas</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=consolas" >Consolas</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=accesorios" >Accesorios</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=streaming" >Streaming</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=iluminacion" >Iluminación</a></li>
                  <li><a className="dropdown-item" href="/app/catalogo?cat=hardware" >Hardware</a></li>

              </ul>
              </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/app/descuento" style={({isActive})=>({color:isActive?'#1b5e20':'#2e7d32'})}>Descuentos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/app/nosotros" style={({isActive})=>({color:isActive?'#1b5e20':'#2e7d32'})}>Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/app/contacto" style={({isActive})=>({color:isActive?'#1b5e20':'#2e7d32'})}>Contacto</NavLink>
            </li>
          </ul>
        
          <div className="ms-auto d-flex align-items-center gap-2">
            <button
             type="button" 
             className="btn btn-outline-primary" 
             onClick={() => navigate('/app/carrito')}>🛒 Carrito {count > 0 ? `(${count})` : ''}</button>
            {user ? (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success"
              onClick={() => navigate('/login', { state: { from: location.pathname + location.search } })}
              >
                Iniciar sesión / Crear cuenta
              </button>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}


