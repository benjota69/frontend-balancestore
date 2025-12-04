// Página de Contacto, con datos de la empresa
// Formulario para mandar un correo en caso de un problema o duda.

import { useState } from 'react';

export default function Contacto() {
    const [email, setEmail] = useState('');
    const [asunto, setAsunto] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            errs.email = 'Ingrese correo.';
        } else if (!emailRegex.test(email)) {
            errs.email = 'El correo no es válido.';
        }
        if (!asunto.trim()) {
            errs.asunto = 'Debe ingresar un asunto.';
        }
        if (asunto.length < 20) {
            errs.asunto = 'El asunto debe tener un mínimo de 20 caracteres.';
        }
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length === 0) {
            alert('Mensaje enviado');
            setEmail('');
            setAsunto('');
        }
    };

    return (
        <>
            <div>
                <h1 style={{color:'#1b5e20'}} >Contacto</h1>
                <hr></hr>
                <h3 style={{color:'#1b5e20'}}>¿Tienes alguna pregunta?</h3>
                <p>Puedes contactarnos a través de nuestro correo electrónico: <a href="mailto:contacto@balancenew.com">contacto@balancenew.com</a></p>
                <p>O a través de nuestro número de teléfono: <a href="tel:+56912345678">+56 9 1234 5678</a></p>
                <p>O a través de nuestro WhatsApp: <a href="https://wa.me/56912345678">+56 9 1234 5678</a></p>
                <p>O a través de nuestro Facebook: <a href="https://www.facebook.com/balancenew">Facebook</a></p>
                <p>O a través de nuestro Twitter: <a href="https://www.twitter.com/balancenew">Twitter</a></p>
                <p>O a través de nuestro Instagram: <a href="https://www.instagram.com/balancenew">Instagram</a></p>

                <h3 style={{color:'#1b5e20'}}> Formulario de contacto</h3>
            </div>

            <div className='card'>
                <div className='card-body'>
                    <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                        id="email"
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}

                    <label htmlFor="asunto" className="form-label" style={{marginTop:10}}>Asunto</label>
                    <textarea
                        id="asunto"
                        className={`form-control ${errors.asunto ? 'is-invalid' : ''}`}
                        rows="3"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        required
                    />
                    {errors.asunto && <div className="invalid-feedback">{errors.asunto}</div>}

                    <button type="submit" className="btn btn-success" style={{marginTop:10}}>
                        Enviar
                    </button>
                    </form>
                </div>
                
            </div>
        </>
    );
}
