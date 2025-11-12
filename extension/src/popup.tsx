import React from "react";
import { Container } from '@mui/material';
import Login from "./components/login";

function IndexPopup() {
  console.log("API URL:", process.env.PLASMO_PUBLIC_API_URL || "ENV NOT LOADED");

  return (
    <Container component="main"> 
      <Login />
    </Container>
  );
}

export default IndexPopup;