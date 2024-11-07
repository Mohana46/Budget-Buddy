import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, Fab, Dialog } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import ExpenseForm from '../components/form';
import Table from '../components/table'; 
import Dashboard from '../pages/Dashboard'; 
import Report from '../pages/report';
const HomePage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [navigateToDashboard, setNavigateToDashboard] = useState(false); 
  const [navigateToReport, setNavigateToReport] = useState(false); 
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get('https://budget-buddy-gho3.onrender.com/api/users/current', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUsername(response.data.username);
          setUserId(response.data.id);
        } catch (error) {
          console.log('Error fetching current user:', error);
          setError('Failed to fetch user information');
          navigate('/');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/');
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleDashboardClick = () => {
    setNavigateToDashboard(true);
    setNavigateToReport(false); 
    handleMenuClose();
  };

  const handleReportClick = () => {
    setNavigateToReport(true);
    setNavigateToDashboard(false); 
    handleMenuClose();
  };

  const handleHomeClick = () => {
    setNavigateToDashboard(false); 
    setNavigateToReport(false); 
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  if (loading) return <Typography align="center">Loading...</Typography>;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BudgetBuddy
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {username || 'Guest'}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              <MenuItem onClick={handleDashboardClick}>Dashboard</MenuItem>
              <MenuItem onClick={handleReportClick}>Report</MenuItem> {/* New Report Menu Item */}
              <MenuItem onClick={handleHomeClick}>Home</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" sx={{ fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' } }}>
          Welcome {username}!
        </Typography>
        <Box mt={2}>
          <Typography variant="body1" align="center" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}>
            Easy Tracking, Easy Savings.
          </Typography>
        </Box>
        {error && <Typography color="error" align="center">{error}</Typography>}

        {navigateToDashboard ? (
          <Dashboard userId={userId} /> 
        ) : navigateToReport ? (
          <Report userId={userId} />
        ) : (
          <Table userId={userId} /> 
        )}
        
      </Container>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={toggleDialog} 
      >
        <AddIcon />
      </Fab>
      <Dialog open={dialogOpen} onClose={toggleDialog} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { height: '100vh' } }}>
        <ExpenseForm handleClose={toggleDialog} userId={userId} />
      </Dialog>
    </>
  );
};

export default HomePage;
