import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import HeroPanel from "./components/HeroPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordUpdate from "./components/PasswordUpdate";
import Search from "./components/Search";
import GorevAl from "./components/GorevAl";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Anasayfa burada */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gorev-al" element={<GorevAl />} />
        <Route path="/password-update" element={<PasswordUpdate />} />
        <Route path="/search-members" element={<Search />} />
        <Route path="*" element={<Login />} /> {/* Diğer tüm sayfalar login */}
        {/* 🔐 Sadece admin + moderator erişebilir */}
        <Route
          path="/heropanel"
          element={
            <ProtectedRoute allowedRoles={["admin", "moderator"]}>
              <HeroPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
