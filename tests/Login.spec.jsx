// Prueba unitaria uno, Componente "Login.jsx" checkea si se puede crear y iniciar una cuenta correctamente.
// INICIA SESIÓN CON DATOS VÁLIDOS Y NAVEGA A "/app"
// Checkeo de errores cuando no existe el usuario
// Checkeo de errores cuando no es correcta la contraseña

import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import Login from "../src/components/Login";

const USERS_KEY = "appUsers";

describe("Componente Login", () => {
  beforeEach(() => {
    localStorage.clear(); 
  });

  it("inicia sesión con credenciales válidas y navega a /app", async () => {
    const usuario = { username: "pepe", email: "pepe@mail.com", password: "1234" };
    localStorage.setItem(USERS_KEY, JSON.stringify([usuario]));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/app" element={<div>App OK</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await userEvent.type(screen.getByPlaceholderText("tuusuario o correo@dominio.com"), "pepe");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "1234");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("App OK")).toBeInTheDocument();
  });

  it("muestra error cuando el usuario no existe", async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/app" element={<div>App OK</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await userEvent.type(screen.getByPlaceholderText("tuusuario o correo@dominio.com"), "usuario_inexistente");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "1234");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("Usuario o correo no encontrado")).toBeInTheDocument();
  });

  it("muestra error cuando la contraseña es incorrecta", async () => {
    const usuario = { username: "pepe", email: "pepe@mail.com", password: "1234" };
    localStorage.setItem(USERS_KEY, JSON.stringify([usuario]));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/app" element={<div>App OK</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await userEvent.type(screen.getByPlaceholderText("tuusuario o correo@dominio.com"), "pepe");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "contraseña_incorrecta");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("Contraseña incorrecta")).toBeInTheDocument();
  });
});