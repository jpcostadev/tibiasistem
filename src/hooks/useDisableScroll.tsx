import { useEffect } from "react";

/**
 * Hook para desabilitar o scroll da página quando um modal está aberto
 * @param isOpen - boolean que indica se o modal está aberto
 */
const useDisableScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Salva a posição atual do scroll
      const scrollY = window.scrollY;

      // Desabilita o scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Reabilita o scroll e restaura a posição
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
};

export default useDisableScroll;
