import React from "react";
import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
import Loading from "./ui/Loading";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
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

  // Se o usuário está logado, redireciona para o dashboard
  if (login === true) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não está logado, renderiza a página pública (login/register)
  return <>{children}</>;
};

export default PublicRoute;
