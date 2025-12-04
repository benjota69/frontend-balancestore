// Aquí se define las Rutas de las páginas, por ejemplo "/app/catalogo" y entrará a la página Catalogo

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Descuento from "./pages/Descuento";
import Checkout from "./pages/Checkout";
import PaginaBoleta from "./pages/PaginaBoleta";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProductoDetalle from "./pages/ProductoDetalle";

function App() {
  return (
    <AuthProvider>
        <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="catalogo" element={<Catalogo />} />
              <Route path="catalogo/:id" element={<ProductoDetalle />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="descuento" element={<Descuento />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="boleta" element={<PaginaBoleta />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </CartProvider>
    </AuthProvider>
  );
}

export default App;
