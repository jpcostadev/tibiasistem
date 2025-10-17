import React from "react";
import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
import Loading from "./ui/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { login, loading } = useUser();

  // Se está carregando, mostra um loading
  if (loading) {
    return (
      <Loading
        text="Verificando autenticação..."
        size="large"
        fullScreen={true}
      />
    );
  }

  // Se o usuário está logado, renderiza os componentes filhos
  if (login === true) {
    return <>{children}</>;
  }

  // Se o login é falso, redireciona para a página de login
  if (login === false) {
    return <Navigate to="/login" replace />;
  }

  // Caso o estado de login seja null (ainda verificando), não renderiza nada
  return <></>;
};

export default ProtectedRoute;
