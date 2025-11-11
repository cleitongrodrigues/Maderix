export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api").replace(/\/$/, "");
export const IS_MOCK = false; // Mudado para usar API real

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }
  if (!res.ok) {
    // Tratamento especial para 401 - redirecionar para login
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    const message = (data && (data.message || data.error)) || res.statusText || "Erro de requisição";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Função para obter headers com token JWT
function getHeaders(customHeaders = {}) {
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...customHeaders
  };
  
  // Adiciona token JWT se existir
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export async function get(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: getHeaders(options.headers),
    credentials: options.credentials || "same-origin",
  });
  return parseResponse(res);
}

export async function post(path, body, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getHeaders(options.headers),
    body: JSON.stringify(body || {}),
    credentials: options.credentials || "same-origin",
  });
  return parseResponse(res);
}

export async function put(path, body, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: getHeaders(options.headers),
    body: JSON.stringify(body || {}),
    credentials: options.credentials || "same-origin",
  });
  return parseResponse(res);
}

export async function patch(path, body, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: getHeaders(options.headers),
    body: body ? JSON.stringify(body) : undefined,
    credentials: options.credentials || "same-origin",
  });
  return parseResponse(res);
}

export async function del(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: getHeaders(options.headers),
    credentials: options.credentials || "same-origin",
  });
  return parseResponse(res);
}
