import React from "react";

// Hook personalizado para rastrear consultas de mídia
const useMedia = (media: string) => {
  const [match, setMatch] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Função para verificar se a consulta de mídia corresponde
    function changeMatch() {
      const { matches } = window.matchMedia(media);
      setMatch(matches); // Atualiza o estado com o resultado da consulta de mídia
    }

    changeMatch(); // Verificação inicial

    // Adiciona listener para mudanças na mídia (em vez de resize)
    const mediaQueryList = window.matchMedia(media);
    mediaQueryList.addEventListener("change", changeMatch);

    return () => {
      mediaQueryList.removeEventListener("change", changeMatch);
    };
  }, [media]);

  return match;
};

export default useMedia;

/*
Este componente personalizado useMedia é útil para rastrear consultas de mídia em React. Ele usa a API window.matchMedia para verificar se a mídia especificada (como largura da janela) corresponde a uma consulta específica. O estado match é atualizado com o resultado da consulta de mídia e pode ser usado em componentes React para realizar ações com base em consultas de mídia, como tornar o layout responsivo. O ouvinte de redimensionamento da janela é adicionado durante o ciclo de vida do componente e removido quando o componente é desmontado, evitando vazamentos de memória.
*/
