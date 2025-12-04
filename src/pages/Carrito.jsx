// Página Carrito

import { useState } from "react";
import { useCart } from "../context/CartContext";
// Importamos Navigate para la navegación del botón de pagar y que pase a la pagina (checkout)
import { useNavigate } from "react-router-dom"

export default function Carrito() {
  const { items, increase, decrease, removeFromCart, clearCart, total } = useCart();
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Regiones y comunas básicas
  const regiones = [
    { value: "rm", label: "Región Metropolitana de Santiago" },
    { value: "v", label: "Valparaíso" },
    { value: "biobio", label: "Biobío" }
  ];
  const comunasPorRegion = {
    rm: ["Cerrillos", "Providencia", "Santiago"],
    v: ["Valparaíso", "Viña del Mar", "Quilpué"],
    biobio: ["Concepción", "Talcahuano", "San Pedro de la Paz"],
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Carrito de compra</h2>
        <span className="mb-0" style={{color: '#1b5e20', border:'1px solid #1b5e20', borderRadius:'5px', padding:'5px'}}>Total a pagar: ${Number(total).toLocaleString('es-CL')}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">Tu carrito está vacío.</p>
      ) : (
        <div className="card mb-4">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => (
                    <tr key={p.id}>
                      <td>{p.image && <img src={p.image} alt={p.title} style={{width:48, height:48, objectFit:'contain', background:'#fff', border:'1px solid #eee', borderRadius:4}} />}</td>
                      <td>{p.title}</td>
                      <td>${Number(p.price||0).toLocaleString('es-CL')}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => decrease(p.id)}>-</button>
                          <span>{p.qty || 1}</span>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => increase(p.id, p.stock || 10)}>+</button>
                        </div>
                      </td>
                      <td>${Number((p.price||0) * (p.qty||1)).toLocaleString('es-CL')}</td>
                      <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(p.id)}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

        <div className="d-flex justify-content-end gap-2 mb-2">
          <button className="btn btn-outline-danger" onClick={clearCart}>Vaciar carrito</button>
          <button
            className="btn btn-success"
            // Hacemos la validación en caso de que esté el carrito vacio, sí esta vacio se deshabilita el botón de "Siguiente" y no pasa al "Checkout"
            disabled={items.length === 0}
            onClick={() => {
              if (items.length === 0) { setMensaje("Tu carrito está vacío"); return; }
              navigate('/app/checkout');
            }}
          >
            Siguiente ${Number(total).toLocaleString('es-CL')}
          </button>

        </div>
      {mensaje && <div className="alert alert-success mb-4">{mensaje}</div>}
    </div>
  );
}


