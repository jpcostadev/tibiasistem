import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Header from "./components/header/Header";
import Ranking from "./pages/ranking/Ranking";
import { UiContext } from "./contexts/UiContext";
import { UserContextProvider } from "./contexts/UserContext";
import Container from "./utils/Container";
import useMedia from "./hooks/useMedia";
import HeaderMobile from "./components/header/mobile/HeaderMobile";
import Teste from "./utils/Teste";

function App() {
  const isMobile = useMedia("(max-width: 920px)");
  console.log(isMobile);
  return (
    <UserContextProvider>
      <BrowserRouter>
        {isMobile ? <HeaderMobile /> : <Header />}
        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ranking" element={<Ranking />} />
          </Routes>
          <Teste />
        </Container>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
