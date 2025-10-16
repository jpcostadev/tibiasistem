import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Header from "./components/header/Header";
import Ranking from "./pages/ranking/Ranking";
import { UiContext } from "./contexts/UiContext";
import { UserContextProvider } from "./contexts/UserContext";
import Container from "./utils/Container";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Container>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ranking" element={<Ranking />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
