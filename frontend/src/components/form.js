import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Container } from '@mui/material';
import axios from 'axios';

const ExpenseForm = ({ handleClose, userId }) => {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    date: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('authToken'); 
      if (!formData.type || !formData.amount || !formData.description || !formData.date || !formData.category) {
        console.error('Please fill in all fields.');
        return; // Stop submission if validation fails
      }

      const response = await axios.post(
        'http://localhost:8080/api/expenses/add',
        {
          ...formData,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      console.log('Expense added:', response.data);
      handleClose(); 
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  const categories = formData.type === 'Income'
    ? ['Salary', 'Investments']
    : ['Food', 'Transport', 'Entertainment', 'Bills', 'Rent', 'Other'];

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '20px' }}>
      <Typography variant="h5" align="center">
        Add New Entry
      </Typography>
      <form>
        <Box mt={1}>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleSubmit} // Submit form on click
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ExpenseForm;
