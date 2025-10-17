import React from "react";

// Hook genérico para buscar dados de uma API com suporte a loading, error e abort
function useFetch<T>(url: RequestInfo | URL, options?: RequestInit) {
  const [data, setData] = React.useState<T | null>(null); // Estado para armazenar os dados retornados
  const [loading, setLoading] = React.useState(false); // Estado que indica se está carregando
  const [error, setError] = React.useState<string | null>(null); // Estado para armazenar erros (se houver)

  // Referência que guarda as opções da requisição (garante estabilidade entre renders)
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  React.useEffect(() => {
    // Cria um controlador para permitir o cancelamento da requisição (ex: ao desmontar o componente)
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true); // Começa a carregar
    setData(null); // Zera os dados anteriores

    // Função que faz a requisição
    async function fetchData() {
      try {
        const req = await fetch(url, {
          signal, // Permite abortar a requisição se necessário
          ...optionsRef.current, // Adiciona as opções passadas pelo usuário
        });

        if (!req.ok) throw new Error(`Error ${req.status}`); // Se a resposta for um erro HTTP

        const res = (await req.json()) as T; // Converte para o tipo genérico T

        if (!signal.aborted) setData(res); // Se não foi cancelado, atualiza o estado
      } catch (err) {
        // Se ocorreu erro E não foi um cancelamento
        if (!signal.aborted && err instanceof Error) setError(err.message);
      } finally {
        // Finaliza o carregamento (caso não tenha sido abortado)
        if (!signal.aborted) setLoading(false);
      }
    }

    fetchData(); // Chama a função ao montar o componente

    // Cleanup: cancela a requisição se o componente desmontar ou a URL mudar
    return () => {
      controller.abort();
    };
  }, [url]); // Executa o efeito novamente somente se a URL mudar

  // Retorna os dados, o estado de loading e erros (se houverem)
  return { data, loading, error };
}

export default useFetch;

/*
==========================================================================================
📘 EXPLICAÇÃO DO HOOK useFetch<T>

Esse é um hook genérico de React que faz requisições HTTP e controla três estados:
- `data`: os dados retornados da API
- `loading`: booleano indicando se a requisição está em andamento
- `error`: mensagem de erro, caso ocorra algum problema

🧠 Ele é genérico (<T>), ou seja, você informa qual o tipo de dado que espera da API.
Exemplo: useFetch<User>('https://api...') → data será do tipo User

🛑 Usa `AbortController` para permitir cancelar a requisição caso o componente seja desmontado.
Isso evita memory leaks e erros de "can't update unmounted component".

📌 Usa `useRef` para manter as opções da requisição (headers, etc.) estáveis entre renders.

🔁 O `useEffect` roda sempre que a `url` muda, refazendo a requisição com os novos parâmetros.

📤 Retorno:
  {
    data: T | null,
    loading: boolean,
    error: string | null
  }

🔄 Esse hook é reutilizável e desacoplado: pode ser usado com qualquer endpoint e qualquer tipo de dado.
==========================================================================================
*/
