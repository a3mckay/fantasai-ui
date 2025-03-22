import React, { useState } from "react";
// In main.jsx or main.tsx
import './App.css'; // or './App.css' or whatever your CSS file is

import ChatInterface from "./ChatInterface";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  const correctPassword = "halprules"; // 🔒 Change this later

  const handleLogin = () => {
    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password.");
    }
  };

  return (
    <div className="app-container"> {/* ✅ Global styling wrapper */}
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
        <ChatInterface />
      )}
    </div>
  );
};

export default App;
