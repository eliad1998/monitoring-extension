import React from "react";
import { Container } from '@mui/material';
// ייבוא הקומפוננטה החדשה שמכילה את טופס הכניסה
import Login from "./components/login";

function IndexPopup() {
  return (
    <Container component="main"> 
      <Login />
    </Container>
  );
}

export default IndexPopup;