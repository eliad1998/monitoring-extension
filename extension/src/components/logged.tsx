import React from "react";
import { Box, Typography } from "@mui/material";

interface ILoggedInProps {
  username: string;
}

const LoggedIn: React.FC<ILoggedInProps> = ({ username }) => {
  return (
    <Box
      sx={{
        width: 300,
        margin: "auto",
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        borderRadius: 1,
        boxShadow: 2,
        backgroundColor: "white",
      }}
    >
      <Typography component="h1" variant="h6" sx={{ mb: 2 }}>
        Welcome {username}!
      </Typography>
    </Box>
  );
};

export default LoggedIn;
