import { post } from "./http";

/**
 * Realiza login e retorna token JWT + dados do usuário
 */
export async function login(nmLogin, senhaPura) {
  const response = await post("/auth/login", { nmLogin, senhaPura });
  // Resposta esperada: { token: "...", usuario: {...} }
  return response;
}

/**
 * Solicita recuperação de senha
 */
export async function forgotPassword(email) {
  const response = await post("/auth/esqueceu-senha", { email });
  // Resposta esperada: { token: "...", email: "...", mensagem: "..." }
  return response;
}

/**
 * Reseta senha usando token de recuperação
 */
export async function resetPassword(token, novaSenhaPura) {
  const response = await post("/auth/reset-senha", { token, novaSenhaPura });
  return response;
}
