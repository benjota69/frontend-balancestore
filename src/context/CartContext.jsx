// Autenticación del carrito, guardando en el LocalStorage el carrito.

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const CLAVE_CARRITO = "cart_items"; // clave de almacenamiento en localStorage

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const datosGuardados = localStorage.getItem(CLAVE_CARRITO);
      return datosGuardados ? JSON.parse(datosGuardados) : [];
    } catch {
      return [];
    }
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items)); } catch {}
  }, [items]);

  // Agregar producto al carrito
  function agregarAlCarrito(producto) {
    setItems(productosEnCarritoAnterior => {
      const indiceProducto = productosEnCarritoAnterior.findIndex(item => item.id === producto.id);
      if (indiceProducto >= 0) {
        const carritoActualizado = [...productosEnCarritoAnterior];
        const nuevaCantidad = Math.min(
          (carritoActualizado[indiceProducto].qty || 1) + 1,
          Math.min(producto.stock ?? 10, 10)
        );
        carritoActualizado[indiceProducto] = { ...carritoActualizado[indiceProducto], qty: nuevaCantidad };
        return carritoActualizado;
      }
      const stockMaximo = Math.min(producto.stock ?? 10, 10);
      return [
        ...productosEnCarritoAnterior,
        {
          id: producto.id,
          title: producto.title,
          price: producto.price || 0,
          image: producto.image,
          qty: Math.min(1, stockMaximo)
        }
      ];
    });

    // Mostrar alerta de éxito usando Bootstrap
    try {
      setSuccessMessage("Producto agregado al carrito con éxito");
      setShowSuccess(true);
      window.clearTimeout(window.__cartSuccessTimer);
      window.__cartSuccessTimer = window.setTimeout(() => setShowSuccess(false), 2000);
    } catch {}
  }

  // Alias compatible con el código existente
  const addToCart = agregarAlCarrito;

  // Eliminar producto del carrito
  function eliminarDelCarrito(id) {
    setItems(productosEnCarritoAnterior => productosEnCarritoAnterior.filter(item => item.id !== id));
  }

  const removeFromCart = eliminarDelCarrito;

  // Aumentar cantidad
  function aumentarCantidad(id, stockDisponible = 10) {
    setItems(productosEnCarritoAnterior =>
      productosEnCarritoAnterior.map(item =>
        item.id === id
          ? { ...item, qty: Math.min((item.qty || 1) + 1, Math.min(stockDisponible, 10)) }
          : item
      )
    );
  }

  const increase = aumentarCantidad;

  // Disminuir cantidad
  function disminuirCantidad(id) {
    setItems(productosEnCarritoAnterior =>
      productosEnCarritoAnterior.map(item =>
        item.id === id ? { ...item, qty: Math.max((item.qty || 1) - 1, 1) } : item
      )
    );
  }

  const decrease = disminuirCantidad;

  // Vaciar carrito
  function vaciarCarrito() { setItems([]); }
  const clearCart = vaciarCarrito;

  const count = items.reduce((sum, i) => sum + (i.qty || 1), 0);
  const total = items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);

  return (
    <CartContext.Provider value={{
      items,
      // Nombres descriptivos
      agregarAlCarrito,
      eliminarDelCarrito,
      aumentarCantidad,
      disminuirCantidad,
      vaciarCarrito,
      // Aliases compatibles existentes
      addToCart,
      removeFromCart,
      increase,
      decrease,
      clearCart,
      count,
      total
    }}>
      {showSuccess && (
        <div className="position-fixed start-50 translate-middle-x p-3" style={{ zIndex: 1080, top: '10%' }}>
          <div className="alert alert-success d-flex align-items-center shadow-sm py-2 px-3" role="alert" style={{ maxWidth: 380 }}>
            <svg className="bi flex-shrink-0 me-2" role="img" aria-label="Success:" style={{ width: '1rem', height: '1rem' }}>
              <use xlinkHref="#check-circle-fill"/>
            </svg>
            <div className="small fw-semibold">{successMessage}</div>
          </div>
        </div>
      )}
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }


