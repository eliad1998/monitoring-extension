import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import Login from "./components/login";
import LoggedIn from "./components/logged";
import { getToken, saveToken } from "./StorageApi";
import { type IAuthToken } from "./types";

function IndexPopup() {
  const [token, setToken] = useState<IAuthToken | null>(null);

  useEffect(() => {
    getToken().then(storedToken => {
      if (storedToken) {
        setToken(storedToken);
      }
    });
  }, []);

  // FIXME: Token does not persist after login
  // I thought it is due to after pop up is closed it loses state
  // So I moved the storage functions to background script
  // But still the same issue occurs.
  // Need to verify that token is actually saved in background storage
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