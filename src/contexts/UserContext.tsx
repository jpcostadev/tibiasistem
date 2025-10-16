import React from "react";
import useFetch from "../hooks/useFetch"; // Importa o hook de busca de dados assíncrona

// Define o tipo do usuário esperado da API
type User = {
  id: number; // ID do usuário
  nome: string; // Nome do usuário
  idade: number; // Idade do usuário
  aulas: number; // Número de aulas assistidas
  cursos: number; // Número de cursos feitos
  preferencias: {
    // Preferências do usuário para vídeo
    playback: number; // Velocidade de reprodução
    volume: number; // Volume padrão
    qualidade: "baixa" | "media" | "alta"; // Qualidade de reprodução
  };
};

// Define o formato do valor que será compartilhado via contexto
type useCont = {
  data: User | null; // Dados do usuário (ou null enquanto carrega)
  loading: boolean; // Indica se os dados estão sendo carregados
};

// Cria o contexto com tipo `useCont` ou null como fallback
export const UserContext = React.createContext<useCont | null>(null);

// Hook personalizado para acessar o contexto de forma segura
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === null)
    throw new Error("O Contexto deve estar dentro de um provider"); // Garante que seja usado dentro de <UserContextProvider>
  return context;
};

// Provider que envolve os componentes e fornece os dados carregados
export const UserContextProvider = ({ children }: React.PropsWithChildren) => {
  // Usa o hook de fetch tipado com <User> para buscar os dados da API
  const { data, loading } = useFetch<User>(
    "https://data.origamid.dev/usuarios/1",
  );

  return (
    <UserContext.Provider value={{ data, loading }}>
      {children} {/* Renderiza os filhos dentro do Provider */}
    </UserContext.Provider>
  );
};

/*
=================================================================================================
📘 EXPLICAÇÃO GERAL – CONTEXTO DE USUÁRIO COM FETCH TIPADO

🔹 O QUE ESSE ARQUIVO FAZ?
Esse arquivo cria um Contexto React que fornece os dados de um usuário vindos da API
de forma global para a aplicação — ou seja, qualquer componente pode acessar esses dados
sem precisar fazer o `fetch` de novo.

---------------------------------------------------------------------------------------
🔶 1. TYPE `User`
Define a estrutura exata dos dados que a API deve retornar. Isso permite:
- Tipagem estática no TypeScript
- Autocompletar em editores
- Segurança contra dados faltando ou errados

---------------------------------------------------------------------------------------
🔶 2. TYPE `useCont`
Define o formato de valor que o contexto vai expor:
{ data: User | null, loading: boolean }

---------------------------------------------------------------------------------------
🔶 3. `UserContext`
Cria o contexto com valor inicial `null`, que depois será preenchido no Provider.

---------------------------------------------------------------------------------------
🔶 4. `useUser`
Hook customizado que facilita o uso do contexto nos componentes.
Inclui uma verificação de segurança para garantir que o hook só seja usado dentro do provider.

---------------------------------------------------------------------------------------
🔶 5. `UserContextProvider`
- Usa o `useFetch<User>()` para buscar os dados da API apenas uma vez.
- Envolve os componentes filhos e fornece `{ data, loading }` como valor do contexto.
- Isso evita múltiplas requisições e centraliza o estado global do usuário.

---------------------------------------------------------------------------------------
🔹 COMO USAR?
```tsx
import { useUser } from './UserContext';

const Perfil = () => {
  const { data, loading } = useUser();

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Usuário não encontrado</p>;

  return <h1>Bem-vindo, {data.nome}</h1>;
};
*/
