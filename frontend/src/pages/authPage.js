import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, TextField, Container, Paper, Box, CircularProgress, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTheme, useMediaQuery } from '@mui/material';
import videoSource from '../video/video.mp4'; 

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    const url = isSignUp ? 'https://budget-buddy-gho3.onrender.com/api/users/register' : 'https://budget-buddy-gho3.onrender.com/api/users/login';
    setLoading(true);
    try {
      const response = await axios.post(url, data);
      setLoading(false);
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      navigate('/HomePage'); 
    } catch (error) {
      setLoading(false);
      if (!isSignUp) {
        setError(error.response?.data?.message || 'Invalid email or password!');
      } else {
        setError(error.response?.data?.message || 'Sign-up failed! Please try again.');
      }
    }
  };

  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

  return (
    <>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.7
        }}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">BudgetBuddy</Typography>
        </Toolbar>
      </AppBar>

      {/* Authentication Form */}
      <Container component="main" maxWidth="xs" style={{ marginTop: '50px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} align="center">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={2}>
              {isSignUp && (
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Username"
                  {...register('username', { required: 'Username is required' })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                type="email"
                {...register('email', { required: 'Email is required', pattern: /^\S+@\S+\.\S+$/ })}
                error={!!errors.email}
                helperText={errors.email ? 'Enter a valid email' : ''}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: passwordPattern,
                      message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character'
                    }
                  })}
                  error={!!errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              {error && <Typography color="error">{error}</Typography>}
              {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              ) : (
                <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
              )}
            </Box>
          </form>
          <Button onClick={() => setIsSignUp(!isSignUp)} fullWidth style={{ marginTop: '10px' }}>
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default AuthPage;
