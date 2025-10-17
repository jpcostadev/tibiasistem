import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Header from "./components/header/Header";
import Ranking from "./pages/ranking/Ranking";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import Hunts from "./pages/hunts/Hunts";
import { UiContext } from "./contexts/UiContext";
import { UserStorage } from "./contexts/UserContext";
import Container from "./utils/Container";
import useMedia from "./hooks/useMedia";
import HeaderMobile from "./components/header/mobile/HeaderMobile";
import { MobileNavigation } from "./components/footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const isMobile = useMedia("(max-width: 920px)");
  return (
    <BrowserRouter>
      <UserStorage>
        {isMobile ? <HeaderMobile /> : <Header />}
        <Routes>
          {/* Rotas Públicas - Redirecionam se já logado */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Rotas Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hunts"
            element={
              <ProtectedRoute>
                <Hunts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ranking"
            element={
              <ProtectedRoute>
                <Ranking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        {isMobile && <MobileNavigation />}
      </UserStorage>
    </BrowserRouter>
  );
}

export default App;
