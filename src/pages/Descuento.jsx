// Página Descuento especialmente para mostrar solo los Productos en DESCUENTO.
// Llama el componente "Productos" nuevamente para reutilizar el Catálogo
// pero con un filtro aplicado que es SOLO descuento.

import Productos from "../components/Productos";

export default function Descuento() {

  return (
    <Productos
      title="Productos en Descuento"
      subtitle="¡Aprovecha nuestras mejores ofertas!"
      showFilters={false}
      showSorting={false}
      filterByDiscount={true}
      />

  );
}


