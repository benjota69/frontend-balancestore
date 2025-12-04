// Página Home, página principal de la tienda
// Se llama el Componente "DeslizarTexto" en el arriba del todo de la página.
// Se muestra el banner grande que se muestra al medio.

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import banner from "../img/bannergrande.png";
import DeslizarTexto from "../components/DeslizarTexto";
import Productos from "../components/Productos";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <DeslizarTexto
        className="w-100 py-2 border-top border-bottom"
        messages={[
          "¡La mejor tienda de tecnología y gaming!",
          "¡Envíos a todo Chile en compras sobre $45.000 🚚!",
          "Calidad 100% garantizada 💯",
        ]}
      />

      <div className="full-bleed mb-2">
        <img
          src={banner}
          alt="Banner"
          style={{ width:'100%', height:'50vh', objectFit:'cover', objectPosition:'top', display:'block' }}
        />
      </div>

      {/* Hero simple sin imagen */}
      <div className="hero-box mb-4" style={{background:'#e9f5ec', border:'1px solid #cfe8d8', borderRadius:8, padding:'24px 20px'}}>
        <h3 style={{color:'#2e7d32', marginBottom:8}}>Productos Electrónicos y Gaming</h3>
        <p style={{marginBottom:12}}>Explora productos en audio, accesorios y gaming con descuentos simples.</p>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success" onClick={() => navigate('/app/catalogo')}>Ver catálogo</button>
          <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/app/catalogo?cat=audio')}>Audio</button>
          <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/app/catalogo?cat=accesorios')}>Accesorios</button>
          <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/app/catalogo?cat=streaming')}>Streaming</button>
        </div>
      </div>

      {/* Tarjetas de promociones/tendencias */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100 promo-card">
            <img src="https://i.ibb.co/Kj5LDFTK/imagen-2025-10-08-184948785.png" className="card-img-top promo-img" alt="Tendencias en audio" style={{height: 200, objectFit: 'contain', background:'#fff'}} />
            <div className="card-body">
              <h5 className="card-title">Tendencias en Periféricos</h5>
              <p className="card-text">Auriculares, teclados y mouses al mejor precio.</p>
              <button className="btn btn-success btn-sm" onClick={() => navigate('/app/catalogo')}>Ver más</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 promo-card">
            <img src="https://i.ibb.co/ym1Hq7fN/image.png" className="card-img-top promo-img" alt="Descuentos en accesorios" style={{height: 200, objectFit: 'contain', background:'#fff'}} />
            <div className="card-body">
              <h5 className="card-title">Componentes para tu PC</h5>
              <p className="card-text">Tarjetas de video, memorias RAM, discos duros y más.</p>
              <button className="btn btn-success btn-sm" onClick={() => navigate('/app/catalogo')}>Ver más</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 promo-card">
            <img src="https://i.ibb.co/jPDbGkBb/image.png" className="card-img-top promo-img" alt="Novedades gaming" style={{height: 200, objectFit: 'contain', background:'#fff'}} />
            <div className="card-body">
              <h5 className="card-title">Accesorios para tu Streaming</h5>
              <p className="card-text">Cámaras, micrófonos y más para tu streaming.</p>
              <button className="btn btn-success btn-sm" onClick={() => navigate('/app/catalogo')}>Ver más</button>
            </div>
          </div>
        </div>
          <hr></hr>
          <Productos
            title ="Ofertas Destacadas"
            subtitle="Los mejores descuentos del día"
            showFilters={false}
            showSorting={false}
            filterByDiscount={true}
            limit={4}
            className="mb-4"
          /> 
           <button className="btn btn-success btn-sm" onClick={() => navigate('/app/descuento')}>Ver más</button>
      </div>
    </div>
  );
}


