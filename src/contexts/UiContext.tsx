import React from "react";

// Define a interface do contexto: um booleano "dark" e a função "setDark" para alterar seu valor
type IUiContext = {
  dark: boolean; // Indica se o tema escuro está ativado
  setDark: React.Dispatch<React.SetStateAction<boolean>>; // Função para alterar o estado "dark"
};

// Cria o contexto com valor inicial "null" (o valor real será fornecido pelo Provider)
export const UiContext = React.createContext<IUiContext | null>(null);

// Hook personalizado para consumir o contexto de forma segura
export const useUi = () => {
  const context = React.useContext(UiContext); // Acessa o contexto

  // Se o contexto for null, significa que está sendo usado fora do UiContextProvider
  if (context === null)
    throw new Error("useContext deve estar dentro do Provider"); // Erro claro para debug

  return context; // Retorna o contexto com { dark, setDark }
};

// Componente Provider que encapsula o contexto e fornece seus valores para os filhos
export const UiContextProvider = ({ children }: React.PropsWithChildren) => {
  const [dark, setDark] = React.useState(false); // Estado que define se o tema é escuro (inicia como false)

  return (
    // Fornece os valores "dark" e "setDark" para os componentes dentro do Provider
    <UiContext.Provider value={{ dark, setDark }}>
      {children} {/* Renderiza os componentes filhos dentro do Provider */}
    </UiContext.Provider>
  );
};
