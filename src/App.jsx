import React, { useState } from "react";
import './App.css';
import ChatInterface from "./ChatInterface";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [canExport, setCanExport] = useState(false); // ✅ New state for export access

  const handleLogin = () => {
    if (inputPassword === "halprules") {
      setIsAuthenticated(true);
      setCanExport(false); // regular login
    } else if (inputPassword === "secretlogin") {
      setIsAuthenticated(true);
      setCanExport(true); // export access
    } else {
      alert("Incorrect password.");
    }
  };

  return (
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
};

export default App;
