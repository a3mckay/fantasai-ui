// src/components/AuthGuard.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const AuthGuard = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/writers");
      }
      setCheckingAuth(false); // Done checking
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return <p>Loading authentication...</p>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
