import React, { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';
import { saveToken } from "../storage"


interface ILoginModel {
  username: string;
  password: string;
}

interface IFormErrors {
  username?: string;
  password?: string;
  general?: string;
}


interface LoginProps {
  onSuccess: (tokenData: any, username: string) => void;
}

const validateForm = (data: ILoginModel): IFormErrors => {
  const errors: IFormErrors = {};

  if (!data.username.trim()) {
    errors.username = "Username field is required.";
  }

  if (!data.password.trim()) {
    errors.password = "Password field is required.";
  }

  return errors;
};


const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ILoginModel>({
    username: "",
    password: "",
  });

  // State for managing form errors (validation + API errors)
  const [errors, setErrors] = useState<IFormErrors>({});

  // New state for handling loading status and server errors
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Function to handle changes in input fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Clear client-side errors and server error when the user starts typing
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof IFormErrors];
      delete newErrors.general;
      return newErrors;
    });
    setServerError(null); // Clear server error

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents page reload

    // Client-Side Validation
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setServerError(null); // Clear previous server error

    const isValid = Object.keys(validationErrors).length === 0;

    if (!isValid) {
      return; // Stops form submission
    }

    setIsLoading(true); // Start loading

    try {
      const LOGIN_API = process.env.PLASMO_PUBLIC_API_URL + '/user/login';

      const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Assume successful login returns user data or a success token
        const token_data = await response.json();
        await saveToken(token_data);
        onSuccess(token_data, formData.username); // קורא להורה עם האובייקט ושם המשתמש
      } else {
        // Handle failed login attempts (e.g., wrong credentials, status 401)
        const errorData = await response.json();

        // Display a specific error message from the server if available
        const errorMessage = errorData.message || 'Login failed. Please check your credentials.';
        setServerError(errorMessage);
      }

    } catch (error) {
      // Handle network errors (e.g., API is offline, no internet)
      console.error("Network Error during login:", error);
      setServerError("Could not connect to the login server. Please check your connection.");
    } finally {
      setIsLoading(false); // Stop loading regardless of success/failure
    }
  };

  
  return (
    <Box
      sx={{
        width: 300,
        margin: 'auto',
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        borderRadius: 1,
        boxShadow: 2,
        backgroundColor: 'white',
      }}
    >
      <Typography component="h1" variant="h6" sx={{ mb: 2 }}>
        Login
      </Typography>

      <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ mt: 1, width: '100%' }}>

        {/* General Error Message (Client or Server) */}
        {(errors.general || serverError) && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
            {errors.general || serverError}
          </Typography>
        )}

        <TextField
          margin="dense"
          required
          fullWidth
          id="username"
          label="username"
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          // Disable while loading
          disabled={isLoading}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          margin="dense"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          // Disable while loading
          disabled={isLoading}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 1 }}
          // Show Circular Progress/Loading text if needed, or simply disable
          disabled={isLoading}
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;