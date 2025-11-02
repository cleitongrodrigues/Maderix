export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");
export const IS_MOCK = !API_BASE_URL;

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || "Erro de requisição";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function get(path, options = {}) {
  if (!API_BASE_URL) throw new Error("NO_API_BASE_URL");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Accept": "application/json", ...(options.headers || {}) },
    credentials: options.credentials || "include",
  });
  return parseResponse(res);
}

export async function post(path, body, options = {}) {
  if (!API_BASE_URL) throw new Error("NO_API_BASE_URL");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json", ...(options.headers || {}) },
    body: JSON.stringify(body || {}),
    credentials: options.credentials || "include",
  });
  return parseResponse(res);
}
