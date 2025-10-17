import React from "react";
import { TOKEN_POST, TOKEN_VALIDATE_POST } from "../apis/auth";
import { USER_GET } from "../apis/user";
import { useNavigate } from "react-router-dom";

// Criação de um contexto para gerenciamento de dados de usuário
export const UserContext = React.createContext<{
  userLogin: (username: string, password: string) => Promise<void>;
  userLoginWithRedirect: (username: string, password: string) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<null>>;
  userLogout: () => void;
  getUser: (token: string) => Promise<void>;
  updateUserData: (token: string) => Promise<void>;
  data: unknown;
  error: string | null;
  loading: boolean;
  login: boolean | null;
} | null>(null);

// Componente de contexto para gerenciamento de dados de usuário
export const UserStorage = ({ children }: React.PropsWithChildren) => {
  // Estados para armazenar os dados do usuário, estado de login, estado de carregamento e erros
  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Hook de navegação para redirecionar o usuário para diferentes rotas
  const navigate = useNavigate();

  // Função para buscar os dados do usuário usando um token
  async function fetchUserData(token: string) {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = USER_GET(token);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
      const userData = await response.json();
      setData(userData);
      setLogin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  // Função para atualizar os dados do usuário no contexto
  const updateUserData = async (token: string) => {
    try {
      const { url, options } = USER_GET(token);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
      const userData = await response.json();
      setData(userData);
      setLogin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLogin(false);
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout do usuário
  const userLogout = React.useCallback(async function () {
    // Limpar todos os estados
    setData(null);
    setError(null);
    setLoading(false);
    setLogin(false);

    // Limpar localStorage completamente
    try {
      window.localStorage.clear();
    } catch (error) {
      // Erro ao limpar localStorage
    }

    // Limpar sessionStorage também
    try {
      const sessionStorageKeys = Object.keys(window.sessionStorage);

      // Limpar cache inteligente especificamente
      const guildCacheKeys = sessionStorageKeys.filter((key) =>
        key.startsWith("guild_cache_"),
      );

      guildCacheKeys.forEach((key) => {
        window.sessionStorage.removeItem(key);
      });

      // Limpar sessionStorage completamente
      window.sessionStorage.clear();
    } catch (error) {
      // Erro ao limpar sessionStorage
    }

    // Limpar cache do navegador se possível
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
      } catch (error) {
        // Erro ao limpar cache
      }
    }

    // Forçar reload da página para garantir limpeza completa
    window.location.href = "/login";
  }, []);

  // Função para buscar dados do usuário usando um token
  const getUser = React.useCallback(
    async (token: string) => {
      const { url, options } = USER_GET(token);
      const response = await fetch(url, options);

      if (!response.ok) {
        userLogout();
        return;
      }

      const json = await response.json();

      if (!json || !json.user_id) {
        userLogout();
        return;
      }

      setData(json);
      setLogin(true);
    },
    [userLogout],
  );

  // Função para fazer login do usuário (sem redirecionamento)
  async function userLogin(username: string, password: string) {
    try {
      setError(null);
      setLoading(true);

      const { url, options } = TOKEN_POST({ username, password });

      const response = await fetch(url, options);

      if (!response.ok) {
        // Tentar extrair mensagem de erro da resposta
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Se não conseguir parsear JSON, usar statusText
        }

        // Mapear códigos de status para mensagens específicas
        switch (response.status) {
          case 401:
            throw new Error(
              "Credenciais inválidas. Verifique seu username e senha",
            );
          case 403:
            throw new Error("Acesso negado. Sua conta pode estar suspensa");
          case 404:
            throw new Error("Usuário não encontrado");
          case 500:
            throw new Error(
              "Erro interno do servidor. Tente novamente mais tarde",
            );
          default:
            throw new Error(
              `Erro no login (${response.status}): ${errorMessage}`,
            );
        }
      }

      const responseData = await response.json();

      const { token } = responseData;

      window.localStorage.setItem("token", token);

      await getUser(token);
      // Não redireciona aqui - deixa o componente controlar
    } catch (err) {
      console.error("ERRO NO LOGIN:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  // Função para fazer login com redirecionamento automático
  async function userLoginWithRedirect(username: string, password: string) {
    await userLogin(username, password);
    if (login) {
      navigate("/dashboard");
    }
  }

  // Função para validar se o token ainda é válido
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const { url, options } = USER_GET(token);
      const response = await fetch(url, options);

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      if (!userData || !userData.user_id) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  // Hook de efeito para realizar o login automático do usuário se um token estiver armazenado
  React.useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          setError(null);
          setLoading(true);

          // Validar token antes de buscar dados
          const isTokenValid = await validateToken(token);
          if (!isTokenValid) {
            userLogout();
            return;
          }

          // Se tem token válido, busca os dados do usuário
          await getUser(token);
        } catch (err) {
          userLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLogin(false);
      }
    }
    autoLogin();
  }, [userLogout, getUser]);

  // Hook para detectar mudanças no localStorage e validar token
  React.useEffect(() => {
    const handleStorageChange = async () => {
      const token = window.localStorage.getItem("token");
      if (!token && login) {
        userLogout();
      } else if (token && login) {
        // Validar token periodicamente
        const isTokenValid = await validateToken(token);
        if (!isTokenValid) {
          userLogout();
        }
      }
    };

    // Listener para mudanças no localStorage
    window.addEventListener("storage", handleStorageChange);

    // Validar token a cada 30 segundos se estiver logado
    const interval = setInterval(handleStorageChange, 30000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [login, userLogout]);

  // Fornecimento de dados e funções de contexto para os componentes filhos
  return (
    <UserContext.Provider
      value={{
        userLogin,
        userLoginWithRedirect,
        setData,
        userLogout,
        getUser,
        updateUserData,
        data,
        error,
        loading,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acessar o contexto de forma segura
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === null)
    throw new Error("O Contexto deve estar dentro de um provider");
  return context;
};

/*
Neste código:

Cria-se um contexto chamado UserContext para gerenciar os dados do usuário.

Define-se o componente UserStorage que é um provedor de contexto para gerenciar os dados do usuário.

Usa-se o estado data para armazenar os dados do usuário, login para rastrear o status de login, loading para controlar o estado de carregamento e error para rastrear mensagens de erro.

O hook useNavigate é usado para obter uma função de navegação que permite redirecionar o usuário para diferentes rotas.

fetchUserData é uma função assíncrona para buscar os dados do usuário usando um token. Ela atualiza os estados de acordo com o resultado da busca.

updateUserData é outra função assíncrona para atualizar os dados do usuário no contexto.

userLogout é uma função de logout que limpa os dados do usuário do estado e do armazenamento local.

getUser é uma função que busca os dados do usuário usando um token e atualiza o estado.

userLogin é uma função para fazer login do usuário, que também armazena o token no armazenamento local e redireciona o usuário para a rota "/dashboard".

O hook de efeito useEffect é usado para realizar login automático se um token estiver armazenado no armazenamento local.

O contexto é fornecido para os componentes filhos, permitindo que eles acessem as funções e estados relacionados ao usuário
*/
