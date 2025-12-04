// Prueba unitaria dos, Componente "Navbar.jsx"
// Checkea si renderiza correctamente el componente Navbar y sus enlaces principales.
// Muestra contador del carrito correctamente.

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import Navbar from "../src/components/Navbar";

const CART_KEY = "cart_items";

describe("Componente Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renderiza branding, enlaces principales y muestra el contador correcto del carrito", () => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify([
        { id: 1, title: "x", price: 10, image: "", qty: 2 },
        { id: 2, title: "y", price: 5, image: "", qty: 1 },
      ])
    );

    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={["/app"]}>
            <Navbar />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    expect(screen.getByText("BalanceStore")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /descuentos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nosotros/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contacto/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /carrito\s*\(3\)/i })).toBeInTheDocument();
  });
});