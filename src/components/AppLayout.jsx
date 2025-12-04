// Componente Encargado de Cerrar Sesión correctamente. (no mostrar Footer ni el navbar al salir)

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="container py-3 page-fade">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}


