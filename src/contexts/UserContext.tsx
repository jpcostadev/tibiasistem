import React from "react";
import { TOKEN_POST, TOKEN_VALIDATE_POST } from "../apis/auth";
import { USER_GET, USER_POST } from "../apis/user";
import { useNavigate } from "react-router-dom";

// Criação de um contexto para gerenciamento de dados de usuário
export const UserContext = React.createContext<{
  userLogin: (username: string, password: string) => Promise<void>;
  userRegister: (userData: {
    username: string;
    password: string;
    email: string;
    character_name: string;
    guild_token: string;
  }) => Promise<void>;
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
    setData(null);
    setError(null);
    setLoading(false);
    setLogin(false);
    window.localStorage.removeItem("token");
  }, []);

  // Função para buscar dados do usuário usando um token
  async function getUser(token: string) {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setLogin(true);
  }

  // Função para fazer login do usuário
  async function userLogin(username: string, password: string) {
    try {
      setError(null);
      setLoading(true);

      console.log("🚀 INICIANDO LOGIN...");
      console.log("Username:", username);
      console.log("Password:", password);

      const { url, options } = TOKEN_POST({ username, password });
      console.log("URL da requisição:", url);
      console.log("Options:", options);

      const response = await fetch(url, options);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const errorMessage = response.statusText || "Dados inválidos";
      if (!response.ok) throw new Error(`Error: ${errorMessage}`);

      const responseData = await response.json();
      console.log("Response data:", responseData);

      const { token } = responseData;
      console.log("Token extraído:", token);

      window.localStorage.setItem("token", token);
      console.log("Token salvo no localStorage!");
      console.log("Token no localStorage:", localStorage.getItem("token"));

      await getUser(token);
      navigate("/dashboard");
    } catch (err) {
      console.error("ERRO NO LOGIN:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  // Função para fazer registro do usuário
  async function userRegister(userData: {
    username: string;
    password: string;
    email: string;
    character_name: string;
    guild_token: string;
  }) {
    try {
      setError(null);
      setLoading(true);

      console.log("🚀 INICIANDO REGISTRO...");
      console.log("UserData:", userData);
      console.log("Guild Token:", userData.guild_token);

      const { url, options } = USER_POST(userData);
      console.log("URL da requisição:", url);
      console.log("Options:", options);

      const response = await fetch(url, options);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok)
        throw new Error(`Erro no registro: ${response.statusText}`);

      const newUser = await response.json();
      console.log("Usuário criado:", newUser);

      window.localStorage.setItem("token", userData.guild_token);
      console.log("Token salvo no localStorage!");
      console.log("Token no localStorage:", localStorage.getItem("token"));

      setData(newUser);
      setLogin(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("ERRO NO REGISTRO:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLogin(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Hook de efeito para realizar o login automático do usuário se um token estiver armazenado
  React.useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          setError(null);
          setLoading(true);
          // Se tem token, busca os dados do usuário diretamente
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
  }, [userLogout]);

  // Fornecimento de dados e funções de contexto para os componentes filhos
  return (
    <UserContext.Provider
      value={{
        userLogin,
        userRegister,
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
