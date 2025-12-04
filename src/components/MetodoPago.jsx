// Componente Metodo de pago, basicamente el número de tarjeta, nombre del propietario de la tarjeta
// CVV y Fecha de caducidad. con sus validaciones
// tipos de Métodos de Pago (Débito, Crédito, Transferencia).

import { useState } from 'react';

export default function MetodoPago({ onChange }) {
  const [metodoPago, setMetodoPago] = useState('debito');
  const [tarjeta, setTarjeta] = useState({
    numeroTarjeta: '',
    nombreTarjeta: '',
    vencimientoTarjeta: '',
    cvvTarjeta: '',
    cuotasTarjeta: 1
  });
  const [transferencia, setTransferencia] = useState({
    banco: '',
    titular: '',
    rut: ''
  });

  const elegirMetodo = (value) => {
    setMetodoPago(value);
    if (onChange) onChange(value, value === 'transferencia' ? transferencia : tarjeta);
  };

  const elegirTarjeta = (k, v) => {
    const next = { ...tarjeta, [k]: v };
    setTarjeta(next);
    if (onChange) onChange(metodoPago, next);
  };

  const elegirTransferencia = (k, v) => {
    const next = { ...transferencia, [k]: v };
    setTransferencia(next);
    if (onChange) onChange(metodoPago, next);
  };

  //Formateos de los inputs de la Tarjeta ()
  const soloDigitos = (s) => s.replace(/\D/g, '');

  const formatoTarjeta = (v) => {
    const d = soloDigitos(v).slice(0, 16);
    return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim(); // 0000 0000 0000 0000
  };

  const formatoExpiracion = (v) => {
    const d = soloDigitos(v).slice(0, 4);            // MMYY
    if (d.length <= 2) return d;                     // MM
    return `${d.slice(0, 2)}/${d.slice(2)}`;         // MM/YY
  };

  const formatoCvv = (v, len = 3) => soloDigitos(v).slice(0, len);

  return (
    <div className="mb-3">

      <div className="btn-group" role="group" aria-label="Método de pago"> 
        <input
          type="radio"
          className="btn-check"
          name="metodoPago"
          id="mp-debito"
          autoComplete="off"
          value="debito"
          checked={metodoPago === 'debito'}
          onChange={(e) => elegirMetodo(e.target.value)}
        />
        <label className="btn btn-outline-success" htmlFor="mp-debito">Débito</label>

        <input
          type="radio"
          className="btn-check"
          name="metodoPago"
          id="mp-credito"
          autoComplete="off"
          value="credito"
          checked={metodoPago === 'credito'}
          onChange={(e) => elegirMetodo(e.target.value)}
        />
        <label className="btn btn-outline-success" htmlFor="mp-credito">Crédito</label>

        <input
          type="radio"
          className="btn-check"
          name="metodoPago"
          id="mp-transferencia"
          autoComplete="off"
          value="transferencia"
          checked={metodoPago === 'transferencia'}
          onChange={(e) => elegirMetodo(e.target.value)}
        />
        <label className="btn btn-outline-success" htmlFor="mp-transferencia">Transferencia</label>
      </div>

      {(metodoPago === 'credito') && ( //Elegir método de pago (Crédito o Débito)
        <div className="mt-3">
          <h6 className="mb-2">{metodoPago === 'debito' ? 'Datos de tarjeta de débito' : 'Datos de tarjeta de crédito'}</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Número de tarjeta</label>
              <input
                className="form-control"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={tarjeta.numeroTarjeta}
                onChange={(e) => elegirTarjeta('numeroTarjeta', formatoTarjeta(e.target.value))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Nombre en la tarjeta</label>
              <input
                className="form-control"
                placeholder="Nombre del propietario de la Tarjeta"
                maxLength={35}
                value={tarjeta.nombreTarjeta}
                onChange={(e) => elegirTarjeta('nombreTarjeta', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Vencimiento (MM/AA)</label>
              <input
                className="form-control"
                placeholder="MM/AA"
                inputMode="numeric"
                autoComplete='cc-exp'
                maxLength={5}
                value={tarjeta.vencimientoTarjeta}
                onChange={(e) => elegirTarjeta('vencimientoTarjeta', formatoExpiracion(e.target.value))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">CVV</label>
              <input
                className="form-control"
                inputMode="numeric"
                autoComplete='cc-csc'
                placeholder="***"
                maxLength={3}
                value={tarjeta.cvvTarjeta}
                onChange={(e) => elegirTarjeta('cvvTarjeta', formatoCvv(e.target.value))}
              />
            </div>
            <div className="col-12">
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-outline-success dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Cuotas: {tarjeta.cuotasTarjeta}
                </button>
                <ul className="dropdown-menu">
                  {[...Array(10)].map((_, i) => {
                    const n = i + 1;
                    return (
                      <li key={n}>
                        <button
                          type="button"
                          className={`dropdown-item ${tarjeta.cuotasTarjeta === n ? 'active' : ''}`}
                          onClick={() => elegirTarjeta('cuotasTarjeta', n)}
                        >
                          {n}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {(metodoPago === 'debito') && ( //Elegir método de pago (Crédito o Débito)
        <div className="mt-3">
          <h6 className="mb-2">{metodoPago === 'debito' ? 'Datos de tarjeta de débito' : 'Datos de tarjeta de crédito'}</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Número de tarjeta</label>
              <input
                className="form-control"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={tarjeta.numeroTarjeta}
                onChange={(e) => elegirTarjeta('numeroTarjeta', formatoTarjeta(e.target.value))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Nombre en la tarjeta</label>
              <input
                className="form-control"
                placeholder="Nombre del propietario de la Tarjeta"
                maxLength={35}
                value={tarjeta.nombreTarjeta}
                onChange={(e) => elegirTarjeta('nombreTarjeta', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Vencimiento (MM/AA)</label>
              <input
                className="form-control"
                placeholder="MM/AA"
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
                value={tarjeta.vencimientoTarjeta}
                onChange={(e) => elegirTarjeta('vencimientoTarjeta', formatoExpiracion(e.target.value))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">CVV</label>
              <input
                className="form-control"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="***"
                maxLength={3}
                value={tarjeta.cvvTarjeta}
                onChange={(e) => elegirTarjeta('cvvTarjeta', formatoCvv(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {metodoPago === 'transferencia' && ( // Elegir método de pago "Transferencia"
        <div className="mt-3">
            <h6 className="mb-2">Transferencia bancaria</h6>
            <div className="alert alert-secondary">
            Realiza la transferencia a:
            <ul className="mb-0">
                <li>Banco: BancoEstado</li>
                <li>Tipo de cuenta: Cuenta Corriente</li>
                <li>Número: 12-345-67890</li>
                <li>Titular: BALANCENEW EMPRESA</li>
                <li>RUT: 12.345.678-9</li>
                <li>Correo para comprobante: pagos@balancenew.com</li>
            </ul>
            Una vez realizada, envía el comprobante al correo indicado, se demorará entre 1 - 4 horas en responder nuestros agentes.
            </div>
        </div>
        )}
    </div>
  );
}