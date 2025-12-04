// Componente Productos, el encargado de mostrar los Productos que se comunican
// gracias a la API definida en "api.jsx".

import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { obtenerCatalogo } from "../api";
import { useCart } from "../context/CartContext";

export default function Productos({ 
  title = "Productos",
  subtitle = "",
  showFilters = true,
  showSorting = true,
  filterByCategory = null,
  filterByDiscount = false,
  limit = null,
  className = ""
}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Configuración de filtros y ordenamiento
  const categoriaInicial = filterByCategory || (searchParams.get('cat') || 'todas').toLowerCase();
  const [category, setCategory] = useState(categoriaInicial);
  const ordenInicial = (searchParams.get('sort') || 'price_desc').toLowerCase();
  const [sort, setSort] = useState(ordenInicial);
  
  const { addToCart } = useCart();

  // Mantener sincronizado el estado con el query param cuando cambie
  useEffect(() => {
    const nuevaCategoria = (searchParams.get('cat') || 'todas').toLowerCase();
    if (nuevaCategoria !== category) setCategory(nuevaCategoria);
  }, [searchParams]);

  // Función para normalizar productos (extraída de ambos archivos)
  function normalizeProduct(producto) {
    const title = producto.nombre ?? producto.title ?? "Producto";
    const description = producto.descripcion ?? producto.description ?? "";
    
    const precioNormal = producto.precio ?? producto.price;
    const precioOriginal = precioNormal !== undefined ? Number(precioNormal) : undefined;
    
    const descuento = producto.descuento ?? producto.discount ?? 0;
    const porcentajeDescuento = Number(descuento);
    const precioFinal = producto.precioFinal ?? producto.finalPrice ?? precioOriginal;
    
    let imagen = producto.imagen ?? producto.image;
    if (!imagen && Array.isArray(producto?.images) && producto.images.length > 0) imagen = producto.images[0];
    if (!imagen && typeof producto?.image === "object" && producto.image?.url) imagen = producto.image.url;

    const categoria = (producto.categoria ?? producto.category ?? producto.tipo ?? 'otros');
    const stock = producto.stock ?? producto.stockDisponible ?? 10;

    return { 
        id: producto.id || producto._id || cryptoRandomId(), 
        title, 
        description, 
        originalPrice: precioOriginal, 
        finalPrice: precioFinal,
        discountPercent: porcentajeDescuento,
        image: imagen, 
        category: categoria, 
        stock 
    };
  }

  function cryptoRandomId() {
    try {
      return Math.random().toString(36).slice(2);
    } catch {
      return Date.now();
    }
  }

  // Cargar productos
  useEffect(() => { 
    (async () => {
      try {
        setCargando(true);
        const datosCatalogo = await obtenerCatalogo();
        const listaProductos = Array.isArray(datosCatalogo) ? datosCatalogo : (datosCatalogo.products || []);
        const productosNormalizados = listaProductos.map((productoSinNormalizar) => normalizeProduct(productoSinNormalizar));
        
        // Aplicar filtro de descuento si es necesario
        let productosFiltradosPorDescuento = productosNormalizados;
        if (filterByDiscount) {
          productosFiltradosPorDescuento = productosNormalizados.filter(producto => producto.discountPercent > 0);
        }
        
        setProductos(productosFiltradosPorDescuento);
      } catch (error) {
        setError("No se pudo cargar el catálogo");
      } finally {
        setCargando(false);
      }
    })();
  }, [filterByDiscount]);

  // Calcular categorías disponibles e incluir la categoría actual si no existe
  const categoriasDisponibles = useMemo(() => {
    const categoriasUnicas = new Set(productos.map(producto => String(producto.category || 'otros').toLowerCase()));
    const listaCategorias = ['todas', ...Array.from(categoriasUnicas)];
    if (category && !listaCategorias.includes(category)) listaCategorias.push(category);
    return listaCategorias;
  }, [productos, category]);

  // Sin fallback: si no existe, se mostrará "No hay productos" respetando la URL

  // Filtrar por categoría
  const productosFiltrados = useMemo(() => {
    if (category === 'todas') return productos;
    return productos.filter(producto => String(producto.category || 'otros').toLowerCase() === category);
  }, [productos, category]);

  // Ordenar productos
  const productosOrdenados = useMemo(() => {
    const copiaDeProductos = [...productosFiltrados];
    if (sort === 'price_desc') {
      return copiaDeProductos.sort((productoA, productoB) => (Number(productoB.finalPrice||0)) - (Number(productoA.finalPrice||0)));
    }
    if (sort === 'category') {
      return copiaDeProductos.sort((productoA, productoB) => String(productoA.category||'').localeCompare(String(productoB.category||'')));
    }
    return copiaDeProductos;
  }, [productosFiltrados, sort]);

  // Aplicar límite si se especifica
  const productosAMostrar = useMemo(() => {
    return limit ? productosOrdenados.slice(0, limit) : productosOrdenados;
  }, [productosOrdenados, limit]);

  // Manejar cambios de filtros
  function handleCategoryChange(nuevaCategoria) {
    setCategory(nuevaCategoria);
    if (showFilters) {
      const nuevosParametros = new URLSearchParams(searchParams);
      if (nuevaCategoria && nuevaCategoria !== 'todas') nuevosParametros.set('cat', nuevaCategoria); 
      else nuevosParametros.delete('cat');
      setSearchParams(nuevosParametros, { replace: true });
    }
  }

  function handleSortChange(nuevoOrden) {
    setSort(nuevoOrden);
    if (showSorting) {
      const nuevosParametros = new URLSearchParams(searchParams);
      if (nuevoOrden) nuevosParametros.set('sort', nuevoOrden); 
      else nuevosParametros.delete('sort');
      setSearchParams(nuevosParametros, { replace: true });
    }
  }

  return (
    <div className={`container-fluid ${className}`}>
      {/* Header con título y controles */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">{title}</h2>
          {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
        </div>
        
        {(showFilters || showSorting) && (
          <div className="d-flex align-items-center gap-3">
            {showFilters && (
              <div className="d-flex align-items-center gap-2">
                <label htmlFor="cat" className="text-muted" style={{fontSize:'.9rem'}}>Categoría</label>
                <select id="cat" className="form-select form-select-sm" style={{width:180}}
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}>
                  {categoriasDisponibles.map((categoria) => (
                    <option key={categoria} value={categoria}>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</option>
                  ))}
                </select>
              </div>
            )}
            
            {showSorting && (
              <div className="d-flex align-items-center gap-2">
                <label htmlFor="sort" className="text-muted" style={{fontSize:'.9rem'}}>Ordenar</label>
                <select id="sort" className="form-select form-select-sm" style={{width:200}}
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="price_desc">Precio: mayor a menor</option>
                  <option value="category">Categoría (A-Z)</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid de productos */}
      <div className="card border-success-subtle shadow-sm">
        <div className="card-body">
          {cargando && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status" aria-hidden="true"></div>
              <div className="mt-2 text-muted">Cargando...</div>
            </div>
          )}

          {!cargando && error && (
            <div className="alert alert-danger mb-0" role="alert">{error}</div>
          )}

          {!cargando && !error && productos.length === 0 && (
            <p className="text-muted mb-0">No hay productos.</p>
          )}

          {!cargando && !error && productos.length > 0 && (
            <div className="row g-3">
              {productosAMostrar.map((producto) => (
                <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100">
                    {producto.image && (
                      <Link to={`/app/catalogo/${producto.id}`} className="d-block">
                        <img src={producto.image} className="card-img-top" alt={producto.title} 
                             style={{objectFit:'contain', height:'160px', background:'#fff'}} />
                      </Link>
                    )} 
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title" style={{minHeight:'3rem'}}>{producto.title}</h5>
                      <span className="badge" style={{alignSelf:'flex-start', background:'#e9f5ec', color:'#2e7d32', border:'1px solid #cfe8d8'}}>
                        {String(producto.category || 'Otros')}
                      </span>
                      {producto.description && (
                        <p className="card-text text-muted" style={{fontSize:'.9rem'}}>
                          {String(producto.description).substring(0,100)}
                          {String(producto.description).length>100?'...':''}
                        </p>
                      )}
                      <div className="mt-auto d-flex flex-column gap-2">
                        {producto.discountPercent > 0 && (
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-decoration-line-through text-muted small">
                              ${Number(producto.originalPrice).toLocaleString('es-CL')}
                            </span>
                            <span className="badge bg-danger small">
                              -{producto.discountPercent}%
                            </span>
                          </div>
                        )}
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold" style={{color:'#2e7d32'}}>
                            ${Number(producto.finalPrice).toLocaleString('es-CL')}
                          </span>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/app/catalogo/${producto.id}`}
                              className="btn btn-sm btn-success"
                            >
                              Ver detalle
                            </Link>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-success" 
                              onClick={() => addToCart({ 
                                id: producto.id, 
                                title: producto.title, 
                                price: producto.finalPrice, 
                                image: producto.image, 
                                stock: producto.stock ?? 10 
                              })}
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}