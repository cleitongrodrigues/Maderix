import { post, IS_MOCK } from "./http";

export async function forgotPassword(email) {
  if (IS_MOCK) {
    // Simula solicitação de recuperação
    await new Promise((r) => setTimeout(r, 700));
    return { message: "Se existir uma conta com este email, enviaremos instruções para redefinição." };
  }
  return post("/auth/forgot-password", { email });
}

export async function resetPassword(token, newPassword) {
  if (IS_MOCK) {
    // Simula redefinição
    await new Promise((r) => setTimeout(r, 900));
    return { message: "Senha redefinida com sucesso" };
  }
  return post("/auth/reset-password", { token, newPassword });
}
