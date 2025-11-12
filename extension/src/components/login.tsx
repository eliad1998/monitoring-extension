import React, { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';


interface ILoginModel {
  email: string;
  password: string;
}

interface IFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const validateForm = (data: ILoginModel): IFormErrors => {
  const errors: IFormErrors = {};

  if (!data.email.trim()) {
    errors.email = "Email field is required.";
  }

  if (!data.password.trim()) {
    errors.password = "Password field is required.";
  }

  return errors;
};


const Login = () => {
  const [formData, setFormData] = useState<ILoginModel>({
    email: "",
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

    // 1. Client-Side Validation
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setServerError(null); // Clear previous server error

    const isValid = Object.keys(validationErrors).length === 0;

    if (!isValid) {
      return; // Stops form submission
    }

    // 2. API Submission Logic
    setIsLoading(true); // Start loading

    try {
      // Replace with your actual API endpoint

      const LOGIN_API = process.env.PLASMO_PUBLIC_API_URL + '/login';

      const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if the response was successful (HTTP status 200-299)
      if (response.ok) {
        // Assume successful login returns user data or a success token
        const data = await response.json();
        console.log("Login Successful!", data);

        // --- Add your success handling logic here (e.g., redirect, save token) ---

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
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          // Disable while loading
          disabled={isLoading}
          error={!!errors.email}
          helperText={errors.email}
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