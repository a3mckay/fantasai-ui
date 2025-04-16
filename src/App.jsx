// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatInterface from "./ChatInterface";
import LoginForm from "./components/LoginForm";
import AuthGuard from "./components/AuthGuard";
import WriterDashboard from "./components/WriterDashboard";
import "./App.css";

// ✅ Moved ChatPage outside the App function to avoid input re-renders
const ChatPage = ({ isAuthenticated, inputPassword, setInputPassword, handleLogin, canExport }) => (
  <div className="app-container">
    {!isAuthenticated ? (
      <div className="login-screen">
        <h2>🔒 Enter Password to Access Halp-Bot 2000</h2>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    ) : (
      <ChatInterface canExport={canExport} />
    )}
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [canExport, setCanExport] = useState(false);

  const handleLogin = () => {
    if (inputPassword === "halprules") {
      setIsAuthenticated(true);
      setCanExport(false);
    } else if (inputPassword === "secretlogin") {
      setIsAuthenticated(true);
      setCanExport(true);
    } else {
      alert("Incorrect password.");
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ChatPage
              isAuthenticated={isAuthenticated}
              inputPassword={inputPassword}
              setInputPassword={setInputPassword}
              handleLogin={handleLogin}
              canExport={canExport}
            />
          }
        />
        <Route path="/writers" element={<LoginForm />} />
        <Route
          path="/writers/dashboard"
          element={
            <AuthGuard>
              <WriterDashboard />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
