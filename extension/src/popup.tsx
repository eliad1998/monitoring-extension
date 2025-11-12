import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import Login from "./components/login";
import LoggedIn from "./components/logged";
import { getToken, saveToken, type IAuthToken } from "./storage";

function IndexPopup() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  // useEffect(() => {
  //   getToken().then(storedToken => {
  //     if (storedToken) {
  //       setToken(storedToken);
  //       setUsername("User");
  //     }
  //   });
  // }, []);

  const handleLoginSuccess = (token_data: IAuthToken, user: string) => {
    console.log("whyyy");
    console.log("Heree, received token:", token_data);
    saveToken(token_data);
  };

  return (
    <Container component="main">
      {token ? (
        <LoggedIn username={username} />
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </Container>
  );
}

export default IndexPopup;