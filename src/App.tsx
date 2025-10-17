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
import { UiContext } from "./contexts/UiContext";
import { UserStorage } from "./contexts/UserContext";
import Container from "./utils/Container";
import useMedia from "./hooks/useMedia";
import HeaderMobile from "./components/header/mobile/HeaderMobile";

function App() {
  const isMobile = useMedia("(max-width: 920px)");
  console.log(isMobile);
  return (
    <BrowserRouter>
      <UserStorage>
        {isMobile ? <HeaderMobile /> : <Header />}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </UserStorage>
    </BrowserRouter>
  );
}

export default App;
