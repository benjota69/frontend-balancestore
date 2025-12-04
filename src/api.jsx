// Definición de la API del backend

// const API_BASE = "http://100.31.86.178:8080"; // URL backend en EC2 (comentada para uso local)
const API_BASE = "http://localhost:8080"; // URL backend en localhost para desarrollo

// Catálogo completo
export const obtenerCatalogo = async () => {
  try {
    const resp = await fetch(`${API_BASE}/api/productos`);
    if (!resp.ok) throw Error("No se pudo obtener el catálogo");
    return await resp.json();
  } catch (error) {
    console.log(error);
    return { total_products: 0, products: [] };
  }
};

// Guardar boleta/compra en el backend
export const guardarBoleta = async (boleta) => {
  const resp = await fetch(`${API_BASE}/api/boletas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boleta),
  });

  if (!resp.ok) {
    const mensaje = await resp.text();
    throw new Error(mensaje || "No se pudo guardar la boleta");
  }

  return await resp.json();
};

// Buscar 1 producto por id así poder ingresar a "catalogo/{id}"
export const obtenerProductoPorId = async (id) => {
  try {
    const data = await obtenerCatalogo();
    const list = Array.isArray(data) ? data : (data.products || []);
    return list.find((p) => String(p.id ?? p._id) === String(id)) || null;
  } catch (e) {
    return null;
  }
};

// Registro de usuario en el backend
export const registrarUsuario = async ({ username, nombreCompleto, email, password }) => {
  const payload = {
    username,
    name: nombreCompleto,
    email,
    password,
  };

  const resp = await fetch(`${API_BASE}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const mensaje = await resp.text();
    throw new Error(mensaje || "No se pudo registrar el usuario");
  }

  return await resp.json();
};

// Login contra el backend
export const loginUsuario = async ({ identifier, password }) => {
  const resp = await fetch(`${API_BASE}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  if (!resp.ok) {
    const mensaje = await resp.text();
    throw new Error(mensaje || "Credenciales inválidas");
  }

  return await resp.json();
};