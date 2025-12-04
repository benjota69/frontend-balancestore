// Componente Boleta, Encargado de generar la boleta y la plantilla por defecto una vez hecha la compra.
// Depende de la compra si es Transferencia o Tarjeta va cambiando la boleta final.
// Se hace como un componente ya que se reutiliza muchas veces la generación de una Boleta.

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import compraCorrecta from "../img/compraCorrecta.png"

function clp(n) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(Number(n || 0));
}

// Mapeo de regiones para mostrar nombres completos
const regionesMap = {
  rm: "Región Metropolitana de Santiago",
  v: "Valparaíso", 
  biobio: "Biobío"
};

export default function Boleta({ cliente = {}, direccion = {}, metodoPago, datosPago = {}, cupon = null }) {
  const { items } = useCart();
  const [folio, setFolio] = useState("");

  // Obtener el folio generado en el checkout (o generar uno si no existe)
  useEffect(() => {
    try {
      const guardado = localStorage.getItem('folioBoleta');
      if (guardado) {
        setFolio(guardado);
        return;
      }
    } catch {}

    const fecha = new Date();
    const nuevoFolio = `${fecha.getFullYear()}${String(fecha.getMonth()+1).padStart(2,"0")}${String(fecha.getDate()).padStart(2,"0")}-${String(fecha.getTime()).slice(-6)}`;
    setFolio(nuevoFolio);
    try { localStorage.setItem('folioBoleta', nuevoFolio); } catch {}
  }, []);

  // Si el carrito ya fue vaciado, usamos el snapshot guardado en localStorage
  let itemsParaMostrar = items;
  try {
    if (!items || items.length === 0) {
      const raw = localStorage.getItem('boletaItems');
      itemsParaMostrar = raw ? JSON.parse(raw) : [];
    }
  } catch {}

  const totalCalculado = itemsParaMostrar.reduce((s, i) => s + (Number(i.price || 0) * Number(i.qty || 1)), 0);

  const descuentoPorcentaje = cupon?.porcentaje || 0;
  const montoDescuento = descuentoPorcentaje ? Math.round(totalCalculado * (descuentoPorcentaje / 100)) : 0;
  const subtotalConDescuento = totalCalculado - montoDescuento;

  const iva = Math.round(subtotalConDescuento * 0.19);
  const totalConIva = subtotalConDescuento + iva;

  // Construir dirección completa
  const direccionCompleta = [
    direccion.calle,
    direccion.depto && `Dpto ${direccion.depto}`,
    direccion.comuna,
    direccion.region && regionesMap[direccion.region]
  ].filter(Boolean).join(", ");

  return (
    <>
      {metodoPago === 'transferencia' ? (
        <>
          <h4 style={{ textAlign: 'center' }}>
            Pedido recibido. Pendiente de confirmación de transferencia. nro #{folio}
          </h4>
          <h5 style={{ textAlign: 'center' }}>
            Envía el comprobante del pago y número de boleta a <a href="https://mail.google.com/mail/u/0/#inbox?compose=DmwnWrRlRQkzvBNFFmkljnrhjlGdKRwVvDqfZWHbNZQqfPLBMDSbtlBbsrcZLDLrVBLkQvmDDKqg">pagos@balancenew.com</a> para validar tu pago. Tiempo estimado 1–4 horas hábiles.
          </h5>
          <div className="alert alert-secondary text-center" role="alert">
            <div>
              <strong>Datos de Transferencia</strong>
              <hr></hr>
              <strong>Banco:</strong> BancoEstado
              <br></br>
              <strong>Tipo de Cuenta:</strong> Cuenta Corriente
              <br></br>
              <strong>Número de Cuenta:</strong> 12-345-67890
              <br></br>
              <strong>Titular:</strong> BALANCENEW EMPRESA
              <br></br>
              <strong>Rut:</strong> 12.345.678-9
            </div>
          </div>
        </>
      ) : (
        <>
          <h4 style={{ textAlign: 'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            <img src={compraCorrecta} alt="Compra correcta" style={{ width: 28, height: 28, objectFit:'contain' }} />
            Se ha realizado la compra. nro #{folio}
          </h4>
          <h5 style={{ textAlign: 'center' }}>
            Hemos recibido tu pago correctamente, para mayor información, revisar el correo que se te ha enviado.
          </h5>
        </>
      )}
  
      <hr></hr>
      <div>
        <h1 style={{color:'#1b5e20'}}>Boleta #{folio}</h1>
      </div>
  
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <strong style={{color:'#1b5e20'}}>Boleta electrónica</strong>
            <div className="text-muted" style={{fontSize:12}}>Boleta número #{folio}</div>
          </div>
          <button type="button" className="btn btn-sm btn-outline-success" onClick={() => window.print()}>
            Imprimir Boleta
          </button>
        </div>
  
        <div className="card-body">
          {/* Encabezados Emisor / Receptor */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <h6 className="mb-2">Emisor</h6>
              <div className="text-muted" style={{fontSize:14}}>
                <div>BALANCENEW SpA</div>
                <div>RUT 12.345.678-9</div>
                <div>pagos@balancenew.com</div>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="mb-2">Receptor</h6>
              <div style={{fontSize:14}}>
                <div><strong>{[cliente.nombre, cliente.apellidos].filter(Boolean).join(" ") || "—"}</strong></div>
                <div className="text-muted">{cliente.correo || "—"}</div>
                <div className="text-muted">{direccionCompleta || "—"}</div>
              </div>
            </div>
          </div>
  
          {/* Cabecera de columnas (sin tabla) */}
          <div className="d-none d-md-flex text-muted border-bottom py-2">
            <div className="flex-grow-1">Producto</div>
            <div style={{width:100}} className="text-end">Cantidad</div>
            <div style={{width:140}} className="text-end">P. unitario</div>
            <div style={{width:140}} className="text-end">Subtotal</div>
          </div>
  
          {/* Items */}
          <div className="mt-2">
            {itemsParaMostrar.length === 0 && (
              <div className="text-center text-muted py-3">No hay productos en el carrito</div>
            )}
  
            {itemsParaMostrar.map(i => {
              const qty = i.qty || 1;
              const sub = (i.price || 0) * qty;
  
              return (
                <div key={i.id} className="py-3 border-bottom">
                  <div className="d-flex align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        {i.image && <img src={i.image} alt={i.title} style={{width:40, height:40, objectFit:"cover", borderRadius:6}} />}
                        <div className="fw-medium">{i.title}</div>
                      </div>
                      {/* Etiquetas móviles */}
                      <div className="d-md-none mt-2 small text-muted">
                        <div className="d-flex justify-content-between">
                          <span>Cantidad</span><span>{qty}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>P. unitario</span><span>{clp(i.price)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Subtotal</span><span>{clp(sub)}</span>
                        </div>
                      </div>
                    </div>
  
                    {/* Valores desktop alineados a la derecha */}
                    <div className="d-none d-md-block text-end" style={{width:100}}>{qty}</div>
                    <div className="d-none d-md-block text-end" style={{width:140}}>{clp(i.price)}</div>
                    <div className="d-none d-md-block text-end" style={{width:140}}>{clp(sub)}</div>
                  </div>
                </div>
              );
            })}
          </div>
  
          {/* Totales (sin tfoot) */}
          <div className="mt-3">
            <div className="d-flex justify-content-end">
              <div style={{width:280, maxWidth:"100%"}}>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Subtotal</span>
                  <span>{clp(totalCalculado)}</span>
                </div>
                {montoDescuento > 0 && (
                  <>
                    <div className="d-flex justify-content-between py-1">
                      <span className="text-muted">
                        Descuento cupón {cupon?.codigo} ({descuentoPorcentaje}%)
                      </span>
                      <span>-{clp(montoDescuento)}</span>
                    </div>
                    <div className="d-flex justify-content-between py-1">
                      <span className="text-muted">Subtotal con descuento</span>
                      <span>{clp(subtotalConDescuento)}</span>
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">IVA (19%)</span>
                  <span>{clp(iva)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-top">
                  <strong>Total</strong>
                  <strong>{clp(totalConIva)}</strong>
                </div>
              </div>
            </div>
          </div>
  
          {direccion.indicaciones && (
            <div className="mt-3">
              <h6>Indicaciones de entrega</h6>
              <div className="text-muted" style={{whiteSpace:"pre-wrap"}}>{direccion.indicaciones}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}