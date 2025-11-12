import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import Login from "./components/login";
import LoggedIn from "./components/logged";
import { getToken, saveToken, type IAuthToken } from "./storage";

function IndexPopup() {
  const [token, setToken] = useState<IAuthToken | null>(null);

  useEffect(() => {
    getToken().then(storedToken => {
      if (storedToken) {
        setToken(storedToken);
      }
    });
  }, []);

  const handleLoginSuccess = (tokenData: IAuthToken) => {
    console.log("Heree, received token:", tokenData);
    saveToken(tokenData);
    setToken(tokenData);
  };

  return (
    <Container component="main">
      {token ? (
        <LoggedIn username={token.username} />
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </Container>
  );
}

export default IndexPopup;