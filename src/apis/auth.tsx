import { API_URL } from "./config";

// Função que gera uma requisição POST para obter um token de autenticação
export function TOKEN_POST(body: { username: string; password: string }) {
  return {
    url: API_URL + "/jwt-auth/v1/token",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}

// Função que gera uma requisição POST para validar um token de autenticação
export function TOKEN_VALIDATE_POST(token: string) {
  return {
    url: API_URL + "/jwt-auth/v1/token/validate",
    options: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

// Função que gera uma requisição POST para enviar email de recuperação de senha
export function FORGOT_PASSWORD_POST(body: { email: string }) {
  return {
    url: API_URL + "/api/user/forgot-password",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}
