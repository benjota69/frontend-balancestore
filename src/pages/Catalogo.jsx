// Página Catalogo que llama el componente "Productos" y muestra el Catalogo.
import Productos from "../components/Productos";

export default function Catalogo() {

  return (
    <div>
      <Productos
        title="Catálogo"
        showFilters={true}
        showSorting={true}
      />
    </div>
  );
}


