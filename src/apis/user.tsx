import { API_URL } from "./config";

// Interfaces para tipagem
interface UserBody {
  username: string;
  password: string;
  email?: string;
  character_name?: string;
  guild_token?: string;
}

interface UserUpdateBody {
  username?: string;
  email?: string;
  character_name?: string;
  guild_token?: string;
  online?: boolean;
}

interface ResetPasswordBody {
  user_id: string;
  new_password: string;
}

interface ApiRequest {
  url: string;
  options: {
    method: string;
    headers: {
      "Content-Type"?: string;
      Authorization?: string;
    };
    body?: string;
  };
}

// Função que gera uma requisição POST para criar um novo usuário
export function USER_POST(body: UserBody): ApiRequest {
  return {
    url: API_URL + "/api/user",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}

export function USER_PUT(id: string, body: UserUpdateBody): ApiRequest {
  const token = window.localStorage.getItem("token"); // Obtém o token armazenado

  return {
    url: `${API_URL}/api/user/${id}`, // URL para atualizar o usuário
    options: {
      method: "PUT", // Usando o método PUT para atualização
      headers: {
        "Content-Type": "application/json", // Especifica que o conteúdo enviado é JSON
        Authorization: `Bearer ${token}`, // Passa o token para autorização
      },
      body: JSON.stringify(body), // Converte o corpo da requisição para JSON
    },
  };
}

// Função para resetar senha do usuário
export function USER_RESET_PASSWORD(
  userId: string,
  newPassword: string,
): ApiRequest {
  const token = window.localStorage.getItem("token");

  return {
    url: `${API_URL}/api/user/reset-password`,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        new_password: newPassword,
      }),
    },
  };
}

// Função que gera uma requisição GET para buscar informações de um usuário
export function USER_GET(token: string): ApiRequest {
  return {
    url: API_URL + "/api/user",
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function USER_GET_ID(id: string): ApiRequest {
  const token = window.localStorage.getItem("token");
  return {
    url: API_URL + `/api/user/${id}`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function USER_GET_USERNAME(username: string): ApiRequest {
  const token = window.localStorage.getItem("token");
  return {
    url: API_URL + `/api/user/username/${username}`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}
