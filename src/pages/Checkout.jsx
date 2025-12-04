// Página Checkout con datos personales del cliente y llamando el componente "MetodoPago"
// Para poder ingresar una tarjeta o pagar con transferencia.

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Navigate, useNavigate } from "react-router-dom";
import MetodoPago from "../components/MetodoPago"
import { useAuth } from "../context/AuthContext";
import { guardarBoleta } from "../api";
import { useEffect } from "react";

export default function Checkout() {
    
    const navigate = useNavigate();

    const { items, increase, decrease, removeFromCart, clearCart, total } = useCart();
    const [form, setForm] = useState({ nombre:"", apellidos:"", correo:"", calle:"", depto:"", region:"", comuna:"", indicaciones:"" });
    const [mensaje, setMensaje] = useState("");
    const [metodoPago, setMetodoPago] = useState(null);
    const [datosPago, setDatosPago] = useState({});
    const [mostrarModalCuenta, setMostrarModalCuenta] = useState(false);
    const [permitirInvitado, setPermitirInvitado] = useState(false);
    const [cupon, setCupon] = useState("");
    const [cuponValido, setCuponValido] = useState(false);
    const [mensajeCupon, setMensajeCupon] = useState("");

    // Llamamos el Login (Autenticador)
    const { user } = useAuth();

    const formatoNombre = (full) => {
      if (!full) return { nombre: "", apellidos: "" };
      const [nombre, ...rest] = full.trim().split(/\s+/);
      return { nombre: nombre || "", apellidos: rest.join(" ") || "" };
    };

    useEffect(() => {
      if (!user) return;
      const { nombre, apellidos } = user.nombreCompleto
        ? formatoNombre(user.nombreCompleto)
        : { nombre: user.username || "", apellidos: "" };
  
      setForm((f) => ({
        ...f,
        nombre,
        apellidos,
        correo: user.email || f.correo
      }));
    }, [user]);

    // Al entrar al checkout, si no hay usuario autenticado mostramos el modal
    useEffect(() => {
      if (!user && !permitirInvitado) {
        setMostrarModalCuenta(true);
      }
    }, [user, permitirInvitado]);

    // Manejar datos del método de pago
    const handleMetodoPago = (metodo, datos) => {
        setMetodoPago(metodo);
        setDatosPago(datos);
    };

    const procesarPago = async () => {
        if (!form.nombre || !form.apellidos || !form.correo || !form.calle || !form.region || !form.comuna) {
            setMensaje("Por favor completa todos los campos obligatorios");
            return;
        }
        
        // Validar método de pago
        if (!metodoPago) {
            setMensaje("Por favor selecciona un método de pago");
            return;
        }

        // Registrar cupón aplicado (si corresponde) para mostrar en la boleta
        try {
          localStorage.removeItem('cuponAplicado');
          if (cuponValido) {
            localStorage.setItem('cuponAplicado', JSON.stringify({ codigo: 'BIENVENIDO', porcentaje: 10 }));
          }
        } catch {}
        
        if (metodoPago === 'debito' || metodoPago === 'credito') {
            if (!datosPago.numeroTarjeta || !datosPago.nombreTarjeta || !datosPago.vencimientoTarjeta || !datosPago.cvvTarjeta) {
                setMensaje("Por favor completa todos los datos de la tarjeta");
                return;
            }
        }
        
        // Guardar datos para la boleta
        localStorage.setItem('datosCliente', JSON.stringify({
            nombre: form.nombre,
            apellidos: form.apellidos,
            correo: form.correo
        }));
        
        localStorage.setItem('datosDireccion', JSON.stringify({
            calle: form.calle,
            depto: form.depto,
            region: form.region,
            comuna: form.comuna,
            indicaciones: form.indicaciones
        }));
        // Guarda el método elegido al pagar y detalles
        localStorage.setItem('metodoPago', metodoPago);
        localStorage.setItem('datosPago', JSON.stringify(datosPago));

        // Guardar snapshot de los items comprados para boleta
        try { localStorage.setItem('boletaItems', JSON.stringify(items)); } catch {}

        // Generar folio único de la boleta (mismo formato que se muestra en la UI)
        const fecha = new Date();
        const folio = `${fecha.getFullYear()}${String(fecha.getMonth()+1).padStart(2,"0")}${String(fecha.getDate()).padStart(2,"0")}-${String(fecha.getTime()).slice(-6)}`;
        try { localStorage.setItem('folioBoleta', folio); } catch {}

        // Calcular totales igual que en la boleta (descuento + IVA 19%)
        const totalCalculado = items.reduce((s, i) => s + (Number(i.price || 0) * Number(i.qty || 1)), 0);
        const descuentoPorcentaje = cuponValido ? 10 : 0;
        const montoDescuento = descuentoPorcentaje ? Math.round(totalCalculado * (descuentoPorcentaje / 100)) : 0;
        const subtotalConDescuento = totalCalculado - montoDescuento;
        const iva = Math.round(subtotalConDescuento * 0.19);
        const totalConIva = subtotalConDescuento + iva;

        // Preparar datos básicos para guardar la boleta en el backend
        const nombreCliente =
          (user && user.nombreCompleto) ||
          [form.nombre, form.apellidos].filter(Boolean).join(" ");

        const boletaPayload = {
          folio,
          nombreCompleto: nombreCliente,
          email: form.correo || (user ? user.email : null),
          metodoPago,
          total: Number(totalConIva),
          productosJson: JSON.stringify(items || []),
        };

        // Intentar guardar la boleta en el backend.
        // Si algo falla, la compra igualmente continúa, pero se registra en consola.
        try {
          await guardarBoleta(boletaPayload);
        } catch (e) {
          console.error("No se pudo guardar la boleta en el backend:", e);
        }

        // Vaciar carrito tras compra exitosa
        clearCart();
        
        navigate('/app/boleta');
    };

    // Validación y control de flujo según autenticación
    const handlePago = () => {
        setMensaje("");

        // Si no hay usuario autenticado y aún no ha elegido continuar como invitado,
        // mostramos el modal para ofrecer crear cuenta o seguir sin registrarse.
        if (!user && !permitirInvitado) {
            setMostrarModalCuenta(true);
            return;
        }

        procesarPago();
    };

    // Manejo del cupón de descuento
    const handleAplicarCupon = () => {
      const codigo = cupon.trim().toUpperCase();

      if (!codigo) {
        setCuponValido(false);
        setMensajeCupon("Ingresa un cupón para aplicarlo.");
        try { localStorage.removeItem('cuponAplicado'); } catch {}
        return;
      }

      if (codigo === "BIENVENIDO") {
        if (!items || items.length === 0) {
          setCuponValido(false);
          setMensajeCupon("Agrega productos al carrito para usar el cupón.");
          try { localStorage.removeItem('cuponAplicado'); } catch {}
          return;
        }
        setCuponValido(true);
        setMensajeCupon("¡Cupón aplicado! Tienes un 10% de descuento en esta compra.");
        try {
          localStorage.setItem('cuponAplicado', JSON.stringify({ codigo: 'BIENVENIDO', porcentaje: 10 }));
        } catch {}
      } else {
        setCuponValido(false);
        setMensajeCupon("Cupón inválido. Revisa el código o intenta con otro.");
        try { localStorage.removeItem('cuponAplicado'); } catch {}
      }
    };

    // Regiones y comunas básicas (demostración)
    const regiones = [
        { value: "rm", label: "Región Metropolitana de Santiago" },
        { value: "v", label: "Valparaíso" },
        { value: "biobio", label: "Biobío" }
    ];
    const comunasPorRegion = {
        rm: ["Cerrillos", "Providencia", "Colina", "Lampa", "Pirque", "Puente Alto", "Paine", "Curacaví", "Cerro Navia"],
        v: ["Valparaíso", "Viña del Mar", "Quilpué", "Quillota", "La Calera", "La Cruz"],
        biobio: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Los Álamos", "Penco", "Hualpén"],
    };

    const totalConDescuento = cuponValido ? total * 0.9 : total;

    return (
      <>
        <div className="container-fluid">
      

              <h1 style={{color: '#1b5e20'}}>Checkout</h1>
              <p>Siguiente paso del pago, método de pago y dirección de envío.</p>
              <hr></hr>      
            {/* Información del cliente */}
            <h4 className="mt-4">Información del cliente</h4>
            <p className="text-muted" style={{marginTop:-6}}>Completa la siguiente información</p>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre *</label>
                <input className="form-control" value={form.nombre} onChange={e=>setForm(f=>({...f, nombre:e.target.value}))} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellidos *</label>
                <input className="form-control" value={form.apellidos} onChange={e=>setForm(f=>({...f, apellidos:e.target.value}))} />
              </div>
              <div className="col-md-12">
                <label className="form-label">Correo *</label>
                <input type="email" className="form-control" value={form.correo} onChange={e=>setForm(f=>({...f, correo:e.target.value}))} />
                <hr></hr>
              </div>
            </div>
      
            {/* Dirección de entrega */}
            <h4>Dirección de entrega de los productos</h4>
            <p className="text-muted" style={{marginTop:-6}}>Ingrese dirección de forma detallada</p>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Dirección 1 *</label>
                <input className="form-control" value={form.calle} onChange={e=>setForm(f=>({...f, calle:e.target.value}))} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Número (opcional)</label>
                <input className="form-control" value={form.depto} onChange={e=>setForm(f=>({...f, depto:e.target.value}))} placeholder="Ej: 603" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Región *</label>
                <select className="form-select" value={form.region} onChange={e=>setForm(f=>({ ...f, region:e.target.value, comuna:"" }))}>
                  <option value="">Selecciona región</option>
                  {regiones.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Comuna *</label>
                <select className="form-select" value={form.comuna} onChange={e=>setForm(f=>({...f, comuna:e.target.value}))} disabled={!form.region}>
                  <option value="">Selecciona comuna</option>
                  {(comunasPorRegion[form.region] || []).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Indicaciones para la entrega (opcional)</label>
                <textarea className="form-control" rows={3} value={form.indicaciones} onChange={e=>setForm(f=>({...f, indicaciones:e.target.value}))} placeholder="Ej.: Vehículo gris afuera de la casa."></textarea>
                <hr></hr>
              </div>
            </div>
                <h4>Método de pago</h4>
            <div>
              <MetodoPago onChange={handleMetodoPago} />
            </div>

            {/* Cupón de descuento */}
            <div className="mt-3">
              <h5>Cupón de descuento</h5>
              <p className="text-muted" style={{ marginTop: -6 }}>
                Usa tu cupón de bienvenida <strong>BIENVENIDO</strong> para obtener un 10% de descuento en esta compra.
              </p>
              <div className="row g-2 align-items-center">
                <div className="col-sm-8 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value)}
                    placeholder="Ingresa tu cupón (ej: BIENVENIDO)"
                  />
                </div>
                <div className="col-sm-4 col-md-3">
                  <button
                    type="button"
                    className="btn btn-outline-success w-100"
                    onClick={handleAplicarCupon}
                  >
                    Aplicar cupón
                  </button>
                </div>
              </div>
              {mensajeCupon && (
                <div className={`mt-2 small ${cuponValido ? 'text-success' : 'text-danger'}`}>
                  {mensajeCupon}
                </div>
              )}
              <hr />
            </div>
          
            <div className="d-flex justify-content-end gap-2 mb-2">
              <button type="button" className="btn btn-success" onClick={handlePago}>
                Hacer el pago ${Number(totalConDescuento).toLocaleString('es-CL')}
              </button>
            </div>
          
            {mensaje && <div className="alert alert-warning mb-4">{mensaje}</div>}
          </div>

        {/* Modal para ofrecer creación de cuenta al usuario no autenticado */}
        {mostrarModalCuenta && (
          <>
            <div className="modal fade show d-block modal-anim" tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header" style={{ borderBottomColor: '#cfe8d8' }}>
                    <h5 className="modal-title" style={{ color: '#2e7d32' }}>¿Aún no tienes una cuenta?</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setPermitirInvitado(true);
                        setMostrarModalCuenta(false);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p className="mb-2">
                      Puedes crear una cuenta en BalanceStore para guardar tus datos, seguir tus compras y pagar más rápido en el futuro.
                    </p>
                    <p className="mb-2" style={{ fontSize: '0.9rem', color: '#2e7d32', fontWeight: 500 }}>
                      Como bienvenida, puedes usar el cupón <strong>BIENVENIDO</strong> y obtener un <strong>10% de descuento</strong> en esta compra.
                    </p>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                      Si prefieres, también puedes continuar con el pago como invitado sin registrarte.
                    </p>
                  </div>
                  <div className="modal-footer" style={{ borderTopColor: '#cfe8d8' }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setPermitirInvitado(true);
                        setMostrarModalCuenta(false);
                        procesarPago();
                      }}
                    >
                      Hacerlo más tarde
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => navigate('/login', { state: { from: '/app/checkout' } })}
                    >
                      Crear cuenta ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show modal-backdrop-anim"></div>
          </>
        )}
      </>
    );
}