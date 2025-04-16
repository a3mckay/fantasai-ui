// src/components/LoginForm.jsx
import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isNewUser) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/writers/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/writers/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <div className="login-screen">
        <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
          <h2>{isNewUser ? "Sign Up" : "Log In"}</h2>
          <form onSubmit={handleEmailLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /><br />
            <button type="submit">{isNewUser ? "Sign Up" : "Log In"}</button>
          </form>
          <button onClick={handleGoogleLogin} style={{ marginTop: "1rem" }}>
            Sign in with Google
          </button>
          <p>
            {isNewUser ? "Already have an account?" : "New here?"}{" "}
            <button onClick={() => setIsNewUser(!isNewUser)}>
              {isNewUser ? "Log In" : "Sign Up"}
            </button>
          </p>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );

};

export default LoginForm;
