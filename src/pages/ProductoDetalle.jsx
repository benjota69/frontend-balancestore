// Página ProductoDetalle, encargada de mostrar en más dellate cada producto del catalogo
// Accediendo al botón "ver detalles" de cada producto se ingresa gracias a esta página al
// "catalogo/{id}" por ejemplo "catalogo/2" y muestra el producto con el ID 2 de la API.

import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { obtenerProductoPorId, obtenerCatalogo } from "../api";


export default function ProductoDetalle(){
    
    const { id } = useParams();
    const { addToCart } = useCart();
    const [raw, setRaw] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
          try {
            setCargando(true);
            // Si no tienes endpoint individual confiable, usa la función helper que busca en el listado:
            const p = await obtenerProductoPorId(id);
            if (!p) {
              setError("Producto no encontrado");
              return;
            }
            setRaw(p);
          } catch (e) {
            setError("No se pudo cargar el producto");
          } finally {
            setCargando(false);
          }
        })();
    }, [id]);


    const p = useMemo(() => (raw ? normalizeProduct(raw) : null), [raw]);


    function normalizeProduct(p) {
        const title = p.nombre ?? p.title ?? "Producto";
        const description = p.descripcion ?? p.description ?? "";
        const rawPrice = p.precio ?? p.price;
        const originalPrice = rawPrice !== undefined ? Number(rawPrice) : undefined;
        const discount = p.descuento ?? p.discount ?? 0;
        const discountPercent = Number(discount);
        const finalPrice = p.precioFinal ?? p.finalPrice ?? originalPrice;
        let image = p.imagen ?? p.image;
        if (!image && Array.isArray(p?.images) && p.images.length > 0) image = p.images[0];
        if (!image && typeof p?.image === "object" && p.image?.url) image = p.image.url;
        const category = (p.categoria ?? p.category ?? p.tipo ?? "otros");
        const stock = p.stock ?? p.stockDisponible ?? 10;
        return { 
          id: p.id || p._id, 
          title, description, originalPrice, finalPrice,
          discountPercent, image, category, stock 
        };
    }

    if (cargando) return <div className="text-center py-4">Cargando...</div>;
  if (error) return (
    <div className="alert alert-danger">
      {error} <Link to="/app/catalogo" className="ms-2">Volver al catálogo</Link>
    </div>
  );
  if (!p) return null;

  return (
    <div className="container">

      <div className="row g-4">
        <div className="col-12 col-md-5">
          {p.image && (
            <img
              src={p.image}
              alt={p.title}
              className="img-fluid border rounded bg-white"
              style={{ objectFit: "contain", maxHeight: 420, width: "100%" }}
            />
          )}
        </div>
        <div className="col-12 col-md-7">
          <h2 className="mb-1">{p.title}</h2>
          <span className="badge bg-light text-success border mb-3">{String(p.category || "Otros")}</span>
          {p.description && <p className="text-muted">{p.description}</p>}

          <div className="d-flex align-items-center gap-3 my-3">
            {p.discountPercent > 0 && p.originalPrice ? (
              <>
                <span className="text-decoration-line-through text-muted">
                  ${Number(p.originalPrice).toLocaleString("es-CL")}
                </span>
                <span className="badge bg-danger">-{p.discountPercent}%</span>
              </>
            ) : null}
            <span className="fs-4 fw-semibold" style={{ color: "#2e7d32" }}>
              ${Number(p.finalPrice).toLocaleString("es-CL")}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-success"
              onClick={() =>
                addToCart({
                  id: p.id,
                  title: p.title,
                  price: p.finalPrice,
                  image: p.image,
                  stock: p.stock ?? 10,
                })
              }
            >
              Agregar al carrito
            </button>
            <small className="text-muted">Stock: {p.stock ?? 10} unidades</small>
          </div>
        </div>
      </div>
    </div>
  );
}